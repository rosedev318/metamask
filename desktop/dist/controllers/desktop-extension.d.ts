import { TestConnectionResult } from '../types';
import { DesktopController as BaseDesktopController } from './desktop-base';
export declare class ExtensionDesktopController extends BaseDesktopController {
    generateOtp(): string;
    testDesktopConnection(): Promise<TestConnectionResult>;
}
