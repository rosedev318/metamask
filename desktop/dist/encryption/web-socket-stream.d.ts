/// <reference types="node" />
import { Duplex } from 'stream';
import { BrowserWebSocket, NodeWebSocket } from '../web-socket-stream';
export default class EncryptedWebSocketStream extends Duplex {
    private webSocket;
    private webSocketStream?;
    private asymmetricKeyPair?;
    private symmetricKey?;
    private targetPublicKey?;
    private targetSymmetricKey?;
    private performingHandshake;
    private resendInterval;
    constructor(webSocket: BrowserWebSocket | NodeWebSocket);
    init({ startHandshake }: {
        startHandshake: boolean;
    }): Promise<void>;
    _read(): undefined;
    _write(msg: any, _: string | undefined, cb: () => void): Promise<void>;
    private onMessage;
    private handshake;
    private previousSendSecond;
    private handshakeStep;
    private decryptSymmetric;
    private decryptAsymmetric;
    private writeSymmetric;
    private writeAsymmetric;
    private writeRaw;
}
