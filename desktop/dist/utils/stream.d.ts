/// <reference types="node" />
import { Duplex, Readable, Writable } from 'stream';
export declare const waitForMessage: <T>(stream: Readable, filter?: ((data: T) => Promise<any>) | undefined, { returnFilterOutput }?: {
    returnFilterOutput?: boolean | undefined;
}) => Promise<T>;
export declare const waitForAcknowledge: (stream: Readable) => Promise<void>;
export declare const acknowledge: (stream: Writable) => void;
export declare const addDataListener: (stream: Readable, listener: (data: any) => void) => void;
export declare class DuplexCopy extends Duplex {
    private stream;
    constructor(stream: Duplex);
    private onMessage;
    _read(): null;
    _write(msg: any, encoding: BufferEncoding | undefined, cb: () => void): void;
}
