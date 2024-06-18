/// <reference types="node" />
import type { TypedTransaction } from '@ethereumjs/tx';
import type { TypedDataV1, TypedMessage } from '@metamask/eth-sig-util';
import { SignTypedDataVersion } from '@metamask/eth-sig-util';
import type { EthBaseTransaction, EthBaseUserOperation, EthUserOperation, EthUserOperationPatch, InternalAccount, KeyringAccount } from '@metamask/keyring-api';
import type { SnapController } from '@metamask/snaps-controllers';
import type { SnapId } from '@metamask/snaps-sdk';
import type { Json } from '@metamask/utils';
import { EventEmitter } from 'events';
import type { SnapMessage } from './types';
export declare const SNAP_KEYRING_TYPE = "Snap Keyring";
/**
 * Snap keyring state.
 *
 * This state is persisted by the keyring controller and passed to the snap
 * keyring when it's created.
 */
export declare type KeyringState = {
    accounts: Record<string, {
        account: KeyringAccount;
        snapId: SnapId;
    }>;
};
/**
 * Snap keyring callbacks.
 *
 * These callbacks are used to interact with other components.
 */
export declare type SnapKeyringCallbacks = {
    saveState: () => Promise<void>;
    addressExists(address: string): Promise<boolean>;
    addAccount(address: string, snapId: SnapId, handleUserInput: (accepted: boolean) => Promise<void>): Promise<void>;
    removeAccount(address: string, snapId: SnapId, handleUserInput: (accepted: boolean) => Promise<void>): Promise<void>;
    redirectUser(snapId: SnapId, url: string, message: string): Promise<void>;
};
/**
 * Keyring bridge implementation to support snaps.
 */
export declare class SnapKeyring extends EventEmitter {
    #private;
    static type: string;
    type: string;
    /**
     * Create a new snap keyring.
     *
     * @param controller - Snaps controller.
     * @param callbacks - Callbacks used to interact with other components.
     * @returns A new snap keyring.
     */
    constructor(controller: SnapController, callbacks: SnapKeyringCallbacks);
    /**
     * Handle a message from a snap.
     *
     * @param snapId - ID of the snap.
     * @param message - Message sent by the snap.
     * @returns The execution result.
     */
    handleKeyringSnapMessage(snapId: SnapId, message: SnapMessage): Promise<Json>;
    /**
     * Serialize the keyring state.
     *
     * @returns Serialized keyring state.
     */
    serialize(): Promise<KeyringState>;
    /**
     * Deserialize the keyring state into this keyring.
     *
     * @param state - Serialized keyring state.
     */
    deserialize(state: KeyringState | undefined): Promise<void>;
    /**
     * Get the addresses of the accounts in this keyring.
     *
     * @returns The addresses of the accounts in this keyring.
     */
    getAccounts(): Promise<string[]>;
    /**
     * Get the addresses of the accounts associated with a given Snap.
     *
     * @param snapId - Snap ID to filter by.
     * @returns The addresses of the accounts associated with the given Snap.
     */
    getAccountsBySnapId(snapId: SnapId): Promise<string[]>;
    /**
     * Sign a transaction.
     *
     * @param address - Sender's address.
     * @param transaction - Transaction.
     * @param _opts - Transaction options (not used).
     */
    signTransaction(address: string, transaction: TypedTransaction, _opts?: {}): Promise<Json | TypedTransaction>;
    /**
     * Sign a typed data message.
     *
     * @param address - Signer's address.
     * @param data - Data to sign.
     * @param opts - Signing options.
     * @returns The signature.
     */
    signTypedData(address: string, data: Record<string, unknown>[] | TypedDataV1 | TypedMessage<any>, opts?: {
        version: SignTypedDataVersion;
    }): Promise<string>;
    /**
     * Sign a message.
     *
     * @param address - Signer's address.
     * @param hash - Data to sign.
     * @returns The signature.
     */
    signMessage(address: string, hash: any): Promise<string>;
    /**
     * Sign a personal message.
     *
     * Note: KeyringController says this should return a Buffer but it actually
     * expects a string.
     *
     * @param address - Signer's address.
     * @param data - Data to sign.
     * @returns Promise of the signature.
     */
    signPersonalMessage(address: string, data: any): Promise<string>;
    /**
     * Convert a base transaction to a base UserOperation.
     *
     * @param address - Address of the sender.
     * @param transactions - Base transactions to include in the UserOperation.
     * @returns A pseudo-UserOperation that can be used to construct a real.
     */
    prepareUserOperation(address: string, transactions: EthBaseTransaction[]): Promise<EthBaseUserOperation>;
    /**
     * Patches properties of a UserOperation. Currently, only the
     * `paymasterAndData` can be patched.
     *
     * @param address - Address of the sender.
     * @param userOp - UserOperation to patch.
     * @returns A patch to apply to the UserOperation.
     */
    patchUserOperation(address: string, userOp: EthUserOperation): Promise<EthUserOperationPatch>;
    /**
     * Signs an UserOperation.
     *
     * @param address - Address of the sender.
     * @param userOp - UserOperation to sign.
     * @returns The signature of the UserOperation.
     */
    signUserOperation(address: string, userOp: EthUserOperation): Promise<string>;
    /**
     * Gets the private data associated with the given address so
     * that it may be exported.
     *
     * If this keyring contains duplicate public keys the first
     * matching address is exported.
     *
     * Used by the UI to export an account.
     *
     * @param _address - Address of the account to export.
     */
    exportAccount(_address: string): [Uint8Array, Json] | undefined;
    /**
     * Removes the account matching the given address.
     *
     * @param address - Address of the account to remove.
     */
    removeAccount(address: string): Promise<void>;
    /**
     * Return an internal account object for a given address.
     *
     * @param address - Address of the account to return.
     * @returns An internal account object for the given address.
     */
    getAccountByAddress(address: string): InternalAccount | undefined;
    /**
     * List all snap keyring accounts.
     *
     * @returns An array containing all snap keyring accounts.
     */
    listAccounts(): InternalAccount[];
}
