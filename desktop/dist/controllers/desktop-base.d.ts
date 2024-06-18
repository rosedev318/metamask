import { TestConnectionResult } from '../types';
export declare abstract class DesktopController {
    private store;
    constructor({ initState }: {
        initState: any;
    });
    getDesktopEnabled(): boolean;
    setDesktopEnabled(desktopEnabled: boolean): void;
    setPairingKey(pairingKey: string): void;
    generateOtp(): string;
    testDesktopConnection(): Promise<TestConnectionResult>;
    disableDesktop(): Promise<void>;
}
