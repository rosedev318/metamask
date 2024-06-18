"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AccountsController_instances, _AccountsController_generateInternalAccountForNonSnapAccount, _AccountsController_listSnapAccounts, _AccountsController_listNormalAccounts, _AccountsController_handleOnKeyringStateChange, _AccountsController_handleOnSnapStateChange, _AccountsController_getNextAccountNumber, _AccountsController_handleNewAccountAdded, _AccountsController_handleAccountRemoved, _AccountsController_registerMessageHandlers;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsController = void 0;
const util_1 = require("@ethereumjs/util");
const base_controller_1 = require("@metamask/base-controller");
const eth_snap_keyring_1 = require("@metamask/eth-snap-keyring");
const keyring_api_1 = require("@metamask/keyring-api");
const keyring_controller_1 = require("@metamask/keyring-controller");
const sha256_1 = require("ethereum-cryptography/sha256");
const uuid_1 = require("uuid");
const utils_1 = require("./utils");
const controllerName = 'AccountsController';
const accountsControllerMetadata = {
    internalAccounts: {
        persist: true,
        anonymous: false,
    },
};
const defaultState = {
    internalAccounts: {
        accounts: {},
        selectedAccount: '',
    },
};
/**
 * Controller that manages internal accounts.
 * The accounts controller is responsible for creating and managing internal accounts.
 * It also provides convenience methods for accessing and updating the internal accounts.
 * The accounts controller also listens for keyring state changes and updates the internal accounts accordingly.
 * The accounts controller also listens for snap state changes and updates the internal accounts accordingly.
 *
 */
class AccountsController extends base_controller_1.BaseController {
    /**
     * Constructor for AccountsController.
     *
     * @param options - The controller options.
     * @param options.messenger - The messenger object.
     * @param options.state - Initial state to set on this controller
     */
    constructor({ messenger, state, }) {
        super({
            messenger,
            name: controllerName,
            metadata: accountsControllerMetadata,
            state: Object.assign(Object.assign({}, defaultState), state),
        });
        _AccountsController_instances.add(this);
        this.messagingSystem.subscribe('SnapController:stateChange', (snapStateState) => __classPrivateFieldGet(this, _AccountsController_instances, "m", _AccountsController_handleOnSnapStateChange).call(this, snapStateState));
        this.messagingSystem.subscribe('KeyringController:stateChange', (keyringState) => __classPrivateFieldGet(this, _AccountsController_instances, "m", _AccountsController_handleOnKeyringStateChange).call(this, keyringState));
        __classPrivateFieldGet(this, _AccountsController_instances, "m", _AccountsController_registerMessageHandlers).call(this);
    }
    /**
     * Returns the internal account object for the given account ID, if it exists.
     *
     * @param accountId - The ID of the account to retrieve.
     * @returns The internal account object, or undefined if the account does not exist.
     */
    getAccount(accountId) {
        return this.state.internalAccounts.accounts[accountId];
    }
    /**
     * Returns an array of all internal accounts.
     *
     * @returns An array of InternalAccount objects.
     */
    listAccounts() {
        return Object.values(this.state.internalAccounts.accounts);
    }
    /**
     * Returns the internal account object for the given account ID.
     *
     * @param accountId - The ID of the account to retrieve.
     * @returns The internal account object.
     * @throws An error if the account ID is not found.
     */
    getAccountExpect(accountId) {
        // Edge case where the extension is setup but the srp is not yet created
        // certain ui elements will query the selected address before any accounts are created.
        if (!accountId) {
            return {
                id: '',
                address: '',
                options: {},
                methods: [],
                type: keyring_api_1.EthAccountType.Eoa,
                metadata: {
                    name: '',
                    keyring: {
                        type: '',
                    },
                },
            };
        }
        const account = this.getAccount(accountId);
        if (account === undefined) {
            throw new Error(`Account Id ${accountId} not found`);
        }
        return account;
    }
    /**
     * Returns the selected internal account.
     *
     * @returns The selected internal account.
     */
    getSelectedAccount() {
        return this.getAccountExpect(this.state.internalAccounts.selectedAccount);
    }
    /**
     * Returns the account with the specified address.
     * ! This method will only return the first account that matches the address
     * @param address - The address of the account to retrieve.
     * @returns The account with the specified address, or undefined if not found.
     */
    getAccountByAddress(address) {
        return this.listAccounts().find((account) => account.address.toLowerCase() === address.toLowerCase());
    }
    /**
     * Sets the selected account by its ID.
     *
     * @param accountId - The ID of the account to be selected.
     */
    setSelectedAccount(accountId) {
        const account = this.getAccount(accountId);
        this.update((currentState) => {
            if (account) {
                currentState.internalAccounts.accounts[account.id].metadata.lastSelected = Date.now();
                currentState.internalAccounts.selectedAccount = account.id;
            }
            else {
                currentState.internalAccounts.selectedAccount = '';
            }
        });
        if (account) {
            this.messagingSystem.publish('AccountsController:selectedAccountChange', account);
        }
    }
    /**
     * Sets the name of the account with the given ID.
     *
     * @param accountId - The ID of the account to set the name for.
     * @param accountName - The new name for the account.
     * @throws An error if an account with the same name already exists.
     */
    setAccountName(accountId, accountName) {
        const account = this.getAccountExpect(accountId);
        if (this.listAccounts().find((internalAccount) => internalAccount.metadata.name === accountName &&
            internalAccount.id !== accountId)) {
            throw new Error('Account name already exists');
        }
        this.update((currentState) => {
            const internalAccount = Object.assign(Object.assign({}, account), { metadata: Object.assign(Object.assign({}, account.metadata), { name: accountName }) });
            currentState.internalAccounts.accounts[accountId] =
                // @ts-expect-error Assigning a complex type `T` to `Draft<T>` causes an excessive type instantiation depth error.
                internalAccount;
        });
    }
    /**
     * Updates the internal accounts list by retrieving normal and snap accounts,
     * removing duplicates, and updating the metadata of each account.
     *
     * @returns A Promise that resolves when the accounts have been updated.
     */
    updateAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapAccounts = yield __classPrivateFieldGet(this, _AccountsController_instances, "m", _AccountsController_listSnapAccounts).call(this);
            const normalAccounts = (yield __classPrivateFieldGet(this, _AccountsController_instances, "m", _AccountsController_listNormalAccounts).call(this)).filter((account) => !snapAccounts.find((snapAccount) => snapAccount.address === account.address));
            // keyring type map.
            const keyringTypes = new Map();
            const previousAccounts = this.state.internalAccounts.accounts;
            const accounts = [
                ...normalAccounts,
                ...snapAccounts,
            ].reduce((internalAccountMap, internalAccount) => {
                var _a, _b;
                const keyringTypeName = (0, utils_1.keyringTypeToName)(internalAccount.metadata.keyring.type);
                const keyringAccountIndex = (_a = keyringTypes.get(keyringTypeName)) !== null && _a !== void 0 ? _a : 0;
                if (keyringAccountIndex) {
                    keyringTypes.set(keyringTypeName, keyringAccountIndex + 1);
                }
                else {
                    keyringTypes.set(keyringTypeName, 1);
                }
                const existingAccount = previousAccounts[internalAccount.id];
                internalAccountMap[internalAccount.id] = Object.assign(Object.assign({}, internalAccount), { metadata: Object.assign(Object.assign({}, internalAccount.metadata), { name: existingAccount && existingAccount.metadata.name !== ''
                            ? existingAccount.metadata.name
                            : `${keyringTypeName} ${keyringAccountIndex + 1}`, lastSelected: (_b = existingAccount === null || existingAccount === void 0 ? void 0 : existingAccount.metadata) === null || _b === void 0 ? void 0 : _b.lastSelected }) });
                return internalAccountMap;
            }, {});
            this.update((currentState) => {
                currentState.internalAccounts.accounts =
                    accounts;
            });
        });
    }
    /**
     * Loads the backup state of the accounts controller.
     *
     * @param backup - The backup state to load.
     */
    loadBackup(backup) {
        if (backup.internalAccounts) {
            this.update((currentState) => {
                currentState.internalAccounts =
                    backup.internalAccounts;
            });
        }
    }
}
exports.AccountsController = AccountsController;
_AccountsController_instances = new WeakSet(), _AccountsController_generateInternalAccountForNonSnapAccount = function _AccountsController_generateInternalAccountForNonSnapAccount(address, type) {
    return {
        id: (0, utils_1.getUUIDFromAddressOfNormalAccount)(address),
        address,
        options: {},
        methods: [
            keyring_api_1.EthMethod.PersonalSign,
            keyring_api_1.EthMethod.Sign,
            keyring_api_1.EthMethod.SignTransaction,
            keyring_api_1.EthMethod.SignTypedDataV1,
            keyring_api_1.EthMethod.SignTypedDataV3,
            keyring_api_1.EthMethod.SignTypedDataV4,
        ],
        type: keyring_api_1.EthAccountType.Eoa,
        metadata: {
            name: '',
            keyring: {
                type,
            },
        },
    };
}, _AccountsController_listSnapAccounts = function _AccountsController_listSnapAccounts() {
    return __awaiter(this, void 0, void 0, function* () {
        const [snapKeyring] = this.messagingSystem.call('KeyringController:getKeyringsByType', eth_snap_keyring_1.SnapKeyring.type);
        // snap keyring is not available until the first account is created in the keyring controller
        if (!snapKeyring) {
            return [];
        }
        const snapAccounts = snapKeyring.listAccounts();
        return snapAccounts;
    });
}, _AccountsController_listNormalAccounts = function _AccountsController_listNormalAccounts() {
    return __awaiter(this, void 0, void 0, function* () {
        const addresses = yield this.messagingSystem.call('KeyringController:getAccounts');
        const internalAccounts = [];
        for (const address of addresses) {
            const keyring = yield this.messagingSystem.call('KeyringController:getKeyringForAccount', address);
            const v4options = {
                random: (0, sha256_1.sha256)((0, util_1.toBuffer)(address)).slice(0, 16),
            };
            internalAccounts.push({
                id: (0, uuid_1.v4)(v4options),
                address,
                options: {},
                methods: [
                    keyring_api_1.EthMethod.PersonalSign,
                    keyring_api_1.EthMethod.Sign,
                    keyring_api_1.EthMethod.SignTransaction,
                    keyring_api_1.EthMethod.SignTypedDataV1,
                    keyring_api_1.EthMethod.SignTypedDataV3,
                    keyring_api_1.EthMethod.SignTypedDataV4,
                ],
                type: keyring_api_1.EthAccountType.Eoa,
                metadata: {
                    name: '',
                    keyring: {
                        type: keyring.type,
                    },
                },
            });
        }
        return internalAccounts.filter((account) => account.metadata.keyring.type !== keyring_controller_1.KeyringTypes.snap);
    });
}, _AccountsController_handleOnKeyringStateChange = function _AccountsController_handleOnKeyringStateChange(keyringState) {
    // check if there are any new accounts added
    // TODO: change when accountAdded event is added to the keyring controller
    // We check for keyrings length to be greater than 0 because the extension client may try execute
    // submit password twice and clear the keyring state.
    // https://github.com/MetaMask/KeyringController/blob/2d73a4deed8d013913f6ef0c9f5c0bb7c614f7d3/src/KeyringController.ts#L910
    if (keyringState.isUnlocked && keyringState.keyrings.length > 0) {
        const updatedNormalKeyringAddresses = [];
        const updatedSnapKeyringAddresses = [];
        for (const keyring of keyringState.keyrings) {
            if (keyring.type === keyring_controller_1.KeyringTypes.snap) {
                updatedSnapKeyringAddresses.push(...keyring.accounts.map((address) => {
                    return {
                        address,
                        type: keyring.type,
                    };
                }));
            }
            else {
                updatedNormalKeyringAddresses.push(...keyring.accounts.map((address) => {
                    return {
                        address,
                        type: keyring.type,
                    };
                }));
            }
        }
        const { previousNormalInternalAccounts, previousSnapInternalAccounts } = this.listAccounts().reduce((accumulator, account) => {
            if (account.metadata.keyring.type === keyring_controller_1.KeyringTypes.snap) {
                accumulator.previousSnapInternalAccounts.push(account);
            }
            else {
                accumulator.previousNormalInternalAccounts.push(account);
            }
            return accumulator;
        }, {
            previousNormalInternalAccounts: [],
            previousSnapInternalAccounts: [],
        });
        const addedAccounts = [];
        const deletedAccounts = [];
        // snap account ids are random uuid while normal accounts
        // are determininistic based on the address
        // ^NOTE: This will be removed when normal accounts also implement internal accounts
        // finding all the normal accounts that were added
        for (const account of updatedNormalKeyringAddresses) {
            if (!this.state.internalAccounts.accounts[(0, utils_1.getUUIDFromAddressOfNormalAccount)(account.address)]) {
                addedAccounts.push(account);
            }
        }
        // finding all the snap accounts that were added
        for (const account of updatedSnapKeyringAddresses) {
            if (!previousSnapInternalAccounts.find((internalAccount) => internalAccount.address.toLowerCase() ===
                account.address.toLowerCase())) {
                addedAccounts.push(account);
            }
        }
        // finding all the normal accounts that were deleted
        for (const account of previousNormalInternalAccounts) {
            if (!updatedNormalKeyringAddresses.find(({ address }) => address.toLowerCase() === account.address.toLowerCase())) {
                deletedAccounts.push(account);
            }
        }
        // finding all the snap accounts that were deleted
        for (const account of previousSnapInternalAccounts) {
            if (!updatedSnapKeyringAddresses.find(({ address }) => address.toLowerCase() === account.address.toLowerCase())) {
                deletedAccounts.push(account);
            }
        }
        if (deletedAccounts.length > 0) {
            for (const account of deletedAccounts) {
                __classPrivateFieldGet(this, _AccountsController_instances, "m", _AccountsController_handleAccountRemoved).call(this, account.id);
            }
        }
        if (addedAccounts.length > 0) {
            for (const account of addedAccounts) {
                __classPrivateFieldGet(this, _AccountsController_instances, "m", _AccountsController_handleNewAccountAdded).call(this, account);
            }
        }
        // handle if the selected account was deleted
        if (!this.getAccount(this.state.internalAccounts.selectedAccount)) {
            const [accountToSelect] = this.listAccounts().sort((accountA, accountB) => {
                var _a, _b;
                // sort by lastSelected descending
                return (((_a = accountB.metadata.lastSelected) !== null && _a !== void 0 ? _a : 0) -
                    ((_b = accountA.metadata.lastSelected) !== null && _b !== void 0 ? _b : 0));
            });
            // if the accountToSelect is undefined, then there are no accounts
            // it mean the keyring was reinitialized.
            this.setSelectedAccount(accountToSelect === null || accountToSelect === void 0 ? void 0 : accountToSelect.id);
        }
    }
}, _AccountsController_handleOnSnapStateChange = function _AccountsController_handleOnSnapStateChange(snapState) {
    // only check if snaps changed in status
    const { snaps } = snapState;
    const accounts = this.listAccounts().filter((account) => account.metadata.snap);
    this.update((currentState) => {
        accounts.forEach((account) => {
            const currentAccount = currentState.internalAccounts.accounts[account.id];
            if (currentAccount.metadata.snap) {
                const snapId = currentAccount.metadata.snap.id;
                const storedSnap = snaps[snapId];
                if (storedSnap) {
                    currentAccount.metadata.snap.enabled =
                        storedSnap.enabled && !storedSnap.blocked;
                }
            }
        });
    });
}, _AccountsController_getNextAccountNumber = function _AccountsController_getNextAccountNumber(keyringType) {
    const keyringName = (0, utils_1.keyringTypeToName)(keyringType);
    const previousKeyringAccounts = this.listAccounts().filter((internalAccount) => {
        if (keyringType === keyring_controller_1.KeyringTypes.hd ||
            keyringType === keyring_controller_1.KeyringTypes.simple) {
            return (internalAccount.metadata.keyring.type === keyring_controller_1.KeyringTypes.hd ||
                internalAccount.metadata.keyring.type === keyring_controller_1.KeyringTypes.simple);
        }
        return internalAccount.metadata.keyring.type === keyringType;
    });
    const lastDefaultIndexUsedForKeyringType = previousKeyringAccounts
        .filter((internalAccount) => new RegExp(`${keyringName} \\d+$`, 'u').test(internalAccount.metadata.name))
        .map((internalAccount) => {
        const nameToWords = internalAccount.metadata.name.split(' '); // get the index of a default account name
        return parseInt(nameToWords[nameToWords.length], 10);
    })
        .sort((a, b) => b - a)[0] || 0;

    const indexToUse = Math.max(previousKeyringAccounts.length + 1, lastDefaultIndexUsedForKeyringType + 1);
    return { accountPrefix: keyringName, indexToUse };
}, _AccountsController_handleNewAccountAdded = function _AccountsController_handleNewAccountAdded(account) {
    let newAccount;
    if (account.type !== keyring_controller_1.KeyringTypes.snap) {
        newAccount = __classPrivateFieldGet(this, _AccountsController_instances, "m", _AccountsController_generateInternalAccountForNonSnapAccount).call(this, account.address, account.type);
    }
    else {
        const [snapKeyring] = this.messagingSystem.call('KeyringController:getKeyringsByType', eth_snap_keyring_1.SnapKeyring.type);
        newAccount = snapKeyring.getAccountByAddress(account.address);
        // The snap deleted the account before the keyring controller could add it
        if (!newAccount) {
            return;
        }
    }
    // get next index number for the keyring type
    const { accountPrefix, indexToUse } = __classPrivateFieldGet(this, _AccountsController_instances, "m", _AccountsController_getNextAccountNumber).call(this, newAccount.metadata.keyring.type);
    const accountName = `${accountPrefix} ${indexToUse}`;
    this.update((currentState) => {
        currentState.internalAccounts.accounts[newAccount.id] = Object.assign(Object.assign({}, newAccount), { metadata: Object.assign(Object.assign({}, newAccount.metadata), { name: accountName, lastSelected: Date.now() }) });
    });
    this.setSelectedAccount(newAccount.id);
}, _AccountsController_handleAccountRemoved = function _AccountsController_handleAccountRemoved(accountId) {
    this.update((currentState) => {
        delete currentState.internalAccounts.accounts[accountId];
    });
}, _AccountsController_registerMessageHandlers = function _AccountsController_registerMessageHandlers() {
    this.messagingSystem.registerActionHandler(`${controllerName}:setSelectedAccount`, this.setSelectedAccount.bind(this));
    this.messagingSystem.registerActionHandler(`${controllerName}:listAccounts`, this.listAccounts.bind(this));
    this.messagingSystem.registerActionHandler(`${controllerName}:setAccountName`, this.setAccountName.bind(this));
    this.messagingSystem.registerActionHandler(`${controllerName}:updateAccounts`, this.updateAccounts.bind(this));
    this.messagingSystem.registerActionHandler(`${controllerName}:getSelectedAccount`, this.getSelectedAccount.bind(this));
    this.messagingSystem.registerActionHandler(`${controllerName}:getAccountByAddress`, this.getAccountByAddress.bind(this));
    this.messagingSystem.registerActionHandler(`AccountsController:getAccount`, this.getAccount.bind(this));
};
//# sourceMappingURL=AccountsController.js.map