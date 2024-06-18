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
const extension_port_stream_1 = __importDefault(require("extension-port-stream"));
const end_of_stream_1 = __importDefault(require("end-of-stream"));
const log_1 = __importDefault(require("./utils/log"));
const browser_1 = require("./browser");
const config_1 = require("./utils/config");
const types_1 = require("./types");
const web_socket_stream_1 = require("./web-socket-stream");
const stream_1 = require("./utils/stream");
const RawState = __importStar(require("./utils/state"));
const web_socket_stream_2 = __importDefault(require("./encryption/web-socket-stream"));
const utils_1 = require("./utils/utils");
const constants_1 = require("./constants");
const desktop_connection_1 = __importDefault(require("./desktop-connection"));
const TIMEOUT_CONNECT = 10000;
const PAIRING_KEY_NOT_MATCH_ERROR_REASON = 'Desktop app is not recognized';
const PAIRING_KEY_NOT_MATCH_ERROR_CODE = 4000;
class DesktopManager {
    constructor() {
        this.transferredState = false;
        this.desktopState = {};
    }
    async init(extensionVersion) {
        this.extensionVersion = extensionVersion;
    }
    setState(state) {
        this.desktopState = state.DesktopController || {};
    }
    async getConnection() {
        if (!this.desktopState.desktopEnabled) {
            return undefined;
        }
        if (!this.desktopConnection) {
            await this.createConnection();
        }
        return this.desktopConnection;
    }
    isDesktopEnabled() {
        return this.desktopState.desktopEnabled === true;
    }
    async createStream(remotePort, connectionType) {
        const uiStream = new extension_port_stream_1.default(remotePort);
        uiStream.pause();
        uiStream.on('data', (data) => this.onUIMessage(data, uiStream));
        // Wrapping the original UI stream allows us to intercept messages required for error handling,
        // while still pausing messages from the UI until we are connected to the desktop.
        const uiInputStream = new stream_1.DuplexCopy(uiStream);
        uiInputStream.pause();
        uiStream.resume();
        (0, end_of_stream_1.default)(uiStream, () => {
            uiInputStream.destroy();
        });
        const desktopConnection = await this.getConnection();
        await desktopConnection?.createStream(remotePort, connectionType, uiInputStream);
    }
    async testConnection() {
        log_1.default.debug('Testing desktop connection');
        try {
            const connection = this.desktopConnection || (await this.createConnection());
            const versionCheckResult = await connection.checkVersions();
            log_1.default.debug('Connection test completed');
            return { isConnected: true, versionCheck: versionCheckResult };
        }
        catch (error) {
            let testConnectionResult = { isConnected: false };
            if (error?.message === PAIRING_KEY_NOT_MATCH_ERROR_REASON) {
                testConnectionResult = {
                    ...testConnectionResult,
                    pairingKeyCheck: types_1.PairingKeyStatus.NO_MATCH,
                };
            }
            log_1.default.debug('Connection test failed', error);
            return testConnectionResult;
        }
    }
    async createConnection() {
        const webSocket = await this.createWebSocket();
        const webSocketStream = (0, config_1.cfg)().webSocket.disableEncryption
            ? new web_socket_stream_1.WebSocketStream(webSocket)
            : new web_socket_stream_2.default(webSocket);
        try {
            await webSocketStream.init({ startHandshake: true });
        }
        catch (error) {
            log_1.default.error('Failed to initialise web socket stream', error);
            webSocket.close();
            throw error;
        }
        const connection = new desktop_connection_1.default(webSocketStream, this.extensionVersion);
        webSocket.addEventListener('close', (event) => {
            this.onDisconnect(webSocket, webSocketStream, connection, event.code);
        });
        log_1.default.debug('Created web socket connection');
        if (!(0, config_1.cfg)().skipOtpPairingFlow) {
            log_1.default.debug('Desktop enabled, checking pairing key');
            const pairingKeyStatus = await connection.checkPairingKey();
            if ([types_1.PairingKeyStatus.NO_MATCH].includes(pairingKeyStatus)) {
                log_1.default.error('The pairing key does not match, desktop app is not recognized');
                webSocket.close(PAIRING_KEY_NOT_MATCH_ERROR_CODE, PAIRING_KEY_NOT_MATCH_ERROR_REASON);
                throw new Error(PAIRING_KEY_NOT_MATCH_ERROR_REASON);
            }
            log_1.default.debug('Desktop app recognised');
        }
        if (!this.isDesktopEnabled()) {
            this.desktopConnection = connection;
            return connection;
        }
        connection.setPaired();
        await this.transferState(connection);
        this.desktopConnection = connection;
        return connection;
    }
    async onDisconnect(webSocket, stream, connection, closeEventCode) {
        log_1.default.debug('Desktop connection disconnected');
        stream.removeAllListeners();
        stream.destroy();
        webSocket.close();
        connection.removeAllListeners();
        if (connection === this.desktopConnection) {
            this.desktopConnection = undefined;
        }
        // Emit event to extension UI to show connection lost error
        // if close reason is not due "Desktop app is not recognized"
        if (closeEventCode !== PAIRING_KEY_NOT_MATCH_ERROR_CODE) {
            await browser_1.browser?.runtime?.sendMessage?.({
                type: constants_1.DESKTOP_HOOK_TYPES.DISCONNECT,
            });
        }
    }
    async onUIMessage(data, stream) {
        const method = data.data?.method;
        const id = data.data?.id;
        if (method === 'disableDesktopError') {
            await this.disable();
        }
        if (method === 'getDesktopEnabled') {
            stream.write({
                name: data.name,
                data: { jsonrpc: '2.0', result: true, id },
            });
        }
    }
    async transferState(connection) {
        if (this.transferredState) {
            return;
        }
        if (!(0, config_1.cfg)().isExtensionTest) {
            await connection.transferState();
        }
        this.transferredState = true;
    }
    async disable() {
        log_1.default.debug('Disabling desktop mode');
        await RawState.setDesktopState({
            desktopEnabled: false,
            pairingKey: undefined,
            pairingKeyHash: undefined,
        });
        browser_1.browser.runtime.reload();
    }
    async createWebSocket() {
        const waitForWebSocketOpen = new Promise((resolve) => {
            const webSocket = new WebSocket(`${(0, config_1.cfg)().webSocket.url}`);
            webSocket.addEventListener('open', () => {
                resolve(webSocket);
            });
        });
        return (0, utils_1.timeoutPromise)(waitForWebSocketOpen, TIMEOUT_CONNECT, {
            errorMessage: 'Timeout connecting to web socket server',
        });
    }
}
exports.default = new DesktopManager();
//# sourceMappingURL=desktop-manager.js.map