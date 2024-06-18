"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SnapKeyring_instances, _SnapKeyring_snapClient, _SnapKeyring_accounts, _SnapKeyring_requests, _SnapKeyring_callbacks, _SnapKeyring_handleAccountCreated, _SnapKeyring_handleAccountUpdated, _SnapKeyring_handleAccountDeleted, _SnapKeyring_handleRequestApproved, _SnapKeyring_handleRequestRejected, _SnapKeyring_submitRequest, _SnapKeyring_resolveAddress, _SnapKeyring_getSnapMetadata;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapKeyring = exports.SNAP_KEYRING_TYPE = void 0;
const tx_1 = require("@ethereumjs/tx");
const eth_sig_util_1 = require("@metamask/eth-sig-util");
const keyring_api_1 = require("@metamask/keyring-api");
const utils_1 = require("@metamask/utils");
const events_1 = require("events");
const superstruct_1 = require("superstruct");
const uuid_1 = require("uuid");
const DeferredPromise_1 = require("./DeferredPromise");
const KeyringSnapControllerClient_1 = require("./KeyringSnapControllerClient");
const SnapIdMap_1 = require("./SnapIdMap");
const types_1 = require("./types");
const util_1 = require("./util");
exports.SNAP_KEYRING_TYPE = 'Snap Keyring';
/**
 * Keyring bridge implementation to support snaps.
 */
class SnapKeyring extends events_1.EventEmitter {
    /**
     * Create a new snap keyring.
     *
     * @param controller - Snaps controller.
     * @param callbacks - Callbacks used to interact with other components.
     * @returns A new snap keyring.
     */
    constructor(controller, callbacks) {
        super();
        _SnapKeyring_instances.add(this);
        /**
         * Client used to call the snap keyring.
         */
        _SnapKeyring_snapClient.set(this, void 0);
        /**
         * Mapping between account IDs and an object that contains the associated
         * account object and snap ID.
         */
        _SnapKeyring_accounts.set(this, void 0);
        /**
         * Mapping between request IDs and their deferred promises.
         */
        _SnapKeyring_requests.set(this, void 0);
        /**
         * Callbacks used to interact with other components.
         */
        _SnapKeyring_callbacks.set(this, void 0);
        this.type = SnapKeyring.type;
        __classPrivateFieldSet(this, _SnapKeyring_snapClient, new KeyringSnapControllerClient_1.KeyringSnapControllerClient({ controller }), "f");
        __classPrivateFieldSet(this, _SnapKeyring_requests, new SnapIdMap_1.SnapIdMap(), "f");
        __classPrivateFieldSet(this, _SnapKeyring_accounts, new SnapIdMap_1.SnapIdMap(), "f");
        __classPrivateFieldSet(this, _SnapKeyring_callbacks, callbacks, "f");
    }
    /**
     * Handle a message from a snap.
     *
     * @param snapId - ID of the snap.
     * @param message - Message sent by the snap.
     * @returns The execution result.
     */
    async handleKeyringSnapMessage(snapId, message) {
        (0, superstruct_1.assert)(message, types_1.SnapMessageStruct);
        switch (message.method) {
            case keyring_api_1.KeyringEvent.AccountCreated: {
                return __classPrivateFieldGet(this, _SnapKeyring_instances, "m", _SnapKeyring_handleAccountCreated).call(this, snapId, message);
            }
            case keyring_api_1.KeyringEvent.AccountUpdated: {
                return __classPrivateFieldGet(this, _SnapKeyring_instances, "m", _SnapKeyring_handleAccountUpdated).call(this, snapId, message);
            }
            case keyring_api_1.KeyringEvent.AccountDeleted: {
                return __classPrivateFieldGet(this, _SnapKeyring_instances, "m", _SnapKeyring_handleAccountDeleted).call(this, snapId, message);
            }
            case keyring_api_1.KeyringEvent.RequestApproved: {
                return __classPrivateFieldGet(this, _SnapKeyring_instances, "m", _SnapKeyring_handleRequestApproved).call(this, snapId, message);
            }
            case keyring_api_1.KeyringEvent.RequestRejected: {
                return __classPrivateFieldGet(this, _SnapKeyring_instances, "m", _SnapKeyring_handleRequestRejected).call(this, snapId, message);
            }
            default:
                throw new Error(`Method not supported: ${message.method}`);
        }
    }
    /**
     * Serialize the keyring state.
     *
     * @returns Serialized keyring state.
     */
    async serialize() {
        return {
            accounts: __classPrivateFieldGet(this, _SnapKeyring_accounts, "f").toObject(),
        };
    }
    /**
     * Deserialize the keyring state into this keyring.
     *
     * @param state - Serialized keyring state.
     */
    async deserialize(state) {
        // If the state is undefined, it means that this is a new keyring, so we
        // don't need to do anything.
        if (state === undefined) {
            return;
        }
        __classPrivateFieldSet(this, _SnapKeyring_accounts, SnapIdMap_1.SnapIdMap.fromObject(state.accounts), "f");
    }
    /**
     * Get the addresses of the accounts in this keyring.
     *
     * @returns The addresses of the accounts in this keyring.
     */
    async getAccounts() {
        return (0, util_1.unique)([...__classPrivateFieldGet(this, _SnapKeyring_accounts, "f").values()].map(({ account }) => account.address.toLowerCase()));
    }
    /**
     * Get the addresses of the accounts associated with a given Snap.
     *
     * @param snapId - Snap ID to filter by.
     * @returns The addresses of the accounts associated with the given Snap.
     */
    async getAccountsBySnapId(snapId) {
        return (0, util_1.unique)([...__classPrivateFieldGet(this, _SnapKeyring_accounts, "f").values()]
            .filter(({ snapId: accountSnapId }) => accountSnapId === snapId)
            .map(({ account }) => account.address.toLowerCase()));
    }
    /**
     * Sign a transaction.
     *
     * @param address - Sender's address.
     * @param transaction - Transaction.
     * @param _opts - Transaction options (not used).
     */
    async signTransaction(address, transaction, _opts = {}) {
        const tx = (0, util_1.toJson)({
            ...transaction.toJSON(),
            from: address,
            type: `0x${transaction.type.toString(16)}`,
            chainId: (0, utils_1.bigIntToHex)(transaction.common.chainId()),
        });
        const signedTx = await __classPrivateFieldGet(this, _SnapKeyring_instances, "m", _SnapKeyring_submitRequest).call(this, {
            address,
            method: keyring_api_1.EthMethod.SignTransaction,
            params: [tx],
        });
        // ! It's *** CRITICAL *** that we mask the signature here, otherwise the
        // ! snap could overwrite the transaction.
        const signature = (0, superstruct_1.mask)(signedTx, (0, superstruct_1.object)({
            r: (0, superstruct_1.string)(),
            s: (0, superstruct_1.string)(),
            v: (0, superstruct_1.string)(),
        }));
        return tx_1.TransactionFactory.fromTxData({
            ...tx,
            r: signature.r,
            s: signature.s,
            v: signature.v,
        });
    }
    /**
     * Sign a typed data message.
     *
     * @param address - Signer's address.
     * @param data - Data to sign.
     * @param opts - Signing options.
     * @returns The signature.
     */
    async signTypedData(address, data, opts = { version: eth_sig_util_1.SignTypedDataVersion.V1 }) {
        const methods = {
            [eth_sig_util_1.SignTypedDataVersion.V1]: keyring_api_1.EthMethod.SignTypedDataV1,
            [eth_sig_util_1.SignTypedDataVersion.V3]: keyring_api_1.EthMethod.SignTypedDataV3,
            [eth_sig_util_1.SignTypedDataVersion.V4]: keyring_api_1.EthMethod.SignTypedDataV4,
        };
        // Use 'V1' by default to match other keyring implementations. V1 will be
        // used if the version is not specified or not supported.
        const method = methods[opts.version] || keyring_api_1.EthMethod.SignTypedDataV1;
        return (0, util_1.strictMask)(await __classPrivateFieldGet(this, _SnapKeyring_instances, "m", _SnapKeyring_submitRequest).call(this, {
            address,
            method,
            params: (0, util_1.toJson)([address, data]),
        }), keyring_api_1.EthBytesStruct);
    }
    /**
     * Sign a message.
     *
     * @param address - Signer's address.
     * @param hash - Data to sign.
     * @returns The signature.
     */
    async signMessage(address, hash) {
        return (0, util_1.strictMask)(await __classPrivateFieldGet(this, _SnapKeyring_instances, "m", _SnapKeyring_submitRequest).call(this, {
            address,
            method: keyring_api_1.EthMethod.Sign,
            params: (0, util_1.toJson)([address, hash]),
        }), keyring_api_1.EthBytesStruct);
    }
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
    async signPersonalMessage(address, data) {
        return (0, util_1.strictMask)(await __classPrivateFieldGet(this, _SnapKeyring_instances, "m", _SnapKeyring_submitRequest).call(this, {
            address,
            method: keyring_api_1.EthMethod.PersonalSign,
            params: (0, util_1.toJson)([data, address]),
        }), keyring_api_1.EthBytesStruct);
    }
    /**
     * Convert a base transaction to a base UserOperation.
     *
     * @param address - Address of the sender.
     * @param transactions - Base transactions to include in the UserOperation.
     * @returns A pseudo-UserOperation that can be used to construct a real.
     */
    async prepareUserOperation(address, transactions) {
        return (0, util_1.strictMask)(await __classPrivateFieldGet(this, _SnapKeyring_instances, "m", _SnapKeyring_submitRequest).call(this, {
            address,
            method: keyring_api_1.EthMethod.PrepareUserOperation,
            params: (0, util_1.toJson)(transactions),
        }), keyring_api_1.EthBaseUserOperationStruct);
    }
    /**
     * Patches properties of a UserOperation. Currently, only the
     * `paymasterAndData` can be patched.
     *
     * @param address - Address of the sender.
     * @param userOp - UserOperation to patch.
     * @returns A patch to apply to the UserOperation.
     */
    async patchUserOperation(address, userOp) {
        return (0, util_1.strictMask)(await __classPrivateFieldGet(this, _SnapKeyring_instances, "m", _SnapKeyring_submitRequest).call(this, {
            address,
            method: keyring_api_1.EthMethod.PatchUserOperation,
            params: (0, util_1.toJson)([userOp]),
        }), keyring_api_1.EthUserOperationPatchStruct);
    }
    /**
     * Signs an UserOperation.
     *
     * @param address - Address of the sender.
     * @param userOp - UserOperation to sign.
     * @returns The signature of the UserOperation.
     */
    async signUserOperation(address, userOp) {
        return (0, util_1.strictMask)(await __classPrivateFieldGet(this, _SnapKeyring_instances, "m", _SnapKeyring_submitRequest).call(this, {
            address,
            method: keyring_api_1.EthMethod.SignUserOperation,
            params: (0, util_1.toJson)([userOp]),
        }), keyring_api_1.EthBytesStruct);
    }
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
    exportAccount(_address) {
        throw new Error('Exporting accounts from snaps is not supported.');
    }
    /**
     * Removes the account matching the given address.
     *
     * @param address - Address of the account to remove.
     */
    async removeAccount(address) {
        const { account, snapId } = __classPrivateFieldGet(this, _SnapKeyring_instances, "m", _SnapKeyring_resolveAddress).call(this, address);
        // Always remove the account from the maps, even if the snap is going to
        // fail to delete it.
        __classPrivateFieldGet(this, _SnapKeyring_accounts, "f").delete(snapId, account.id);
        try {
            await __classPrivateFieldGet(this, _SnapKeyring_snapClient, "f").withSnapId(snapId).deleteAccount(account.id);
        }
        catch (error) {
            // If the snap failed to delete the account, log the error and continue
            // with the account deletion, otherwise the account will be stuck in the
            // keyring.
            console.error(`Account '${address}' may not have been removed from snap '${snapId}':`, error);
        }
    }
    /**
     * Return an internal account object for a given address.
     *
     * @param address - Address of the account to return.
     * @returns An internal account object for the given address.
     */
    getAccountByAddress(address) {
        const accounts = this.listAccounts();
        return accounts.find(({ address: accountAddress }) => (0, util_1.equalsIgnoreCase)(accountAddress, address));
    }
    /**
     * List all snap keyring accounts.
     *
     * @returns An array containing all snap keyring accounts.
     */
    listAccounts() {
        return [...__classPrivateFieldGet(this, _SnapKeyring_accounts, "f").values()].map(({ account, snapId }) => {
            const snap = __classPrivateFieldGet(this, _SnapKeyring_instances, "m", _SnapKeyring_getSnapMetadata).call(this, snapId);
            return {
                ...account,
                // TODO: Do not convert the address to lowercase.
                //
                // This is a workaround to support the current UI which expects the
                // account address to be lowercase. This workaround should be removed
                // once we migrated the UI to use the account ID instead of the account
                // address.
                address: account.address.toLowerCase(),
                metadata: {
                    name: '',
                    keyring: {
                        type: this.type,
                    },
                    ...(snap !== undefined && { snap }),
                },
            };
        });
    }
}
exports.SnapKeyring = SnapKeyring;
_SnapKeyring_snapClient = new WeakMap(), _SnapKeyring_accounts = new WeakMap(), _SnapKeyring_requests = new WeakMap(), _SnapKeyring_callbacks = new WeakMap(), _SnapKeyring_instances = new WeakSet(), _SnapKeyring_handleAccountCreated = 
/**
 * Handle an Account Created event from a snap.
 *
 * @param snapId - Snap ID.
 * @param message - Event message.
 * @returns `null`.
 */
async function _SnapKeyring_handleAccountCreated(snapId, message) {
    (0, superstruct_1.assert)(message, keyring_api_1.AccountCreatedEventStruct);
    const { account } = message.params;
    // The UI still uses the account address to identify accounts, so we need
    // to block the creation of duplicate accounts for now to prevent accounts
    // from being overwritten.
    if (await __classPrivateFieldGet(this, _SnapKeyring_callbacks, "f").addressExists(account.address.toLowerCase())) {
        throw new Error(`Account address '${account.address}' already exists`);
    }
    // A snap could try to create an account with a different address but with
    // an existing ID, so the above test only is not enough.
    if (__classPrivateFieldGet(this, _SnapKeyring_accounts, "f").has(snapId, account.id)) {
        throw new Error(`Account '${account.id}' already exists`);
    }
    await __classPrivateFieldGet(this, _SnapKeyring_callbacks, "f").addAccount(account.address.toLowerCase(), snapId, async (accepted) => {
        if (accepted) {
            __classPrivateFieldGet(this, _SnapKeyring_accounts, "f").set(account.id, { account, snapId });
            await __classPrivateFieldGet(this, _SnapKeyring_callbacks, "f").saveState();
        }
    });
    return null;
}, _SnapKeyring_handleAccountUpdated = 
/**
 * Handle an Account Updated event from a snap.
 *
 * @param snapId - Snap ID.
 * @param message - Event message.
 * @returns `null`.
 */
async function _SnapKeyring_handleAccountUpdated(snapId, message) {
    (0, superstruct_1.assert)(message, keyring_api_1.AccountUpdatedEventStruct);
    const { account: newAccount } = message.params;
    const { account: oldAccount } = __classPrivateFieldGet(this, _SnapKeyring_accounts, "f").get(snapId, newAccount.id) ??
        (0, util_1.throwError)(`Account '${newAccount.id}' not found`);
    // The address of the account cannot be changed. In the future, we will
    // support changing the address of an account since it will be required to
    // support UTXO-based chains.
    if (!(0, util_1.equalsIgnoreCase)(oldAccount.address, newAccount.address)) {
        throw new Error(`Cannot change address of account '${newAccount.id}'`);
    }
    __classPrivateFieldGet(this, _SnapKeyring_accounts, "f").set(newAccount.id, { account: newAccount, snapId });
    await __classPrivateFieldGet(this, _SnapKeyring_callbacks, "f").saveState();
    return null;
}, _SnapKeyring_handleAccountDeleted = 
/**
 * Handle an Account Deleted event from a snap.
 *
 * @param snapId - Snap ID.
 * @param message - Event message.
 * @returns `null`.
 */
async function _SnapKeyring_handleAccountDeleted(snapId, message) {
    (0, superstruct_1.assert)(message, keyring_api_1.AccountDeletedEventStruct);
    const { id } = message.params;
    const entry = __classPrivateFieldGet(this, _SnapKeyring_accounts, "f").get(snapId, id);
    // We can ignore the case where the account was already removed from the
    // keyring, making the deletion idempotent.
    //
    // This happens when the keyring calls the snap to delete an account, and
    // the snap calls the keyring back with an `AccountDeleted` event.
    if (entry === undefined) {
        return null;
    }
    // At this point we know that the account exists, so we can safely
    // destructure it.
    const { account: { address }, } = entry;
    await __classPrivateFieldGet(this, _SnapKeyring_callbacks, "f").removeAccount(address.toLowerCase(), snapId, async (accepted) => {
        if (accepted) {
            await __classPrivateFieldGet(this, _SnapKeyring_callbacks, "f").saveState();
        }
    });
    return null;
}, _SnapKeyring_handleRequestApproved = 
/**
 * Handle an Request Approved event from a snap.
 *
 * @param snapId - Snap ID.
 * @param message - Event message.
 * @returns `null`.
 */
async function _SnapKeyring_handleRequestApproved(snapId, message) {
    (0, superstruct_1.assert)(message, keyring_api_1.RequestApprovedEventStruct);
    const { id, result } = message.params;
    const { promise } = __classPrivateFieldGet(this, _SnapKeyring_requests, "f").get(snapId, id) ?? (0, util_1.throwError)(`Request '${id}' not found`);
    __classPrivateFieldGet(this, _SnapKeyring_requests, "f").delete(snapId, id);
    promise.resolve(result);
    return null;
}, _SnapKeyring_handleRequestRejected = 
/**
 * Handle an Request Rejected event from a snap.
 *
 * @param snapId - Snap ID.
 * @param message - Event message.
 * @returns `null`.
 */
async function _SnapKeyring_handleRequestRejected(snapId, message) {
    (0, superstruct_1.assert)(message, keyring_api_1.RequestRejectedEventStruct);
    const { id } = message.params;
    const { promise } = __classPrivateFieldGet(this, _SnapKeyring_requests, "f").get(snapId, id) ?? (0, util_1.throwError)(`Request '${id}' not found`);
    __classPrivateFieldGet(this, _SnapKeyring_requests, "f").delete(snapId, id);
    promise.reject(new Error(`Request rejected by user or snap.`));
    return null;
}, _SnapKeyring_submitRequest = 
/**
 * Submit a request to a snap.
 *
 * @param opts - Request options.
 * @param opts.address - Account address.
 * @param opts.method - Method to call.
 * @param opts.params - Method parameters.
 * @param opts.chainId - Selected chain ID (CAIP-2).
 * @returns Promise that resolves to the result of the method call.
 */
async function _SnapKeyring_submitRequest({ address, method, params, chainId = '', }) {
    const { account, snapId } = __classPrivateFieldGet(this, _SnapKeyring_instances, "m", _SnapKeyring_resolveAddress).call(this, address);
    if (!account.methods.includes(method)) {
        throw new Error(`Method '${method}' not supported for account ${account.address}`);
    }
    const requestId = (0, uuid_1.v4)();
    // Create the promise before calling the snap to prevent a race condition
    // where the snap responds before we have a chance to create it.
    const promise = new DeferredPromise_1.DeferredPromise();
    __classPrivateFieldGet(this, _SnapKeyring_requests, "f").set(requestId, { promise, snapId });
    const response = await (async () => {
        try {
            return await __classPrivateFieldGet(this, _SnapKeyring_snapClient, "f").withSnapId(snapId).submitRequest({
                id: requestId,
                scope: chainId,
                account: account.id,
                request: {
                    method,
                    ...(params !== undefined && { params }),
                },
            });
        }
        catch (error) {
            // If the snap failed to respond, delete the promise to prevent a leak.
            __classPrivateFieldGet(this, _SnapKeyring_requests, "f").delete(snapId, requestId);
            throw error;
        }
    })();
    // If the snap answers synchronously, the promise must be removed from the
    // map to prevent a leak.
    if (!response.pending) {
        __classPrivateFieldGet(this, _SnapKeyring_requests, "f").delete(snapId, requestId);
        return response.result;
    }
    // If the snap answers asynchronously, we will inform the user with a redirect
    if (response.redirect?.message || response.redirect?.url) {
        const { message = '', url = '' } = response.redirect;
        await __classPrivateFieldGet(this, _SnapKeyring_callbacks, "f").redirectUser(snapId, url, message);
    }
    return promise.promise;
}, _SnapKeyring_resolveAddress = function _SnapKeyring_resolveAddress(address) {
    return ([...__classPrivateFieldGet(this, _SnapKeyring_accounts, "f").values()].find(({ account }) => (0, util_1.equalsIgnoreCase)(account.address, address)) ?? (0, util_1.throwError)(`Account '${address}' not found`));
}, _SnapKeyring_getSnapMetadata = function _SnapKeyring_getSnapMetadata(snapId) {
    const snap = __classPrivateFieldGet(this, _SnapKeyring_snapClient, "f").getController().get(snapId);
    return snap
        ? { id: snapId, name: snap.manifest.proposedName, enabled: snap.enabled }
        : undefined;
};
SnapKeyring.type = exports.SNAP_KEYRING_TYPE;
//# sourceMappingURL=SnapKeyring.js.map