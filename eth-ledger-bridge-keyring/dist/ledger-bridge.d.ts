import type LedgerHwAppEth from '@ledgerhq/hw-app-eth';
export declare type GetPublicKeyParams = {
    hdPath: string;
};
export declare type GetPublicKeyResponse = Awaited<ReturnType<LedgerHwAppEth['getAddress']>> & {
    chainCode: string;
};
export declare type LedgerSignTransactionParams = {
    hdPath: string;
    tx: string;
};
export declare type LedgerSignTransactionResponse = Awaited<ReturnType<LedgerHwAppEth['signTransaction']>>;
export declare type LedgerSignMessageParams = {
    hdPath: string;
    message: string;
};
export declare type LedgerSignMessageResponse = Awaited<ReturnType<LedgerHwAppEth['signPersonalMessage']>>;
export declare type LedgerSignTypedDataParams = {
    hdPath: string;
    domainSeparatorHex: string;
    hashStructMessageHex: string;
};
export declare type LedgerSignTypedDataResponse = Awaited<ReturnType<LedgerHwAppEth['signEIP712HashedMessage']>>;
export interface LedgerBridge {
    isDeviceConnected: boolean;
    init(bridgeUrl: string): Promise<void>;
    destroy(): Promise<void>;
    attemptMakeApp(): Promise<boolean>;
    updateTransportMethod(transportType: string): Promise<boolean>;
    getPublicKey(params: GetPublicKeyParams): Promise<GetPublicKeyResponse>;
    deviceSignTransaction(params: LedgerSignTransactionParams): Promise<LedgerSignTransactionResponse>;
    deviceSignMessage(params: LedgerSignMessageParams): Promise<LedgerSignMessageResponse>;
    deviceSignTypedData(params: LedgerSignTypedDataParams): Promise<LedgerSignTypedDataResponse>;
}
