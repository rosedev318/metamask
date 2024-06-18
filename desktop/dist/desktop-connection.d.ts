/// <reference types="node" />
import { Duplex } from 'stream';
import EventEmitter from 'events';
import { ConnectionType, VersionCheckResult, RemotePort, PairingKeyStatus } from './types';
export default class DesktopConnection extends EventEmitter {
    private stream;
    private multiplex;
    private newConnectionStream;
    private endConnectionStream;
    private stateStream;
    private disableStream;
    private browserControllerStream;
    private versionCheck;
    private extensionPairing;
    private extensionVersion;
    private paired;
    constructor(stream: Duplex, extensionVersion: string);
    setPaired(): void;
    /**
     * Creates a connection with the MetaMask Desktop via a multiplexed stream.
     *
     * @param remotePort - The port provided by a new context.
     * @param connectionType - Whether or not the new context is external (page or other extension).
     * @param uiStream - A paused stream to communicate with the remote port.
     */
    createStream(remotePort: RemotePort, connectionType: ConnectionType, uiStream: Duplex): Promise<void>;
    transferState(): Promise<void>;
    checkVersions(): Promise<VersionCheckResult>;
    checkPairingKey(): Promise<PairingKeyStatus>;
    private onDisable;
    private onUIStreamEnd;
    private onDesktopState;
    private sendNewConnectionMessage;
    private addPairedOnlyDataListener;
    private restart;
    private generateClientId;
}
