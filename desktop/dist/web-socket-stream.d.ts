/// <reference types="node" />
import { Duplex } from 'stream';
import { WebSocket as WSWebSocket } from 'ws';
export declare type BrowserWebSocket = WebSocket;
export declare type NodeWebSocket = WSWebSocket;
export declare class WebSocketStream extends Duplex {
    private webSocket;
    private isBrowser;
    constructor(webSocket: BrowserWebSocket | NodeWebSocket);
    init(): void;
    _read(): undefined;
    _write(msg: any, _: string, cb: () => void): Promise<void>;
    private onMessage;
    private waitForSocketConnected;
}
