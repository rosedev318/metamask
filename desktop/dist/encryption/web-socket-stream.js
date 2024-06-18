"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const log_1 = __importDefault(require("../utils/log"));
const constants_1 = require("../constants");
const web_socket_stream_1 = require("../web-socket-stream");
const stream_2 = require("../utils/stream");
const utils_1 = require("../utils/utils");
const asymmetricEncryption = __importStar(require("./asymmetric"));
const symmetricEncryption = __importStar(require("./symmetric"));
const HANDSHAKE_RESEND_INTERVAL = 1000;
const HANDSHAKE_TIMEOUT = 10000;
var HandshakeMode;
(function (HandshakeMode) {
    HandshakeMode[HandshakeMode["START"] = 0] = "START";
    HandshakeMode[HandshakeMode["WAIT"] = 1] = "WAIT";
    HandshakeMode[HandshakeMode["RECEIVED"] = 2] = "RECEIVED";
})(HandshakeMode || (HandshakeMode = {}));
class EncryptedWebSocketStream extends stream_1.Duplex {
    constructor(webSocket) {
        super({ objectMode: true });
        this.webSocket = webSocket;
        this.performingHandshake = true;
    }
    async init({ startHandshake }) {
        this.webSocketStream = new web_socket_stream_1.WebSocketStream(this.webSocket);
        this.webSocketStream.on('data', (data) => this.onMessage(data));
        this.asymmetricKeyPair = asymmetricEncryption.createKeyPair();
        this.symmetricKey = await symmetricEncryption.createKey();
        await (0, utils_1.timeoutPromise)(this.handshake(startHandshake ? HandshakeMode.START : HandshakeMode.WAIT), HANDSHAKE_TIMEOUT, {
            errorMessage: 'Encryption handshake timed out',
            cleanUp: () => {
                if (this.resendInterval) {
                    clearInterval(this.resendInterval);
                }
            },
        });
    }
    _read() {
        return undefined;
    }
    async _write(msg, _, cb) {
        await this.writeSymmetric(msg, cb);
    }
    async onMessage(data) {
        if (this.performingHandshake) {
            return;
        }
        if (data === constants_1.MESSAGE_HANDSHAKE_START) {
            await this.handshake(HandshakeMode.RECEIVED);
            return;
        }
        const decryptedData = await this.decryptSymmetric(data);
        this.push(decryptedData);
    }
    async handshake(mode) {
        log_1.default.debug('Starting handshake');
        this.cork();
        this.pause();
        this.performingHandshake = true;
        this.targetPublicKey = undefined;
        this.targetSymmetricKey = undefined;
        const sendFirst = mode === HandshakeMode.START;
        await this.handshakeStep(() => {
            this.writeRaw(constants_1.MESSAGE_HANDSHAKE_START);
        }, async (data) => data === constants_1.MESSAGE_HANDSHAKE_START ? data : undefined, sendFirst, mode === HandshakeMode.RECEIVED);
        log_1.default.debug('Received handshake');
        this.targetPublicKey = await this.handshakeStep(() => {
            this.writeRaw({ publicKey: this.asymmetricKeyPair?.publicKey });
        }, async (data) => data.publicKey, sendFirst);
        log_1.default.debug('Received public key', this.targetPublicKey);
        this.targetSymmetricKey = await this.handshakeStep(() => {
            this.writeAsymmetric({ symmetricKey: this.symmetricKey });
        }, async (data) => {
            const decryptedData = this.decryptAsymmetric(data);
            return decryptedData?.symmetricKey;
        }, sendFirst);
        log_1.default.debug('Received symmetric key', this.targetSymmetricKey);
        await this.handshakeStep(() => {
            this.writeSymmetric(constants_1.MESSAGE_HANDSHAKE_FINISH);
        }, async (data) => {
            const decryptedData = await this.decryptSymmetric(data);
            return decryptedData === constants_1.MESSAGE_HANDSHAKE_FINISH ? {} : undefined;
        }, sendFirst);
        log_1.default.debug('Completed handshake');
        this.uncork();
        this.resume();
        this.performingHandshake = false;
    }
    async handshakeStep(send, responseFilter, sendFirst, writeOnly = false) {
        if (sendFirst) {
            send();
        }
        let data;
        if (!writeOnly) {
            this.resendInterval = setInterval(() => {
                if (sendFirst) {
                    send();
                }
                else {
                    this.previousSendSecond?.();
                }
            }, HANDSHAKE_RESEND_INTERVAL);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            data = await (0, stream_2.waitForMessage)(this.webSocketStream, responseFilter, {
                returnFilterOutput: true,
            });
            clearInterval(this.resendInterval);
            this.resendInterval = undefined;
        }
        if (!sendFirst) {
            this.previousSendSecond = send;
            send();
        }
        return data;
    }
    async decryptSymmetric(data) {
        if (!this.targetSymmetricKey) {
            log_1.default.error('Target symmetric key not set');
            return undefined;
        }
        let decryptedData;
        try {
            decryptedData = await symmetricEncryption.decrypt(data.data, this.targetSymmetricKey, data.iv);
        }
        catch (error) {
            log_1.default.debug('Failed to decrypt symmetric encrypted web socket message', error);
            return undefined;
        }
        try {
            decryptedData = JSON.parse(decryptedData);
        }
        catch {
            // Ignore as data is not a serialised object
        }
        log_1.default.debug('Decrypted symmetric encrypted web socket message', (0, utils_1.flattenMessage)(decryptedData));
        return decryptedData;
    }
    decryptAsymmetric(data) {
        if (!this.asymmetricKeyPair) {
            log_1.default.error('Key pair not created');
            return undefined;
        }
        let decryptedData;
        try {
            decryptedData = asymmetricEncryption.decrypt(data, this.asymmetricKeyPair.privateKey);
        }
        catch (error) {
            log_1.default.debug('Failed to decrypt asymmetric encrypted web socket message', {
                error,
                data,
            });
            return undefined;
        }
        try {
            decryptedData = JSON.parse(decryptedData);
        }
        catch {
            // Ignore as data is not a serialised object
        }
        log_1.default.debug('Decrypted asymmetric encrypted web socket message', (0, utils_1.flattenMessage)(decryptedData));
        return decryptedData;
    }
    async writeSymmetric(data, cb) {
        if (!this.symmetricKey) {
            log_1.default.error('Symmetric key not created');
            return;
        }
        const rawData = typeof data === 'string' ? data : JSON.stringify(data);
        const encrypted = await symmetricEncryption.encrypt(rawData, this.symmetricKey);
        log_1.default.debug('Sending symmetric encrypted message to web socket');
        this.writeRaw(encrypted, cb);
    }
    writeAsymmetric(data, cb) {
        if (!this.targetPublicKey) {
            log_1.default.error('Target public key not set');
            return;
        }
        const rawData = typeof data === 'string' ? data : JSON.stringify(data);
        const encrypted = asymmetricEncryption.encrypt(rawData, this.targetPublicKey);
        log_1.default.debug('Sending asymmetric encrypted message to web socket');
        this.writeRaw(encrypted, cb);
    }
    writeRaw(rawData, cb = () => undefined) {
        if (!this.webSocketStream) {
            log_1.default.error('Web socket stream not initialised');
            return;
        }
        this.webSocketStream.write(rawData, undefined, cb);
    }
}
exports.default = EncryptedWebSocketStream;
//# sourceMappingURL=web-socket-stream.js.map