import { GetPublicKeyParams, GetPublicKeyResponse, LedgerBridge, LedgerSignMessageParams, LedgerSignMessageResponse, LedgerSignTransactionParams, LedgerSignTransactionResponse, LedgerSignTypedDataParams, LedgerSignTypedDataResponse } from './ledger-bridge';
export declare enum IFrameMessageAction {
    LedgerConnectionChange = "ledger-connection-change",
    LedgerUnlock = "ledger-unlock",
    LedgerMakeApp = "ledger-make-app",
    LedgerUpdateTransport = "ledger-update-transport",
    LedgerSignTransaction = "ledger-sign-transaction",
    LedgerSignPersonalMessage = "ledger-sign-personal-message",
    LedgerSignTypedData = "ledger-sign-typed-data"
}
declare type IFrameMessageResponse<TAction extends IFrameMessageAction> = {
    action: TAction;
    messageId: number;
} & ({
    action: IFrameMessageAction.LedgerConnectionChange;
    payload: {
        connected: boolean;
    };
} | ({
    action: IFrameMessageAction.LedgerMakeApp;
} & ({
    success: true;
} | {
    success: false;
    error?: unknown;
})) | {
    action: IFrameMessageAction.LedgerUpdateTransport;
    success: boolean;
} | ({
    action: IFrameMessageAction.LedgerUnlock;
} & ({
    success: true;
    payload: GetPublicKeyResponse;
} | {
    success: false;
    payload: {
        error: Error;
    };
})) | ({
    action: IFrameMessageAction.LedgerSignTransaction;
} & ({
    success: true;
    payload: LedgerSignTransactionResponse;
} | {
    success: false;
    payload: {
        error: Error;
    };
})) | ({
    action: IFrameMessageAction.LedgerSignPersonalMessage | IFrameMessageAction.LedgerSignTypedData;
} & ({
    success: true;
    payload: LedgerSignMessageResponse | LedgerSignTypedDataResponse;
} | {
    success: false;
    payload: {
        error: Error;
    };
})));
export declare class LedgerIframeBridge implements LedgerBridge {
    #private;
    iframe?: HTMLIFrameElement;
    iframeLoaded: boolean;
    eventListener?: (eventMessage: {
        origin: string;
        data: IFrameMessageResponse<IFrameMessageAction>;
    }) => void;
    isDeviceConnected: boolean;
    currentMessageId: number;
    messageCallbacks: Record<number, (response: IFrameMessageResponse<IFrameMessageAction>) => void>;
    delayedPromise?: {
        resolve: (value: boolean) => void;
        reject: (error: unknown) => void;
        transportType: string;
    };
    init(bridgeUrl: string): Promise<void>;
    destroy(): Promise<void>;
    attemptMakeApp(): Promise<boolean>;
    updateTransportMethod(transportType: string): Promise<boolean>;
    getPublicKey(params: GetPublicKeyParams): Promise<GetPublicKeyResponse>;
    deviceSignTransaction(params: LedgerSignTransactionParams): Promise<LedgerSignTransactionResponse>;
    deviceSignMessage(params: LedgerSignMessageParams): Promise<LedgerSignMessageResponse>;
    deviceSignTypedData(params: LedgerSignTypedDataParams): Promise<LedgerSignTypedDataResponse>;
}
export {};
