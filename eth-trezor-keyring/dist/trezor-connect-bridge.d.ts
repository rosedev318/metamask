import type { Manifest, ConnectSettings, EthereumSignTransaction, Params, EthereumSignMessage, EthereumSignTypedDataTypes, EthereumSignTypedHash } from '@trezor/connect-web';
import type { TrezorBridge } from './trezor-bridge';
export declare class TrezorConnectBridge implements TrezorBridge {
    model?: string;
    trezorConnectInitiated: boolean;
    init(settings: {
        manifest: Manifest;
    } & Partial<ConnectSettings>): Promise<void>;
    dispose(): Promise<void>;
    getPublicKey(params: {
        path: string;
        coin: string;
    }): import("@trezor/connect-web").Response<{
        xpubSegwit?: string | undefined;
        path: number[];
        serializedPath: string;
        childNum: number;
        xpub: string;
        chainCode: string;
        publicKey: string;
        fingerprint: number;
        depth: number;
    }>;
    ethereumSignTransaction(params: Params<EthereumSignTransaction>): import("@trezor/connect-web").Response<{
        v: string;
        r: string;
        s: string;
        serializedTx: string;
    }>;
    ethereumSignMessage(params: Params<EthereumSignMessage>): import("@trezor/connect-web").Response<{
        address: string;
        signature: string;
    }>;
    ethereumSignTypedData<T extends EthereumSignTypedDataTypes>(params: Params<EthereumSignTypedHash<T>>): import("@trezor/connect-web").Response<{
        address: string;
        signature: string;
    }>;
}
