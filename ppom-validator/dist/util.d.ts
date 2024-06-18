import type { JsonRpcParams } from '@metamask/utils';
import type { NativeCrypto } from './ppom-controller';
export declare const SUPPORTED_NETWORK_CHAINIDS: {
    MAINNET: string;
    BSC: string;
    OPTIMISM: string;
    POLYGON: string;
    AVALANCHE: string;
    ARBITRUM: string;
    LINEA_MAINNET: string;
    BASE: string;
    SEPOLIA: string;
};
export declare const blockaidValidationSupportedForNetwork: (chainId: string) => boolean;
export declare const IdGenerator: () => number;
export declare const createPayload: (method: string, params: JsonRpcParams) => {
    readonly id: number;
    readonly jsonrpc: "2.0";
    readonly method: string;
    readonly params: JsonRpcParams;
};
export declare const PROVIDER_ERRORS: {
    limitExceeded: () => {
        readonly jsonrpc: "2.0";
        readonly id: number;
        readonly error: {
            readonly code: -32005;
            readonly message: "Limit exceeded";
        };
    };
    methodNotSupported: () => {
        readonly jsonrpc: "2.0";
        readonly id: number;
        readonly error: {
            readonly code: -32601;
            readonly message: "Method not supported";
        };
    };
};
export declare const validateSignature: (data: ArrayBuffer, hashSignature: string, key: string, filePath: string, nativeCrypto?: NativeCrypto, useNative?: boolean) => Promise<void>;
export declare const constructURLHref: (base: string, path: string) => string;
export declare const addHexPrefix: (str: string) => string;
export declare const checkFilePath: (filePath: string) => void;
