"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const end_of_stream_1 = __importDefault(require("end-of-stream"));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const obj_multiplex_1 = __importDefault(require("obj-multiplex"));
const log_1 = __importDefault(require("./utils/log"));
const pairing_1 = require("./pairing");
const version_check_1 = require("./version-check");
const utils_1 = require("./utils/utils");
const stream_1 = require("./utils/stream");
const state_1 = require("./utils/state");
const constants_1 = require("./constants");
const browser_1 = require("./browser");
class DesktopConnection extends events_1.default {
    constructor(stream, extensionVersion) {
        super();
        this.paired = false;
        this.stream = stream;
        this.extensionVersion = extensionVersion;
        this.multiplex = new obj_multiplex_1.default();
        this.newConnectionStream = this.multiplex.createStream(constants_1.CLIENT_ID_NEW_CONNECTION);
        this.endConnectionStream = this.multiplex.createStream(constants_1.CLIENT_ID_END_CONNECTION);
        this.stateStream = this.multiplex.createStream(constants_1.CLIENT_ID_STATE);
        this.addPairedOnlyDataListener(this.stateStream, (data) => {
            this.onDesktopState(data);
        });
        this.disableStream = this.multiplex.createStream(constants_1.CLIENT_ID_DISABLE);
        this.addPairedOnlyDataListener(this.disableStream, (data) => this.onDisable(data));
        const pairingStream = this.multiplex.createStream(constants_1.CLIENT_ID_PAIRING);
        this.extensionPairing = new pairing_1.Pairing(pairingStream, () => this.transferState()).init();
        const versionStream = this.multiplex.createStream(constants_1.CLIENT_ID_VERSION);
        this.versionCheck = new version_check_1.VersionCheck(versionStream, this.extensionVersion);
        this.browserControllerStream = this.multiplex.createStream(constants_1.CLIENT_ID_BROWSER_CONTROLLER);
        this.stream.pipe(this.multiplex).pipe(this.stream);
    }
    setPaired() {
        this.paired = true;
        (0, browser_1.registerResponseStream)(this.browserControllerStream);
    }
    /**
     * Creates a connection with the MetaMask Desktop via a multiplexed stream.
     *
     * @param remotePort - The port provided by a new context.
     * @param connectionType - Whether or not the new context is external (page or other extension).
     * @param uiStream - A paused stream to communicate with the remote port.
     */
    async createStream(remotePort, connectionType, uiStream) {
        const clientId = this.generateClientId();
        const clientStream = this.multiplex.createStream(clientId);
        uiStream.pipe(clientStream).pipe(uiStream);
        (0, end_of_stream_1.default)(uiStream, () => {
            this.onUIStreamEnd(clientId, clientStream);
        });
        this.sendNewConnectionMessage(remotePort, clientId, connectionType);
        uiStream.resume();
    }
    async transferState() {
        const stateToTransfer = await (0, state_1.getAndUpdateDesktopState)({
            desktopEnabled: true,
        });
        const filteredState = (0, state_1.removePairingKeyFromRawState)(stateToTransfer);
        this.stateStream.write(filteredState);
        await (0, stream_1.waitForAcknowledge)(this.stateStream);
        log_1.default.debug('Sent extension state to desktop');
    }
    async checkVersions() {
        return await this.versionCheck.check();
    }
    async checkPairingKey() {
        return await this.extensionPairing.checkPairingKeyMatch();
    }
    async onDisable(state) {
        log_1.default.debug('Received desktop disable message');
        if (state) {
            await (0, state_1.setRawState)(state);
            log_1.default.debug('Synchronised with final desktop state');
        }
        else {
            await (0, state_1.setDesktopState)({
                desktopEnabled: false,
                pairingKey: undefined,
                pairingKeyHash: undefined,
            });
            log_1.default.debug('Disabled desktop mode');
        }
        (0, stream_1.acknowledge)(this.disableStream);
        this.restart();
    }
    onUIStreamEnd(clientId, clientStream) {
        log_1.default.debug('Port stream closed', clientId);
        clientStream.end();
        if (!this.endConnectionStream) {
            log_1.default.error('End connection stream not initialised');
            return;
        }
        this.endConnectionStream.write({ clientId });
    }
    async onDesktopState(rawState) {
        const newRawState = await (0, state_1.addPairingKeyToRawState)(rawState);
        await (0, state_1.setRawState)(newRawState);
        log_1.default.debug('Synchronised state with desktop');
    }
    sendNewConnectionMessage(remotePort, clientId, connectionType) {
        if (!this.newConnectionStream) {
            log_1.default.error('New Connection stream not initialised');
            return;
        }
        const newConnectionMessage = {
            clientId,
            connectionType,
            remotePort: {
                name: remotePort.name,
                sender: remotePort.sender,
            },
        };
        log_1.default.debug('Sending new connection message', newConnectionMessage);
        this.newConnectionStream.write(newConnectionMessage);
    }
    addPairedOnlyDataListener(stream, listener) {
        (0, stream_1.addDataListener)(stream, (data) => {
            if (!this.paired) {
                log_1.default.debug('Ignoring message as not paired');
                return;
            }
            listener(data);
        });
    }
    async restart() {
        log_1.default.debug('Restarting extension');
        browser_1.browser.runtime.reload();
    }
    generateClientId() {
        return (0, utils_1.uuid)();
    }
}
exports.default = DesktopConnection;
//# sourceMappingURL=desktop-connection.js.map