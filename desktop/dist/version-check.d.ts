/// <reference types="node" />
import { Duplex } from 'stream';
import { VersionCheckResult } from './types';
export declare class VersionCheck {
    private stream;
    private extensionVersion;
    constructor(stream: Duplex, extensionVersion: string);
    check(): Promise<VersionCheckResult>;
    private isDesktopVersionSupported;
}
