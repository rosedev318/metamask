export declare const envStringMatch: (value: string | undefined, expected: string) => boolean;
export declare function envInt(value: string | undefined): number | undefined;
export declare function envInt(value: string | undefined, defaultValue: number): number;
export declare const envBool: (value: string | boolean | undefined, defaultValue?: boolean) => boolean;
declare const loadConfig: () => {
    isDebug: boolean;
    isExtensionTest: boolean;
    skipOtpPairingFlow: boolean;
    compatibilityVersion: {
        extension: number;
    };
    webSocket: {
        disableEncryption: boolean;
        port: number;
        url: string;
    };
};
export declare type ConfigType = ReturnType<typeof loadConfig>;
export declare const cfg: () => ConfigType;
export {};
