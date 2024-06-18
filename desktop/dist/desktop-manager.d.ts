import { TestConnectionResult, ConnectionType } from './types';
import DesktopConnection from './desktop-connection';
declare class DesktopManager {
    private desktopConnection?;
    private desktopState;
    private extensionVersion?;
    private transferredState;
    constructor();
    init(extensionVersion: string): Promise<void>;
    setState(state: any): void;
    getConnection(): Promise<DesktopConnection | undefined>;
    isDesktopEnabled(): boolean;
    createStream(remotePort: any, connectionType: ConnectionType): Promise<void>;
    testConnection(): Promise<TestConnectionResult>;
    private createConnection;
    private onDisconnect;
    private onUIMessage;
    private transferState;
    private disable;
    private createWebSocket;
}
declare const _default: DesktopManager;
export default _default;
