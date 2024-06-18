import type { Json } from '@metamask/utils';
import type { Infer } from 'superstruct';
/**
 * Supported Ethereum methods.
 */
export declare enum EthMethod {
    PersonalSign = "personal_sign",
    Sign = "eth_sign",
    SignTransaction = "eth_signTransaction",
    SignTypedDataV1 = "eth_signTypedData_v1",
    SignTypedDataV3 = "eth_signTypedData_v3",
    SignTypedDataV4 = "eth_signTypedData_v4",
    PrepareUserOperation = "eth_prepareUserOperation",
    PatchUserOperation = "eth_patchUserOperation",
    SignUserOperation = "eth_signUserOperation"
}
/**
 * Supported Ethereum account types.
 */
export declare enum EthAccountType {
    Eoa = "eip155:eoa",
    Erc4337 = "eip155:erc4337"
}
export declare const KeyringAccountStruct: import("superstruct").Struct<{
    type: "eip155:eoa" | "eip155:erc4337";
    id: string;
    address: string;
    options: Record<string, Json>;
    methods: ("personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation")[];
}, {
    /**
     * Account ID (UUIDv4).
     */
    id: import("superstruct").Struct<string, null>;
    /**
     * Account address or next receive address (UTXO).
     */
    address: import("superstruct").Struct<string, null>;
    /**
     * Keyring-dependent account options.
     */
    options: import("superstruct").Struct<Record<string, Json>, null>;
    /**
     * Account supported methods.
     */
    methods: import("superstruct").Struct<("personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation")[], import("superstruct").Struct<"personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation", {
        personal_sign: "personal_sign";
        eth_sign: "eth_sign";
        eth_signTransaction: "eth_signTransaction";
        eth_signTypedData_v1: "eth_signTypedData_v1";
        eth_signTypedData_v3: "eth_signTypedData_v3";
        eth_signTypedData_v4: "eth_signTypedData_v4";
        eth_prepareUserOperation: "eth_prepareUserOperation";
        eth_patchUserOperation: "eth_patchUserOperation";
        eth_signUserOperation: "eth_signUserOperation";
    }>>;
    /**
     * Account type.
     */
    type: import("superstruct").Struct<"eip155:eoa" | "eip155:erc4337", {
        "eip155:eoa": "eip155:eoa";
        "eip155:erc4337": "eip155:erc4337";
    }>;
}>;
/**
 * Account object.
 *
 * Represents an account with its properties and capabilities.
 */
export declare type KeyringAccount = Infer<typeof KeyringAccountStruct>;
export declare const KeyringRequestStruct: import("superstruct").Struct<{
    id: string;
    scope: string;
    account: string;
    request: {
        method: string;
        params?: Json[] | Record<string, Json>;
    };
}, {
    /**
     * Keyring request ID (UUIDv4).
     */
    id: import("superstruct").Struct<string, null>;
    /**
     * Request's scope (CAIP-2 chain ID).
     */
    scope: import("superstruct").Struct<string, null>;
    /**
     * Account ID (UUIDv4).
     */
    account: import("superstruct").Struct<string, null>;
    /**
     * Inner request sent by the client application.
     */
    request: import("superstruct").Struct<{
        method: string;
        params?: Json[] | Record<string, Json>;
    }, {
        method: import("superstruct").Struct<string, null>;
        params: import("superstruct").Struct<import("./superstruct").ExactOptionalTag | Json[] | Record<string, Json>, null>;
    }>;
}>;
/**
 * Keyring request.
 *
 * Represents a request made to the keyring for account-related operations.
 */
export declare type KeyringRequest = Infer<typeof KeyringRequestStruct>;
export declare const KeyringAccountDataStruct: import("superstruct").Struct<Record<string, Json>, null>;
/**
 * Response to a call to `exportAccount`.
 *
 * The exact response depends on the keyring implementation.
 */
export declare type KeyringAccountData = Infer<typeof KeyringAccountDataStruct>;
export declare const KeyringResponseStruct: import("superstruct").Struct<{
    pending: true;
    redirect?: {
        message?: string;
        url?: string;
    };
} | {
    pending: false;
    result: Json;
}, null>;
/**
 * Response to a call to `submitRequest`.
 *
 * Keyring implementations must return a response with `pending: true` if the
 * request will be handled asynchronously. Otherwise, the response must contain
 * the result of the request and `pending: false`.
 *
 * In the asynchronous case, the keyring can return a redirect URL and message
 * to be shown to the user. The user can choose to follow the link or cancel
 * the request. The main use case for this is to redirect the user to the snap
 * dapp to review the request.
 */
export declare type KeyringResponse = Infer<typeof KeyringResponseStruct>;
/**
 * Keyring interface.
 *
 * Represents the functionality and operations related to managing accounts and
 * handling requests.
 */
export declare type Keyring = {
    /**
     * List accounts.
     *
     * Retrieves an array of KeyringAccount objects representing the available
     * accounts.
     *
     * @returns A promise that resolves to an array of KeyringAccount objects.
     */
    listAccounts(): Promise<KeyringAccount[]>;
    /**
     * Get an account.
     *
     * Retrieves the KeyringAccount object for the given account ID.
     *
     * @param id - The ID of the account to retrieve.
     * @returns A promise that resolves to the KeyringAccount object if found, or
     * undefined otherwise.
     */
    getAccount(id: string): Promise<KeyringAccount | undefined>;
    /**
     * Create an account.
     *
     * Creates a new account with optional, keyring-defined, account options.
     *
     * @param options - Keyring-defined options for the account (optional).
     * @returns A promise that resolves to the newly created KeyringAccount
     * object without any private information.
     */
    createAccount(options?: Record<string, Json>): Promise<KeyringAccount>;
    /**
     * Filter supported chains for a given account.
     *
     * @param id - ID of the account to be checked.
     * @param chains - List of chains (CAIP-2) to be checked.
     * @returns A Promise that resolves to a filtered list of CAIP-2 IDs
     * representing the supported chains.
     */
    filterAccountChains(id: string, chains: string[]): Promise<string[]>;
    /**
     * Update an account.
     *
     * Updates the account with the given account object. Does nothing if the
     * account does not exist.
     *
     * @param account - The updated account object.
     * @returns A promise that resolves when the account is successfully updated.
     */
    updateAccount(account: KeyringAccount): Promise<void>;
    /**
     * Delete an account from the keyring.
     *
     * Deletes the account with the given ID from the keyring.
     *
     * @param id - The ID of the account to delete.
     * @returns A promise that resolves when the account is successfully deleted.
     */
    deleteAccount(id: string): Promise<void>;
    /**
     * Exports an account's private key.
     *
     * If the keyring cannot export a private key, this function should throw an
     * error.
     *
     * @param id - The ID of the account to export.
     * @returns A promise that resolves to the exported account.
     */
    exportAccount?(id: string): Promise<KeyringAccountData>;
    /**
     * List all submitted requests.
     *
     * Retrieves an array of KeyringRequest objects representing the submitted
     * requests.
     *
     * @returns A promise that resolves to an array of KeyringRequest objects.
     */
    listRequests?(): Promise<KeyringRequest[]>;
    /**
     * Get a request.
     *
     * Retrieves the KeyringRequest object for the given request ID.
     *
     * @param id - The ID of the request to retrieve.
     * @returns A promise that resolves to the KeyringRequest object if found, or
     * undefined otherwise.
     */
    getRequest?(id: string): Promise<KeyringRequest | undefined>;
    /**
     * Submit a request.
     *
     * Submits the given KeyringRequest object.
     *
     * @param request - The KeyringRequest object to submit.
     * @returns A promise that resolves to the request response.
     */
    submitRequest(request: KeyringRequest): Promise<KeyringResponse>;
    /**
     * Approve a request.
     *
     * Approves the request with the given ID and sets the response if provided.
     *
     * @param id - The ID of the request to approve.
     * @param data - The response to the request (optional).
     * @returns A promise that resolves when the request is successfully
     * approved.
     */
    approveRequest?(id: string, data?: Record<string, Json>): Promise<void>;
    /**
     * Reject a request.
     *
     * Rejects the request with the given ID.
     *
     * @param id - The ID of the request to reject.
     * @returns A promise that resolves when the request is successfully
     * rejected.
     */
    rejectRequest?(id: string): Promise<void>;
};
