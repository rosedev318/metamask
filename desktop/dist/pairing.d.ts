/// <reference types="node" />
import { Duplex } from 'stream';
import { PairingKeyStatus } from './types';
export declare class Pairing {
    private requestStream;
    private keyStream;
    private transferState;
    constructor(stream: Duplex, transferState: () => Promise<void>);
    static generateOTP(): string;
    init(): this;
    checkPairingKeyMatch(): Promise<PairingKeyStatus>;
    private onRequestMessage;
    private createStreams;
}
