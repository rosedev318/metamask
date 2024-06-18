/// <reference types="node" />
import { TypedTransaction } from '@ethereumjs/tx';
import type { MessageTypes, TypedMessage } from '@metamask/eth-sig-util';
import type OldEthJsTransaction from 'ethereumjs-tx';
import { EventEmitter } from 'events';
import HDKey from 'hdkey';
import { LedgerBridge } from './ledger-bridge';
declare enum NetworkApiUrls {
    Ropsten = "http://api-ropsten.etherscan.io",
    Kovan = "http://api-kovan.etherscan.io",
    Rinkeby = "https://api-rinkeby.etherscan.io",
    Mainnet = "https://api.etherscan.io"
}
export declare type AccountDetails = {
    index?: number;
    bip44?: boolean;
    hdPath?: string;
};
export declare type LedgerBridgeKeyringOptions = {
    hdPath: string;
    accounts: readonly string[];
    accountDetails: Readonly<Record<string, AccountDetails>>;
    accountIndexes: Readonly<Record<string, number>>;
    bridgeUrl: string;
    implementFullBIP44: boolean;
};
export declare class LedgerKeyring extends EventEmitter {
    #private;
    static type: string;
    readonly type: string;
    page: number;
    perPage: number;
    unlockedAccount: number;
    accounts: readonly string[];
    accountDetails: Record<string, AccountDetails>;
    hdk: HDKey;
    hdPath: string;
    paths: Record<string, number>;
    network: NetworkApiUrls;
    implementFullBIP44: boolean;
    bridgeUrl: string;
    bridge: LedgerBridge;
    constructor({ bridge }: {
        bridge: LedgerBridge;
    });
    init(): Promise<void>;
    destroy(): Promise<void>;
    serialize(): Promise<{
        hdPath: string;
        accounts: readonly string[];
        accountDetails: Record<string, AccountDetails>;
        bridgeUrl: string;
        implementFullBIP44: boolean;
    }>;
    deserialize(opts?: Partial<LedgerBridgeKeyringOptions>): Promise<void>;
    isUnlocked(): boolean;
    isConnected(): boolean;
    setAccountToUnlock(index: number | string): void;
    setHdPath(hdPath: string): void;
    unlock(hdPath?: string, updateHdk?: boolean): Promise<string>;
    addAccounts(amount?: number): Promise<string[]>;
    getFirstPage(): Promise<{
        address: string;
        balance: number | null;
        index: number;
    }[]>;
    getNextPage(): Promise<{
        address: string;
        balance: number | null;
        index: number;
    }[]>;
    getPreviousPage(): Promise<{
        address: string;
        balance: number | null;
        index: number;
    }[]>;
    getAccounts(): Promise<string[]>;
    removeAccount(address: string): void;
    attemptMakeApp(): Promise<boolean>;
    updateTransportMethod(transportType: string): Promise<boolean>;
    signTransaction(address: string, tx: TypedTransaction | OldEthJsTransaction): Promise<TypedTransaction | OldEthJsTransaction>;
    signMessage(withAccount: string, data: string): Promise<string>;
    signPersonalMessage(withAccount: string, message: string): Promise<string>;
    unlockAccountByAddress(address: string): Promise<string | undefined>;
    signTypedData<T extends MessageTypes>(withAccount: string, data: TypedMessage<T>, options?: {
        version?: string;
    }): Promise<string>;
    exportAccount(): void;
    forgetDevice(): void;
}
export {};
