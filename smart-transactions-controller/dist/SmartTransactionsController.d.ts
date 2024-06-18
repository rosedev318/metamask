/// <reference types="node" />
import { BaseConfig, BaseController, BaseState } from '@metamask/base-controller';
import { NetworkState } from '@metamask/network-controller';
import { SmartTransaction, SignedTransaction, SignedCanceledTransaction, UnsignedTransaction, SmartTransactionStatuses, Fees, IndividualTxFees } from './types';
export declare const DEFAULT_INTERVAL: number;
export declare type SmartTransactionsControllerConfig = BaseConfig & {
    interval: number;
    clientId: string;
    chainId: string;
    supportedChainIds: string[];
};
export declare type SmartTransactionsControllerState = BaseState & {
    smartTransactionsState: {
        smartTransactions: Record<string, SmartTransaction[]>;
        userOptIn: boolean | undefined;
        userOptInV2: boolean | undefined;
        liveness: boolean | undefined;
        fees: {
            approvalTxFees: IndividualTxFees | undefined;
            tradeTxFees: IndividualTxFees | undefined;
        };
    };
};
export default class SmartTransactionsController extends BaseController<SmartTransactionsControllerConfig, SmartTransactionsControllerState> {
    timeoutHandle?: NodeJS.Timeout;
    private getNonceLock;
    ethersProvider: any;
    confirmExternalTransaction: any;
    private trackMetaMetricsEvent;
    private fetch;
    constructor({ onNetworkStateChange, getNonceLock, provider, confirmExternalTransaction, trackMetaMetricsEvent, }: {
        onNetworkStateChange: (listener: (networkState: NetworkState) => void) => void;
        getNonceLock: any;
        provider: any;
        confirmExternalTransaction: any;
        trackMetaMetricsEvent: any;
    }, config?: Partial<SmartTransactionsControllerConfig>, state?: Partial<SmartTransactionsControllerState>);
    checkPoll(state: any): void;
    initializeSmartTransactionsForChainId(): void;
    poll(interval?: number): Promise<void>;
    stop(): Promise<void>;
    setOptInState(state: boolean | undefined): void;
    trackStxStatusChange(smartTransaction: SmartTransaction, prevSmartTransaction?: SmartTransaction): void;
    isNewSmartTransaction(smartTransactionUuid: string): boolean;
    updateSmartTransaction(smartTransaction: SmartTransaction): void;
    updateSmartTransactions(): Promise<void>;
    confirmSmartTransaction(smartTransaction: SmartTransaction): Promise<void>;
    fetchSmartTransactionsStatus(uuids: string[]): Promise<SmartTransaction[]>;
    addNonceToTransaction(transaction: UnsignedTransaction): Promise<UnsignedTransaction>;
    clearFees(): Fees;
    getFees(tradeTx: UnsignedTransaction, approvalTx: UnsignedTransaction): Promise<Fees>;
    submitSignedTransactions({ txParams, signedTransactions, signedCanceledTransactions, }: {
        signedTransactions: SignedTransaction[];
        signedCanceledTransactions: SignedCanceledTransaction[];
        txParams?: any;
    }): Promise<any>;
    cancelSmartTransaction(uuid: string): Promise<void>;
    fetchLiveness(): Promise<boolean>;
    setStatusRefreshInterval(interval: number): Promise<void>;
    getTransactions({ addressFrom, status, }: {
        addressFrom: string;
        status: SmartTransactionStatuses;
    }): SmartTransaction[];
}
