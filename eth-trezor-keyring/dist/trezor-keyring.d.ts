/// <reference types="node" />
import { EventEmitter } from 'events';
import HDKey from 'hdkey';
import type { TypedTransaction } from '@ethereumjs/tx';
import type OldEthJsTransaction from 'ethereumjs-tx';
import { TypedMessage, SignTypedDataVersion, MessageTypes } from '@metamask/eth-sig-util';
import { TrezorBridge } from './trezor-bridge';
declare const ALLOWED_HD_PATHS: {
    readonly "m/44'/60'/0'/0": true;
    readonly "m/44'/60'/0'": true;
    readonly "m/44'/1'/0'/0": true;
};
export declare const TREZOR_CONNECT_MANIFEST: {
    email: string;
    appUrl: string;
};
export interface TrezorControllerOptions {
    hdPath?: string;
    accounts?: string[];
    page?: number;
    perPage?: number;
}
export interface TrezorControllerState {
    hdPath: string;
    accounts: readonly string[];
    page: number;
    paths: Record<string, number>;
    perPage: number;
    unlockedAccount: number;
}
export declare class TrezorKeyring extends EventEmitter {
    #private;
    static type: string;
    readonly type: string;
    accounts: readonly string[];
    hdk: HDKey;
    hdPath: string;
    page: number;
    perPage: number;
    unlockedAccount: number;
    paths: Record<string, number>;
    bridge: TrezorBridge;
    constructor({ bridge }: {
        bridge: TrezorBridge;
    });
    /**
     * Gets the model, if known.
     * This may be `undefined` if the model hasn't been loaded yet.
     *
     * @returns
     */
    getModel(): string | undefined;
    init(): Promise<void>;
    destroy(): Promise<void>;
    serialize(): Promise<TrezorControllerState>;
    deserialize(opts?: TrezorControllerOptions): Promise<void>;
    isUnlocked(): boolean;
    unlock(): Promise<unknown>;
    setAccountToUnlock(index: number | string): void;
    addAccounts(n?: number): Promise<readonly string[]>;
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
    /**
     * Signs a transaction using Trezor.
     *
     * Accepts either an ethereumjs-tx or @ethereumjs/tx transaction, and returns
     * the same type.
     *
     * @param address - Hex string address.
     * @param tx - Instance of either new-style or old-style ethereumjs transaction.
     * @returns The signed transaction, an instance of either new-style or old-style
     * ethereumjs transaction.
     */
    signTransaction(address: string, tx: TypedTransaction | OldEthJsTransaction): Promise<OldEthJsTransaction | TypedTransaction>;
    signMessage(withAccount: string, data: string): Promise<unknown>;
    signPersonalMessage(withAccount: string, message: string): Promise<unknown>;
    /**
     * EIP-712 Sign Typed Data
     */
    signTypedData<T extends MessageTypes>(address: string, data: TypedMessage<T>, { version }: {
        version: SignTypedDataVersion;
    }): Promise<string>;
    exportAccount(): Promise<never>;
    forgetDevice(): void;
    /**
     * Set the HD path to be used by the keyring. Only known supported HD paths are allowed.
     *
     * If the given HD path is already the current HD path, nothing happens. Otherwise the new HD
     * path is set, and the wallet state is completely reset.
     *
     * @throws {Error] Throws if the HD path is not supported.
     *
     * @param hdPath - The HD path to set.
     */
    setHdPath(hdPath: keyof typeof ALLOWED_HD_PATHS): void;
}
export {};
