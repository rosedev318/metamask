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
exports.Pairing = void 0;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const obj_multiplex_1 = __importDefault(require("obj-multiplex"));
const log_1 = __importDefault(require("./utils/log"));
const stream_1 = require("./utils/stream");
const totp_1 = __importDefault(require("./utils/totp"));
const symmetric_1 = require("./encryption/symmetric");
const crypto_1 = require("./utils/crypto");
const types_1 = require("./types");
const rawState = __importStar(require("./utils/state"));
const browser_1 = require("./browser");
class Pairing {
    constructor(stream, transferState) {
        const streams = this.createStreams(stream);
        this.requestStream = streams.requestStream;
        this.keyStream = streams.keyStream;
        this.transferState = transferState;
    }
    static generateOTP() {
        const value = totp_1.default.generate();
        log_1.default.debug('Generated OTP', value);
        return value;
    }
    init() {
        (0, stream_1.addDataListener)(this.requestStream, (data) => {
            this.onRequestMessage(data);
        });
        return this;
    }
    async checkPairingKeyMatch() {
        log_1.default.debug('Validating pairing key');
        const requestPairingKey = {
            isRequestPairingKey: true,
        };
        this.keyStream.write(requestPairingKey);
        // Wait for desktop pairing key
        const response = await (0, stream_1.waitForMessage)(this.keyStream);
        const desktopPairingKey = response.pairingKey;
        if (!desktopPairingKey) {
            log_1.default.debug('Desktop has no pairing key');
            return types_1.PairingKeyStatus.MISSING;
        }
        const desktopPairingKeyHash = await (0, crypto_1.hashString)(desktopPairingKey, {
            isHex: true,
        });
        const extensionPairingKeyHash = (await rawState.getDesktopState())
            .pairingKeyHash;
        const isMatch = extensionPairingKeyHash === desktopPairingKeyHash;
        log_1.default.debug('Completed pairing key check', isMatch);
        if (isMatch) {
            return types_1.PairingKeyStatus.MATCH;
        }
        return types_1.PairingKeyStatus.NO_MATCH;
    }
    async onRequestMessage(pairingRequest) {
        log_1.default.debug('Received pairing request message', pairingRequest);
        const isValidOTP = totp_1.default.validate(pairingRequest.otp);
        if (!isValidOTP) {
            log_1.default.debug('Received invalid OTP');
            const pairingResultMessage = {
                isDesktopEnabled: false,
            };
            this.requestStream.write(pairingResultMessage);
            return;
        }
        const pairingKey = Buffer.from(await (0, symmetric_1.createKey)()).toString('hex');
        const pairingKeyHash = await (0, crypto_1.hashString)(pairingKey, { isHex: true });
        await rawState.setDesktopState({
            desktopEnabled: true,
            pairingKeyHash,
        });
        const pairingResultMessage = {
            isDesktopEnabled: true,
            pairingKey,
        };
        this.requestStream.write(pairingResultMessage);
        await (0, stream_1.waitForAcknowledge)(this.requestStream);
        log_1.default.debug('Saved pairing key', { pairingKey, pairingKeyHash });
        await this.transferState();
        browser_1.browser.runtime.reload();
        log_1.default.debug('Paired with desktop');
    }
    createStreams(stream) {
        const multiplex = new obj_multiplex_1.default();
        const requestStream = multiplex.createStream('request');
        const keyStream = multiplex.createStream('key');
        stream.pipe(multiplex).pipe(stream);
        return { requestStream, keyStream };
    }
}
exports.Pairing = Pairing;
//# sourceMappingURL=pairing.js.map