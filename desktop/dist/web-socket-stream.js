"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketStream = void 0;
const stream_1 = require("stream");
const log_1 = __importDefault(require("./utils/log"));
const utils_1 = require("./utils/utils");
const INTERVAL_WAIT_FOR_CONNECTED = 500;
const TIMEOUT_WAIT_FOR_CONNECTED = 3000;
class WebSocketStream extends stream_1.Duplex {
    constructor(webSocket) {
        super({ objectMode: true });
        this.webSocket = webSocket;
        this.isBrowser = !this.webSocket.on;
        if (this.isBrowser) {
            this.webSocket.addEventListener('message', (event) => this.onMessage(event.data));
        }
        else {
            this.webSocket.on('message', (message) => this.onMessage(message));
        }
    }
    init() {
        // For consistency with EncryptedWebSocketStream to avoid further code branches
    }
    _read() {
        return undefined;
    }
    async _write(msg, _, cb) {
        log_1.default.debug('Sending message to web socket');
        const rawData = typeof msg === 'string' ? msg : JSON.stringify(msg);
        try {
            await this.waitForSocketConnected(this.webSocket);
        }
        catch (error) {
            log_1.default.error('Timeout waiting for web socket to be writable');
            cb();
            return;
        }
        this.webSocket.send(rawData);
        cb();
    }
    async onMessage(rawData) {
        let data = rawData;
        try {
            data = JSON.parse(data);
        }
        catch {
            // Ignore as data is not a serialised object
        }
        log_1.default.debug('Received web socket message');
        this.push(data);
    }
    async waitForSocketConnected(socket) {
        let interval;
        return (0, utils_1.timeoutPromise)(new Promise((resolve) => {
            const isReady = () => socket.readyState === 1;
            if (isReady()) {
                resolve();
                return;
            }
            interval = setInterval(() => {
                if (isReady()) {
                    clearInterval(interval);
                    resolve();
                }
            }, INTERVAL_WAIT_FOR_CONNECTED);
        }), TIMEOUT_WAIT_FOR_CONNECTED, {
            cleanUp: () => {
                if (interval) {
                    clearInterval(interval);
                }
            },
        });
    }
}
exports.WebSocketStream = WebSocketStream;
//# sourceMappingURL=web-socket-stream.js.map