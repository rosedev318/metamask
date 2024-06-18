import { DesktopState, RawState } from '../types';
export declare const getRawState: () => Promise<RawState>;
export declare const getDesktopState: () => Promise<DesktopState>;
export declare const getAndUpdateDesktopState: (desktopState: DesktopState) => Promise<RawState>;
export declare const setRawState: (state: RawState) => Promise<void>;
export declare const setDesktopState: (desktopState: DesktopState) => Promise<void>;
export declare const clearRawState: () => Promise<void>;
export declare const addPairingKeyToRawState: (state: RawState) => Promise<RawState>;
export declare const removePairingKeyFromRawState: (state: RawState) => {
    data: {
        DesktopController: {
            pairingKey: undefined;
            pairingKeyHash: undefined;
            desktopEnabled?: boolean | undefined;
        };
    };
};
