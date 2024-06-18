/// <reference types="node" />
import { Duplex } from 'stream';
export interface RemotePortData {
    name: string;
    sender: {
        url: string;
    };
}
export interface RemotePort extends RemotePortData {
    stream: Duplex;
    onMessage: {
        addListener: () => undefined;
    };
}
export declare type ConnectRemoteFactory = (remotePort: RemotePort) => undefined;
export declare enum ConnectionType {
    INTERNAL = "INTERNAL",
    EXTERNAL = "EXTERNAL"
}
