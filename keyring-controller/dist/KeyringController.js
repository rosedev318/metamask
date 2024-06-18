"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _KeyringController_instances, _KeyringController_keyringBuilders, _KeyringController_keyrings, _KeyringController_unsupportedKeyrings, _KeyringController_password, _KeyringController_encryptor, _KeyringController_cacheEncryptionKey, _KeyringController_qrKeyringStateListener, _KeyringController_registerMessageHandlers, _KeyringController_getKeyringBuilderForType, _KeyringController_addQRKeyring, _KeyringController_subscribeToQRKeyringEvents, _KeyringController_unsubscribeFromQRKeyringsEvents, _KeyringController_createNewVaultWithKeyring, _KeyringController_updateKeyringsInState, _KeyringController_unlockKeyrings, _KeyringController_createKeyringWithFirstAccount, _KeyringController_newKeyring, _KeyringController_clearKeyrings, _KeyringController_restoreKeyring, _KeyringController_destroyKeyring, _KeyringController_removeEmptyKeyrings, _KeyringController_checkForDuplicate, _KeyringController_setUnlocked, _KeyringController_getMemState;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyringController = exports.getDefaultKeyringState = exports.keyringBuilderFactory = exports.SignTypedDataVersion = exports.AccountImportStrategy = exports.isCustodyKeyring = exports.KeyringTypes = void 0;
const util_1 = require("@ethereumjs/util");
const base_controller_1 = require("@metamask/base-controller");
const encryptorUtils = __importStar(require("@metamask/browser-passworder"));
const eth_hd_keyring_1 = __importDefault(require("@metamask/eth-hd-keyring"));
const eth_sig_util_1 = require("@metamask/eth-sig-util");
const eth_simple_keyring_1 = __importDefault(require("@metamask/eth-simple-keyring"));
const utils_1 = require("@metamask/utils");
const async_mutex_1 = require("async-mutex");
const ethereumjs_wallet_1 = __importStar(require("ethereumjs-wallet"));
const constants_1 = require("./constants");
const name = 'KeyringController';
/**
 * Available keyring types
 */
var KeyringTypes;
(function (KeyringTypes) {
    KeyringTypes["simple"] = "Simple Key Pair";
    KeyringTypes["hd"] = "HD Key Tree";
    KeyringTypes["qr"] = "QR Hardware Wallet Device";
    KeyringTypes["trezor"] = "Trezor Hardware";
    KeyringTypes["ledger"] = "Ledger Hardware";
    KeyringTypes["lattice"] = "Lattice Hardware";
    KeyringTypes["snap"] = "Snap Keyring";
    KeyringTypes["remote"] = "Remote";
})(KeyringTypes = exports.KeyringTypes || (exports.KeyringTypes = {}));
/**
 * Custody keyring types are a special case, as they are not a single type
 * but they all start with the prefix "Custody".
 * @param keyringType - The type of the keyring.
 * @returns Whether the keyring type is a custody keyring.
 */
const isCustodyKeyring = (keyringType) => {
    return keyringType.startsWith('Custody');
};
exports.isCustodyKeyring = isCustodyKeyring;
/**
 * A strategy for importing an account
 */
var AccountImportStrategy;
(function (AccountImportStrategy) {
    AccountImportStrategy["privateKey"] = "privateKey";
    AccountImportStrategy["json"] = "json";
})(AccountImportStrategy = exports.AccountImportStrategy || (exports.AccountImportStrategy = {}));
/**
 * The `signTypedMessage` version
 *
 * @see https://docs.metamask.io/guide/signing-data.html
 */
var SignTypedDataVersion;
(function (SignTypedDataVersion) {
    SignTypedDataVersion["V1"] = "V1";
    SignTypedDataVersion["V3"] = "V3";
    SignTypedDataVersion["V4"] = "V4";
})(SignTypedDataVersion = exports.SignTypedDataVersion || (exports.SignTypedDataVersion = {}));
/**
 * Get builder function for `Keyring`
 *
 * Returns a builder function for `Keyring` with a `type` property.
 *
 * @param KeyringConstructor - The Keyring class for the builder.
 * @returns A builder function for the given Keyring.
 */
function keyringBuilderFactory(KeyringConstructor) {
    const builder = () => new KeyringConstructor();
    builder.type = KeyringConstructor.type;
    return builder;
}
exports.keyringBuilderFactory = keyringBuilderFactory;
const defaultKeyringBuilders = [
    keyringBuilderFactory(eth_simple_keyring_1.default),
    keyringBuilderFactory(eth_hd_keyring_1.default),
];
const getDefaultKeyringState = () => {
    return {
        isUnlocked: false,
        keyrings: [],
    };
};
exports.getDefaultKeyringState = getDefaultKeyringState;
/**
 * Assert that the given keyring has an exportable
 * mnemonic.
 *
 * @param keyring - The keyring to check
 * @throws When the keyring does not have a mnemonic
 */
function assertHasUint8ArrayMnemonic(keyring) {
    if (!((0, utils_1.hasProperty)(keyring, 'mnemonic') && keyring.mnemonic instanceof Uint8Array)) {
        throw new Error("Can't get mnemonic bytes from keyring");
    }
}
/**
 * Assert that the provided encryptor supports
 * encryption and encryption key export.
 *
 * @param encryptor - The encryptor to check.
 * @throws If the encryptor does not support key encryption.
 */
function assertIsExportableKeyEncryptor(encryptor) {
    if (!('importKey' in encryptor &&
        typeof encryptor.importKey === 'function' &&
        'decryptWithKey' in encryptor &&
        typeof encryptor.decryptWithKey === 'function' &&
        'encryptWithKey' in encryptor &&
        typeof encryptor.encryptWithKey === 'function')) {
        throw new Error(constants_1.KeyringControllerError.UnsupportedEncryptionKeyExport);
    }
}
/**
 * Checks if the provided value is a serialized keyrings array.
 *
 * @param array - The value to check.
 * @returns True if the value is a serialized keyrings array.
 */
function isSerializedKeyringsArray(array) {
    return (typeof array === 'object' &&
        Array.isArray(array) &&
        array.every((value) => value.type && (0, utils_1.isValidJson)(value.data)));
}
/**
 * Display For Keyring
 *
 * Is used for adding the current keyrings to the state object.
 *
 * @param keyring - The keyring to display.
 * @returns A keyring display object, with type and accounts properties.
 */
function displayForKeyring(keyring) {
    return __awaiter(this, void 0, void 0, function* () {
        const accounts = yield keyring.getAccounts();
        return {
            type: keyring.type,
            // Cast to `Hex[]` here is safe here because `accounts` has no nullish
            // values, and `normalize` returns `Hex` unless given a nullish value
            accounts: accounts.map(eth_sig_util_1.normalize),
        };
    });
}
/**
 * Controller responsible for establishing and managing user identity.
 *
 * This class is a wrapper around the `eth-keyring-controller` package. The
 * `eth-keyring-controller` manages the "vault", which is an encrypted store of private keys, and
 * it manages the wallet "lock" state. This wrapper class has convenience methods for interacting
 * with the internal keyring controller and handling certain complex operations that involve the
 * keyrings.
 */
class KeyringController extends base_controller_1.BaseController {
    /**
     * Creates a KeyringController instance.
     *
     * @param options - Initial options used to configure this controller
     * @param options.encryptor - An optional object for defining encryption schemes.
     * @param options.keyringBuilders - Set a new name for account.
     * @param options.cacheEncryptionKey - Whether to cache or not encryption key.
     * @param options.messenger - A restricted controller messenger.
     * @param options.state - Initial state to set on this controller.
     */
    constructor(options) {
        const { encryptor = encryptorUtils, keyringBuilders, messenger, state, } = options;
        super({
            name,
            metadata: {
                vault: { persist: true, anonymous: false },
                isUnlocked: { persist: false, anonymous: true },
                keyrings: { persist: false, anonymous: false },
                encryptionKey: { persist: false, anonymous: false },
                encryptionSalt: { persist: false, anonymous: false },
            },
            messenger,
            state: Object.assign(Object.assign({}, (0, exports.getDefaultKeyringState)()), state),
        });
        _KeyringController_instances.add(this);
        this.mutex = new async_mutex_1.Mutex();
        _KeyringController_keyringBuilders.set(this, void 0);
        _KeyringController_keyrings.set(this, void 0);
        _KeyringController_unsupportedKeyrings.set(this, void 0);
        _KeyringController_password.set(this, void 0);
        _KeyringController_encryptor.set(this, void 0);
        _KeyringController_cacheEncryptionKey.set(this, void 0);
        _KeyringController_qrKeyringStateListener.set(this, void 0);
        __classPrivateFieldSet(this, _KeyringController_keyringBuilders, keyringBuilders
            ? defaultKeyringBuilders.concat(keyringBuilders)
            : defaultKeyringBuilders, "f");
        __classPrivateFieldSet(this, _KeyringController_encryptor, encryptor, "f");
        __classPrivateFieldSet(this, _KeyringController_keyrings, [], "f");
        __classPrivateFieldSet(this, _KeyringController_unsupportedKeyrings, [], "f");
        // This option allows the controller to cache an exported key
        // for use in decrypting and encrypting data without password
        __classPrivateFieldSet(this, _KeyringController_cacheEncryptionKey, Boolean(options.cacheEncryptionKey), "f");
        if (__classPrivateFieldGet(this, _KeyringController_cacheEncryptionKey, "f")) {
            assertIsExportableKeyEncryptor(encryptor);
        }
        __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_registerMessageHandlers).call(this);
    }
    /**
     * Adds a new account to the default (first) HD seed phrase keyring.
     *
     * @param accountCount - Number of accounts before adding a new one, used to
     * make the method idempotent.
     * @returns Promise resolving to keyring current state and added account
     * address.
     */
    addNewAccount(accountCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const primaryKeyring = this.getKeyringsByType('HD Key Tree')[0];
            if (!primaryKeyring) {
                throw new Error('No HD keyring found');
            }
            const oldAccounts = yield this.getAccounts();
            if (accountCount && oldAccounts.length !== accountCount) {
                if (accountCount > oldAccounts.length) {
                    throw new Error('Account out of sequence');
                }
                // we return the account already existing at index `accountCount`
                const primaryKeyringAccounts = yield primaryKeyring.getAccounts();
                return {
                    keyringState: __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_getMemState).call(this),
                    addedAccountAddress: primaryKeyringAccounts[accountCount],
                };
            }
            const addedAccountAddress = yield this.addNewAccountForKeyring(primaryKeyring);
            yield this.verifySeedPhrase();
            return {
                keyringState: __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_getMemState).call(this),
                addedAccountAddress,
            };
        });
    }
    /**
     * Adds a new account to the specified keyring.
     *
     * @param keyring - Keyring to add the account to.
     * @param accountCount - Number of accounts before adding a new one, used to make the method idempotent.
     * @returns Promise resolving to keyring current state and added account
     */
    addNewAccountForKeyring(keyring, accountCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldAccounts = yield this.getAccounts();
            if (accountCount && oldAccounts.length !== accountCount) {
                if (accountCount > oldAccounts.length) {
                    throw new Error('Account out of sequence');
                }
                const existingAccount = oldAccounts[accountCount];
                (0, utils_1.assertIsStrictHexString)(existingAccount);
                return existingAccount;
            }
            yield keyring.addAccounts(1);
            yield this.persistAllKeyrings();
            const addedAccountAddress = (yield this.getAccounts()).find((selectedAddress) => !oldAccounts.includes(selectedAddress));
            (0, utils_1.assertIsStrictHexString)(addedAccountAddress);
            return addedAccountAddress;
        });
    }
    /**
     * Adds a new account to the default (first) HD seed phrase keyring without updating identities in preferences.
     *
     * @returns Promise resolving to current state when the account is added.
     */
    addNewAccountWithoutUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            const primaryKeyring = this.getKeyringsByType('HD Key Tree')[0];
            if (!primaryKeyring) {
                throw new Error('No HD keyring found');
            }
            yield primaryKeyring.addAccounts(1);
            yield this.persistAllKeyrings();
            yield this.verifySeedPhrase();
            return __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_getMemState).call(this);
        });
    }
    /**
     * Effectively the same as creating a new keychain then populating it
     * using the given seed phrase.
     *
     * @param password - Password to unlock keychain.
     * @param seed - A BIP39-compliant seed phrase as Uint8Array,
     * either as a string or an array of UTF-8 bytes that represent the string.
     * @returns Promise resolving to the restored keychain object.
     */
    createNewVaultAndRestore(password, seed) {
        return __awaiter(this, void 0, void 0, function* () {
            const releaseLock = yield this.mutex.acquire();
            if (!password || !password.length) {
                throw new Error('Invalid password');
            }
            try {
                yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_createNewVaultWithKeyring).call(this, password, {
                    type: KeyringTypes.hd,
                    opts: {
                        mnemonic: seed,
                        numberOfAccounts: 1,
                    },
                });
                return __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_getMemState).call(this);
            }
            finally {
                releaseLock();
            }
        });
    }
    /**
     * Create a new primary keychain and wipe any previous keychains.
     *
     * @param password - Password to unlock the new vault.
     * @returns Newly-created keychain object.
     */
    createNewVaultAndKeychain(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const releaseLock = yield this.mutex.acquire();
            try {
                const accounts = yield this.getAccounts();
                if (!accounts.length) {
                    yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_createNewVaultWithKeyring).call(this, password, {
                        type: KeyringTypes.hd,
                    });
                }
                return __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_getMemState).call(this);
            }
            finally {
                releaseLock();
            }
        });
    }
    /**
     * Adds a new keyring of the given `type`.
     *
     * @param type - Keyring type name.
     * @param opts - Keyring options.
     * @throws If a builder for the given `type` does not exist.
     * @returns Promise resolving to the added keyring.
     */
    addNewKeyring(type, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type === KeyringTypes.qr) {
                return this.getOrAddQRKeyring();
            }
            const keyring = yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_newKeyring).call(this, type, opts);
            if (type === KeyringTypes.hd && (!(0, utils_1.isObject)(opts) || !opts.mnemonic)) {
                if (!keyring.generateRandomMnemonic) {
                    throw new Error(constants_1.KeyringControllerError.UnsupportedGenerateRandomMnemonic);
                }
                keyring.generateRandomMnemonic();
                yield keyring.addAccounts(1);
            }
            const accounts = yield keyring.getAccounts();
            yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_checkForDuplicate).call(this, type, accounts);
            __classPrivateFieldGet(this, _KeyringController_keyrings, "f").push(keyring);
            yield this.persistAllKeyrings();
            return keyring;
        });
    }
    /**
     * Method to verify a given password validity. Throws an
     * error if the password is invalid.
     *
     * @param password - Password of the keyring.
     */
    verifyPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.state.vault) {
                throw new Error(constants_1.KeyringControllerError.VaultError);
            }
            yield __classPrivateFieldGet(this, _KeyringController_encryptor, "f").decrypt(password, this.state.vault);
        });
    }
    /**
     * Returns the status of the vault.
     *
     * @returns Boolean returning true if the vault is unlocked.
     */
    isUnlocked() {
        return this.state.isUnlocked;
    }
    /**
     * Gets the seed phrase of the HD keyring.
     *
     * @param password - Password of the keyring.
     * @returns Promise resolving to the seed phrase.
     */
    exportSeedPhrase(password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyPassword(password);
            assertHasUint8ArrayMnemonic(__classPrivateFieldGet(this, _KeyringController_keyrings, "f")[0]);
            return __classPrivateFieldGet(this, _KeyringController_keyrings, "f")[0].mnemonic;
        });
    }
    /**
     * Gets the private key from the keyring controlling an address.
     *
     * @param password - Password of the keyring.
     * @param address - Address to export.
     * @returns Promise resolving to the private key for an address.
     */
    exportAccount(password, address) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyPassword(password);
            const keyring = (yield this.getKeyringForAccount(address));
            if (!keyring.exportAccount) {
                throw new Error(constants_1.KeyringControllerError.UnsupportedExportAccount);
            }
            return yield keyring.exportAccount((0, eth_sig_util_1.normalize)(address));
        });
    }
    /**
     * Returns the public addresses of all accounts for the current keyring.
     *
     * @returns A promise resolving to an array of addresses.
     */
    getAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const keyrings = __classPrivateFieldGet(this, _KeyringController_keyrings, "f");
            const keyringArrays = yield Promise.all(keyrings.map((keyring) => __awaiter(this, void 0, void 0, function* () { return keyring.getAccounts(); })));
            const addresses = keyringArrays.reduce((res, arr) => {
                return res.concat(arr);
            }, []);
            // Cast to `Hex[]` here is safe here because `addresses` has no nullish
            // values, and `normalize` returns `Hex` unless given a nullish value
            return addresses.map(eth_sig_util_1.normalize);
        });
    }
    /**
     * Get encryption public key.
     *
     * @param account - An account address.
     * @param opts - Additional encryption options.
     * @throws If the `account` does not exist or does not support the `getEncryptionPublicKey` method
     * @returns Promise resolving to encyption public key of the `account` if one exists.
     */
    getEncryptionPublicKey(account, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedAddress = (0, eth_sig_util_1.normalize)(account);
            const keyring = (yield this.getKeyringForAccount(account));
            if (!keyring.getEncryptionPublicKey) {
                throw new Error(constants_1.KeyringControllerError.UnsupportedGetEncryptionPublicKey);
            }
            return yield keyring.getEncryptionPublicKey(normalizedAddress, opts);
        });
    }
    /**
     * Attempts to decrypt the provided message parameters.
     *
     * @param messageParams - The decryption message parameters.
     * @param messageParams.from - The address of the account you want to use to decrypt the message.
     * @param messageParams.data - The encrypted data that you want to decrypt.
     * @returns The raw decryption result.
     */
    decryptMessage(messageParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = (0, eth_sig_util_1.normalize)(messageParams.from);
            const keyring = (yield this.getKeyringForAccount(address));
            if (!keyring.decryptMessage) {
                throw new Error(constants_1.KeyringControllerError.UnsupportedDecryptMessage);
            }
            return keyring.decryptMessage(address, messageParams.data);
        });
    }
    /**
     * Returns the currently initialized keyring that manages
     * the specified `address` if one exists.
     *
     * @deprecated Use of this method is discouraged as actions executed directly on
     * keyrings are not being reflected in the KeyringController state and not
     * persisted in the vault.
     * @param account - An account address.
     * @returns Promise resolving to keyring of the `account` if one exists.
     */
    getKeyringForAccount(account) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Cast to `Hex` here is safe here because `address` is not nullish.
            // `normalizeToHex` returns `Hex` unless given a nullish value.
            const hexed = (0, eth_sig_util_1.normalize)(account);
            const candidates = yield Promise.all(__classPrivateFieldGet(this, _KeyringController_keyrings, "f").map((keyring) => __awaiter(this, void 0, void 0, function* () {
                return Promise.all([keyring, keyring.getAccounts()]);
            })));
            const winners = candidates.filter((candidate) => {
                const accounts = candidate[1].map(eth_sig_util_1.normalize);
                return accounts.includes(hexed);
            });
            if (winners.length && ((_a = winners[0]) === null || _a === void 0 ? void 0 : _a.length)) {
                return winners[0][0];
            }
            // Adding more info to the error
            let errorInfo = '';
            if (!(0, utils_1.isValidHexAddress)(hexed)) {
                errorInfo = 'The address passed in is invalid/empty';
            }
            else if (!candidates.length) {
                errorInfo = 'There are no keyrings';
            }
            else if (!winners.length) {
                errorInfo = 'There are keyrings, but none match the address';
            }
            throw new Error(`${constants_1.KeyringControllerError.NoKeyring}. Error info: ${errorInfo}`);
        });
    }
    /**
     * Returns all keyrings of the given type.
     *
     * @deprecated Use of this method is discouraged as actions executed directly on
     * keyrings are not being reflected in the KeyringController state and not
     * persisted in the vault.
     * @param type - Keyring type name.
     * @returns An array of keyrings of the given type.
     */
    getKeyringsByType(type) {
        return __classPrivateFieldGet(this, _KeyringController_keyrings, "f").filter((keyring) => keyring.type === type);
    }
    /**
     * Persist all serialized keyrings in the vault.
     *
     * @returns Promise resolving with `true` value when the
     * operation completes.
     */
    persistAllKeyrings() {
        return __awaiter(this, void 0, void 0, function* () {
            const { encryptionKey, encryptionSalt } = this.state;
            if (!__classPrivateFieldGet(this, _KeyringController_password, "f") && !encryptionKey) {
                throw new Error(constants_1.KeyringControllerError.MissingCredentials);
            }
            const serializedKeyrings = yield Promise.all(__classPrivateFieldGet(this, _KeyringController_keyrings, "f").map((keyring) => __awaiter(this, void 0, void 0, function* () {
                const [type, data] = yield Promise.all([
                    keyring.type,
                    keyring.serialize(),
                ]);
                return { type, data };
            })));
            serializedKeyrings.push(...__classPrivateFieldGet(this, _KeyringController_unsupportedKeyrings, "f"));
            let vault;
            let newEncryptionKey;
            if (__classPrivateFieldGet(this, _KeyringController_cacheEncryptionKey, "f")) {
                assertIsExportableKeyEncryptor(__classPrivateFieldGet(this, _KeyringController_encryptor, "f"));
                if (encryptionKey) {
                    const key = yield __classPrivateFieldGet(this, _KeyringController_encryptor, "f").importKey(encryptionKey);
                    const vaultJSON = yield __classPrivateFieldGet(this, _KeyringController_encryptor, "f").encryptWithKey(key, serializedKeyrings);
                    vaultJSON.salt = encryptionSalt;
                    vault = JSON.stringify(vaultJSON);
                }
                else if (__classPrivateFieldGet(this, _KeyringController_password, "f")) {
                    const { vault: newVault, exportedKeyString } = yield __classPrivateFieldGet(this, _KeyringController_encryptor, "f").encryptWithDetail(__classPrivateFieldGet(this, _KeyringController_password, "f"), serializedKeyrings);
                    vault = newVault;
                    newEncryptionKey = exportedKeyString;
                }
            }
            else {
                if (typeof __classPrivateFieldGet(this, _KeyringController_password, "f") !== 'string') {
                    throw new TypeError(constants_1.KeyringControllerError.WrongPasswordType);
                }
                vault = yield __classPrivateFieldGet(this, _KeyringController_encryptor, "f").encrypt(__classPrivateFieldGet(this, _KeyringController_password, "f"), serializedKeyrings);
            }
            if (!vault) {
                throw new Error(constants_1.KeyringControllerError.MissingVaultData);
            }
            this.update((state) => {
                state.vault = vault;
            });
            // The keyring updates need to be announced before updating the encryptionKey
            // so that the updated keyring gets propagated to the extension first.
            // Not calling {@link updateKeyringsInState} results in the wrong account being selected
            // in the extension.
            yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_updateKeyringsInState).call(this);
            if (newEncryptionKey) {
                this.update((state) => {
                    state.encryptionKey = newEncryptionKey;
                    state.encryptionSalt = JSON.parse(vault).salt;
                });
            }
            return true;
        });
    }
    /**
     * Imports an account with the specified import strategy.
     *
     * @param strategy - Import strategy name.
     * @param args - Array of arguments to pass to the underlying stategy.
     * @throws Will throw when passed an unrecognized strategy.
     * @returns Promise resolving to keyring current state and imported account
     * address.
     */
    importAccountWithStrategy(strategy,
    // TODO: Replace `any` with type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args) {
        return __awaiter(this, void 0, void 0, function* () {
            let privateKey;
            switch (strategy) {
                case 'privateKey':
                    const [importedKey] = args;
                    if (!importedKey) {
                        throw new Error('Cannot import an empty key.');
                    }
                    const prefixed = (0, utils_1.add0x)(importedKey);
                    let bufferedPrivateKey;
                    try {
                        bufferedPrivateKey = (0, util_1.toBuffer)(prefixed);
                    }
                    catch (_a) {
                        throw new Error('Cannot import invalid private key.');
                    }
                    if (!(0, util_1.isValidPrivate)(bufferedPrivateKey) ||
                        // ensures that the key is 64 bytes long
                        (0, util_1.getBinarySize)(prefixed) !== 64 + '0x'.length) {
                        throw new Error('Cannot import invalid private key.');
                    }
                    privateKey = (0, utils_1.remove0x)(prefixed);
                    break;
                case 'json':
                    let wallet;
                    const [input, password] = args;
                    try {
                        wallet = ethereumjs_wallet_1.thirdparty.fromEtherWallet(input, password);
                    }
                    catch (e) {
                        wallet = wallet || (yield ethereumjs_wallet_1.default.fromV3(input, password, true));
                    }
                    privateKey = (0, utils_1.bytesToHex)(wallet.getPrivateKey());
                    break;
                default:
                    throw new Error(`Unexpected import strategy: '${strategy}'`);
            }
            const newKeyring = (yield this.addNewKeyring(KeyringTypes.simple, [
                privateKey,
            ]));
            const accounts = yield newKeyring.getAccounts();
            return {
                keyringState: __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_getMemState).call(this),
                importedAccountAddress: accounts[0],
            };
        });
    }
    /**
     * Removes an account from keyring state.
     *
     * @param address - Address of the account to remove.
     * @fires KeyringController:accountRemoved
     * @returns Promise resolving current state when this account removal completes.
     */
    removeAccount(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyring = (yield this.getKeyringForAccount(address));
            // Not all the keyrings support this, so we have to check
            if (!keyring.removeAccount) {
                throw new Error(constants_1.KeyringControllerError.UnsupportedRemoveAccount);
            }
            // The `removeAccount` method of snaps keyring is async. We have to update
            // the interface of the other keyrings to be async as well.
            // eslint-disable-next-line @typescript-eslint/await-thenable
            yield keyring.removeAccount(address);
            const accounts = yield keyring.getAccounts();
            // Check if this was the last/only account
            if (accounts.length === 0) {
                yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_removeEmptyKeyrings).call(this);
            }
            yield this.persistAllKeyrings();
            this.messagingSystem.publish(`${name}:accountRemoved`, address);
            return __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_getMemState).call(this);
        });
    }
    /**
     * Deallocates all secrets and locks the wallet.
     *
     * @returns Promise resolving to current state.
     */
    setLocked() {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_unsubscribeFromQRKeyringsEvents).call(this);
            __classPrivateFieldSet(this, _KeyringController_password, undefined, "f");
            this.update((state) => {
                state.isUnlocked = false;
                state.keyrings = [];
            });
            yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_clearKeyrings).call(this);
            this.messagingSystem.publish(`${name}:lock`);
            return __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_getMemState).call(this);
        });
    }
    /**
     * Signs message by calling down into a specific keyring.
     *
     * @param messageParams - PersonalMessageParams object to sign.
     * @returns Promise resolving to a signed message string.
     */
    signMessage(messageParams) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!messageParams.data) {
                throw new Error("Can't sign an empty message");
            }
            const address = (0, eth_sig_util_1.normalize)(messageParams.from);
            const keyring = (yield this.getKeyringForAccount(address));
            if (!keyring.signMessage) {
                throw new Error(constants_1.KeyringControllerError.UnsupportedSignMessage);
            }
            return yield keyring.signMessage(address, messageParams.data);
        });
    }
    /**
     * Signs personal message by calling down into a specific keyring.
     *
     * @param messageParams - PersonalMessageParams object to sign.
     * @returns Promise resolving to a signed message string.
     */
    signPersonalMessage(messageParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = (0, eth_sig_util_1.normalize)(messageParams.from);
            const keyring = (yield this.getKeyringForAccount(address));
            if (!keyring.signPersonalMessage) {
                throw new Error(constants_1.KeyringControllerError.UnsupportedSignPersonalMessage);
            }
            const normalizedData = (0, eth_sig_util_1.normalize)(messageParams.data);
            return yield keyring.signPersonalMessage(address, normalizedData);
        });
    }
    /**
     * Signs typed message by calling down into a specific keyring.
     *
     * @param messageParams - TypedMessageParams object to sign.
     * @param version - Compatibility version EIP712.
     * @throws Will throw when passed an unrecognized version.
     * @returns Promise resolving to a signed message string or an error if any.
     */
    signTypedMessage(messageParams, version) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (![
                    SignTypedDataVersion.V1,
                    SignTypedDataVersion.V3,
                    SignTypedDataVersion.V4,
                ].includes(version)) {
                    throw new Error(`Unexpected signTypedMessage version: '${version}'`);
                }
                // Cast to `Hex` here is safe here because `messageParams.from` is not nullish.
                // `normalize` returns `Hex` unless given a nullish value.
                const address = (0, eth_sig_util_1.normalize)(messageParams.from);
                const keyring = (yield this.getKeyringForAccount(address));
                if (!keyring.signTypedData) {
                    throw new Error(constants_1.KeyringControllerError.UnsupportedSignTypedMessage);
                }
                return yield keyring.signTypedData(address, version !== SignTypedDataVersion.V1 &&
                    typeof messageParams.data === 'string'
                    ? JSON.parse(messageParams.data)
                    : messageParams.data, { version });
            }
            catch (error) {
                throw new Error(`Keyring Controller signTypedMessage: ${error}`);
            }
        });
    }
    /**
     * Signs a transaction by calling down into a specific keyring.
     *
     * @param transaction - Transaction object to sign. Must be a `ethereumjs-tx` transaction instance.
     * @param from - Address to sign from, should be in keychain.
     * @param opts - An optional options object.
     * @returns Promise resolving to a signed transaction string.
     */
    signTransaction(transaction, from, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = (0, eth_sig_util_1.normalize)(from);
            const keyring = (yield this.getKeyringForAccount(address));
            if (!keyring.signTransaction) {
                throw new Error(constants_1.KeyringControllerError.UnsupportedSignTransaction);
            }
            return yield keyring.signTransaction(address, transaction, opts);
        });
    }
    /**
     * Convert a base transaction to a base UserOperation.
     *
     * @param from - Address of the sender.
     * @param transactions - Base transactions to include in the UserOperation.
     * @returns A pseudo-UserOperation that can be used to construct a real.
     */
    prepareUserOperation(from, transactions) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = (0, eth_sig_util_1.normalize)(from);
            const keyring = (yield this.getKeyringForAccount(address));
            if (!keyring.prepareUserOperation) {
                throw new Error(constants_1.KeyringControllerError.UnsupportedPrepareUserOperation);
            }
            return yield keyring.prepareUserOperation(address, transactions);
        });
    }
    /**
     * Patches properties of a UserOperation. Currently, only the
     * `paymasterAndData` can be patched.
     *
     * @param from - Address of the sender.
     * @param userOp - UserOperation to patch.
     * @returns A patch to apply to the UserOperation.
     */
    patchUserOperation(from, userOp) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = (0, eth_sig_util_1.normalize)(from);
            const keyring = (yield this.getKeyringForAccount(address));
            if (!keyring.patchUserOperation) {
                throw new Error(constants_1.KeyringControllerError.UnsupportedPatchUserOperation);
            }
            return yield keyring.patchUserOperation(address, userOp);
        });
    }
    /**
     * Signs an UserOperation.
     *
     * @param from - Address of the sender.
     * @param userOp - UserOperation to sign.
     * @returns The signature of the UserOperation.
     */
    signUserOperation(from, userOp) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = (0, eth_sig_util_1.normalize)(from);
            const keyring = (yield this.getKeyringForAccount(address));
            if (!keyring.signUserOperation) {
                throw new Error(constants_1.KeyringControllerError.UnsupportedSignUserOperation);
            }
            return yield keyring.signUserOperation(address, userOp);
        });
    }
    /**
     * Attempts to decrypt the current vault and load its keyrings,
     * using the given encryption key and salt.
     *
     * @param encryptionKey - Key to unlock the keychain.
     * @param encryptionSalt - Salt to unlock the keychain.
     * @returns Promise resolving to the current state.
     */
    submitEncryptionKey(encryptionKey, encryptionSalt) {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldSet(this, _KeyringController_keyrings, yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_unlockKeyrings).call(this, undefined, encryptionKey, encryptionSalt), "f");
            __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_setUnlocked).call(this);
            const qrKeyring = this.getQRKeyring();
            if (qrKeyring) {
                // if there is a QR keyring, we need to subscribe
                // to its events after unlocking the vault
                __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_subscribeToQRKeyringEvents).call(this, qrKeyring);
            }
            return __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_getMemState).call(this);
        });
    }
    /**
     * Attempts to decrypt the current vault and load its keyrings,
     * using the given password.
     *
     * @param password - Password to unlock the keychain.
     * @returns Promise resolving to the current state.
     */
    submitPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldSet(this, _KeyringController_keyrings, yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_unlockKeyrings).call(this, password), "f");
            __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_setUnlocked).call(this);
            const qrKeyring = this.getQRKeyring();
            if (qrKeyring) {
                // if there is a QR keyring, we need to subscribe
                // to its events after unlocking the vault
                __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_subscribeToQRKeyringEvents).call(this, qrKeyring);
            }
            return __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_getMemState).call(this);
        });
    }
    /**
     * Verifies the that the seed phrase restores the current keychain's accounts.
     *
     * @returns Promise resolving to the seed phrase as Uint8Array.
     */
    verifySeedPhrase() {
        return __awaiter(this, void 0, void 0, function* () {
            const primaryKeyring = this.getKeyringsByType(KeyringTypes.hd)[0];
            if (!primaryKeyring) {
                throw new Error('No HD keyring found.');
            }
            assertHasUint8ArrayMnemonic(primaryKeyring);
            const seedWords = primaryKeyring.mnemonic;
            const accounts = yield primaryKeyring.getAccounts();
            /* istanbul ignore if */
            if (accounts.length === 0) {
                throw new Error('Cannot verify an empty keyring.');
            }
            // The HD Keyring Builder is a default keyring builder
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const hdKeyringBuilder = __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_getKeyringBuilderForType).call(this, KeyringTypes.hd);
            const hdKeyring = hdKeyringBuilder();
            // @ts-expect-error @metamask/eth-hd-keyring correctly handles
            // Uint8Array seed phrases in the `deserialize` method.
            yield hdKeyring.deserialize({
                mnemonic: seedWords,
                numberOfAccounts: accounts.length,
            });
            const testAccounts = yield hdKeyring.getAccounts();
            /* istanbul ignore if */
            if (testAccounts.length !== accounts.length) {
                throw new Error('Seed phrase imported incorrect number of accounts.');
            }
            testAccounts.forEach((account, i) => {
                /* istanbul ignore if */
                if (account.toLowerCase() !== accounts[i].toLowerCase()) {
                    throw new Error('Seed phrase imported different accounts.');
                }
            });
            return seedWords;
        });
    }
    // QR Hardware related methods
    /**
     * Get QR Hardware keyring.
     *
     * @returns The QR Keyring if defined, otherwise undefined
     */
    getQRKeyring() {
        // QRKeyring is not yet compatible with Keyring type from @metamask/utils
        return this.getKeyringsByType(KeyringTypes.qr)[0];
    }
    /**
     * Get QR hardware keyring. If it doesn't exist, add it.
     *
     * @returns The added keyring
     */
    getOrAddQRKeyring() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getQRKeyring() || (yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_addQRKeyring).call(this));
        });
    }
    // TODO: Replace `any` with type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    restoreQRKeyring(serialized) {
        return __awaiter(this, void 0, void 0, function* () {
            (yield this.getOrAddQRKeyring()).deserialize(serialized);
            yield this.persistAllKeyrings();
        });
    }
    resetQRKeyringState() {
        return __awaiter(this, void 0, void 0, function* () {
            (yield this.getOrAddQRKeyring()).resetStore();
        });
    }
    getQRKeyringState() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getOrAddQRKeyring()).getMemStore();
        });
    }
    submitQRCryptoHDKey(cryptoHDKey) {
        return __awaiter(this, void 0, void 0, function* () {
            (yield this.getOrAddQRKeyring()).submitCryptoHDKey(cryptoHDKey);
        });
    }
    submitQRCryptoAccount(cryptoAccount) {
        return __awaiter(this, void 0, void 0, function* () {
            (yield this.getOrAddQRKeyring()).submitCryptoAccount(cryptoAccount);
        });
    }
    submitQRSignature(requestId, ethSignature) {
        return __awaiter(this, void 0, void 0, function* () {
            (yield this.getOrAddQRKeyring()).submitSignature(requestId, ethSignature);
        });
    }
    cancelQRSignRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            (yield this.getOrAddQRKeyring()).cancelSignRequest();
        });
    }
    /**
     * Cancels qr keyring sync.
     */
    cancelQRSynchronization() {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line n/no-sync
            (yield this.getOrAddQRKeyring()).cancelSync();
        });
    }
    connectQRHardware(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keyring = yield this.getOrAddQRKeyring();
                let accounts;
                switch (page) {
                    case -1:
                        accounts = yield keyring.getPreviousPage();
                        break;
                    case 1:
                        accounts = yield keyring.getNextPage();
                        break;
                    default:
                        accounts = yield keyring.getFirstPage();
                }
                // TODO: Replace `any` with type
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return accounts.map((account) => {
                    return Object.assign(Object.assign({}, account), { balance: '0x0' });
                });
            }
            catch (e) {
                // TODO: Add test case for when keyring throws
                /* istanbul ignore next */
                throw new Error(`Unspecified error when connect QR Hardware, ${e}`);
            }
        });
    }
    unlockQRHardwareWalletAccount(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyring = yield this.getOrAddQRKeyring();
            keyring.setAccountToUnlock(index);
            // QRKeyring is not yet compatible with Keyring from
            // @metamask/utils, but we can use the `addNewAccount` method
            // as it internally calls `addAccounts` from on the keyring instance,
            // which is supported by QRKeyring API.
            yield this.addNewAccountForKeyring(keyring);
            yield this.persistAllKeyrings();
        });
    }
    getAccountKeyringType(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyring = (yield this.getKeyringForAccount(account));
            return keyring.type;
        });
    }
    forgetQRDevice() {
        return __awaiter(this, void 0, void 0, function* () {
            const keyring = yield this.getOrAddQRKeyring();
            const allAccounts = (yield this.getAccounts());
            keyring.forgetDevice();
            const remainingAccounts = (yield this.getAccounts());
            const removedAccounts = allAccounts.filter((address) => !remainingAccounts.includes(address));
            yield this.persistAllKeyrings();
            return { removedAccounts, remainingAccounts };
        });
    }
}
exports.KeyringController = KeyringController;
_KeyringController_keyringBuilders = new WeakMap(), _KeyringController_keyrings = new WeakMap(), _KeyringController_unsupportedKeyrings = new WeakMap(), _KeyringController_password = new WeakMap(), _KeyringController_encryptor = new WeakMap(), _KeyringController_cacheEncryptionKey = new WeakMap(), _KeyringController_qrKeyringStateListener = new WeakMap(), _KeyringController_instances = new WeakSet(), _KeyringController_registerMessageHandlers = function _KeyringController_registerMessageHandlers() {
    this.messagingSystem.registerActionHandler(`${name}:signMessage`, this.signMessage.bind(this));
    this.messagingSystem.registerActionHandler(`${name}:signPersonalMessage`, this.signPersonalMessage.bind(this));
    this.messagingSystem.registerActionHandler(`${name}:signTypedMessage`, this.signTypedMessage.bind(this));
    this.messagingSystem.registerActionHandler(`${name}:decryptMessage`, this.decryptMessage.bind(this));
    this.messagingSystem.registerActionHandler(`${name}:getEncryptionPublicKey`, this.getEncryptionPublicKey.bind(this));
    this.messagingSystem.registerActionHandler(`${name}:getAccounts`, this.getAccounts.bind(this));
    this.messagingSystem.registerActionHandler(`${name}:getKeyringsByType`, this.getKeyringsByType.bind(this));
    this.messagingSystem.registerActionHandler(`${name}:getKeyringForAccount`, this.getKeyringForAccount.bind(this));
    this.messagingSystem.registerActionHandler(`${name}:persistAllKeyrings`, this.persistAllKeyrings.bind(this));
    this.messagingSystem.registerActionHandler(`${name}:prepareUserOperation`, this.prepareUserOperation.bind(this));
    this.messagingSystem.registerActionHandler(`${name}:patchUserOperation`, this.patchUserOperation.bind(this));
    this.messagingSystem.registerActionHandler(`${name}:signUserOperation`, this.signUserOperation.bind(this));
}, _KeyringController_getKeyringBuilderForType = function _KeyringController_getKeyringBuilderForType(type) {
    return __classPrivateFieldGet(this, _KeyringController_keyringBuilders, "f").find((keyringBuilder) => keyringBuilder.type === type);
}, _KeyringController_addQRKeyring = function _KeyringController_addQRKeyring() {
    return __awaiter(this, void 0, void 0, function* () {
        // QRKeyring is not yet compatible with Keyring type from @metamask/utils
        /**
         *  Patch for @metamask/keyring-controller v13.0.0
         *  Below code change will fix the issue 23804, The intial code added a empty accounts as argument when creating a new QR keyring.
         *  cause the new Keystone MetamaskKeyring default properties all are undefined during deserialise() process.
         *  Please refer to PR 23903 for detail.
         */
        const qrKeyring = (yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_newKeyring).call(this, KeyringTypes.qr));
        const accounts = yield qrKeyring.getAccounts();
        yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_checkForDuplicate).call(this, KeyringTypes.qr, accounts);
        __classPrivateFieldGet(this, _KeyringController_keyrings, "f").push(qrKeyring);
        yield this.persistAllKeyrings();
        __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_subscribeToQRKeyringEvents).call(this, qrKeyring);
        return qrKeyring;
    });
}, _KeyringController_subscribeToQRKeyringEvents = function _KeyringController_subscribeToQRKeyringEvents(qrKeyring) {
    __classPrivateFieldSet(this, _KeyringController_qrKeyringStateListener, (state) => {
        this.messagingSystem.publish(`${name}:qrKeyringStateChange`, state);
    }, "f");
    qrKeyring.getMemStore().subscribe(__classPrivateFieldGet(this, _KeyringController_qrKeyringStateListener, "f"));
}, _KeyringController_unsubscribeFromQRKeyringsEvents = function _KeyringController_unsubscribeFromQRKeyringsEvents() {
    const qrKeyrings = this.getKeyringsByType(KeyringTypes.qr);
    qrKeyrings.forEach((qrKeyring) => {
        if (__classPrivateFieldGet(this, _KeyringController_qrKeyringStateListener, "f")) {
            qrKeyring.getMemStore().unsubscribe(__classPrivateFieldGet(this, _KeyringController_qrKeyringStateListener, "f"));
        }
    });
}, _KeyringController_createNewVaultWithKeyring = function _KeyringController_createNewVaultWithKeyring(password, keyring) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof password !== 'string') {
            throw new TypeError(constants_1.KeyringControllerError.WrongPasswordType);
        }
        __classPrivateFieldSet(this, _KeyringController_password, password, "f");
        yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_clearKeyrings).call(this);
        yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_createKeyringWithFirstAccount).call(this, keyring.type, keyring.opts);
        __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_setUnlocked).call(this);
        return __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_getMemState).call(this);
    });
}, _KeyringController_updateKeyringsInState = function _KeyringController_updateKeyringsInState() {
    return __awaiter(this, void 0, void 0, function* () {
        const keyrings = yield Promise.all(__classPrivateFieldGet(this, _KeyringController_keyrings, "f").map(displayForKeyring));
        this.update((state) => {
            state.keyrings = keyrings;
        });
    });
}, _KeyringController_unlockKeyrings = function _KeyringController_unlockKeyrings(password, encryptionKey, encryptionSalt) {
    return __awaiter(this, void 0, void 0, function* () {
        const encryptedVault = this.state.vault;
        if (!encryptedVault) {
            throw new Error(constants_1.KeyringControllerError.VaultError);
        }
        yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_clearKeyrings).call(this);
        let vault;
        if (__classPrivateFieldGet(this, _KeyringController_cacheEncryptionKey, "f")) {
            assertIsExportableKeyEncryptor(__classPrivateFieldGet(this, _KeyringController_encryptor, "f"));
            if (password) {
                const result = yield __classPrivateFieldGet(this, _KeyringController_encryptor, "f").decryptWithDetail(password, encryptedVault);
                vault = result.vault;
                __classPrivateFieldSet(this, _KeyringController_password, password, "f");
                this.update((state) => {
                    state.encryptionKey = result.exportedKeyString;
                    state.encryptionSalt = result.salt;
                });
            }
            else {
                const parsedEncryptedVault = JSON.parse(encryptedVault);
                if (encryptionSalt !== parsedEncryptedVault.salt) {
                    throw new Error(constants_1.KeyringControllerError.ExpiredCredentials);
                }
                if (typeof encryptionKey !== 'string') {
                    throw new TypeError(constants_1.KeyringControllerError.WrongPasswordType);
                }
                const key = yield __classPrivateFieldGet(this, _KeyringController_encryptor, "f").importKey(encryptionKey);
                vault = yield __classPrivateFieldGet(this, _KeyringController_encryptor, "f").decryptWithKey(key, parsedEncryptedVault);
                // This call is required on the first call because encryptionKey
                // is not yet inside the memStore
                this.update((state) => {
                    state.encryptionKey = encryptionKey;
                    // we can safely assume that encryptionSalt is defined here
                    // because we compare it with the salt from the vault
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    state.encryptionSalt = encryptionSalt;
                });
            }
        }
        else {
            if (typeof password !== 'string') {
                throw new TypeError(constants_1.KeyringControllerError.WrongPasswordType);
            }
            vault = yield __classPrivateFieldGet(this, _KeyringController_encryptor, "f").decrypt(password, encryptedVault);
            __classPrivateFieldSet(this, _KeyringController_password, password, "f");
        }
        if (!isSerializedKeyringsArray(vault)) {
            throw new Error(constants_1.KeyringControllerError.VaultDataError);
        }
        yield Promise.all(vault.map(__classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_restoreKeyring).bind(this)));
        yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_updateKeyringsInState).call(this);
        if (__classPrivateFieldGet(this, _KeyringController_password, "f") &&
            (!__classPrivateFieldGet(this, _KeyringController_cacheEncryptionKey, "f") || !encryptionKey) &&
            __classPrivateFieldGet(this, _KeyringController_encryptor, "f").isVaultUpdated &&
            !__classPrivateFieldGet(this, _KeyringController_encryptor, "f").isVaultUpdated(encryptedVault)) {
            // Re-encrypt the vault with safer method if one is available
            yield this.persistAllKeyrings();
        }
        return __classPrivateFieldGet(this, _KeyringController_keyrings, "f");
    });
}, _KeyringController_createKeyringWithFirstAccount = function _KeyringController_createKeyringWithFirstAccount(type, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const keyring = (yield this.addNewKeyring(type, opts));
        const [firstAccount] = yield keyring.getAccounts();
        if (!firstAccount) {
            throw new Error(constants_1.KeyringControllerError.NoFirstAccount);
        }
    });
}, _KeyringController_newKeyring = function _KeyringController_newKeyring(type, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const keyringBuilder = __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_getKeyringBuilderForType).call(this, type);
        if (!keyringBuilder) {
            throw new Error(`${constants_1.KeyringControllerError.NoKeyringBuilder}. Keyring type: ${type}`);
        }
        const keyring = keyringBuilder();
        // @ts-expect-error Enforce data type after updating clients
        yield keyring.deserialize(data);
        if (keyring.init) {
            yield keyring.init();
        }
        return keyring;
    });
}, _KeyringController_clearKeyrings = function _KeyringController_clearKeyrings() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const keyring of __classPrivateFieldGet(this, _KeyringController_keyrings, "f")) {
            yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_destroyKeyring).call(this, keyring);
        }
        __classPrivateFieldSet(this, _KeyringController_keyrings, [], "f");
        this.update((state) => {
            state.keyrings = [];
        });
    });
}, _KeyringController_restoreKeyring = function _KeyringController_restoreKeyring(serialized) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { type, data } = serialized;
            const keyring = yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_newKeyring).call(this, type, data);
            // getAccounts also validates the accounts for some keyrings
            yield keyring.getAccounts();
            __classPrivateFieldGet(this, _KeyringController_keyrings, "f").push(keyring);
            return keyring;
        }
        catch (_) {
            __classPrivateFieldGet(this, _KeyringController_unsupportedKeyrings, "f").push(serialized);
            return undefined;
        }
    });
}, _KeyringController_destroyKeyring = function _KeyringController_destroyKeyring(keyring) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        yield ((_a = keyring.destroy) === null || _a === void 0 ? void 0 : _a.call(keyring));
    });
}, _KeyringController_removeEmptyKeyrings = function _KeyringController_removeEmptyKeyrings() {
    return __awaiter(this, void 0, void 0, function* () {
        const validKeyrings = [];
        // Since getAccounts returns a Promise
        // We need to wait to hear back form each keyring
        // in order to decide which ones are now valid (accounts.length > 0)
        yield Promise.all(__classPrivateFieldGet(this, _KeyringController_keyrings, "f").map((keyring) => __awaiter(this, void 0, void 0, function* () {
            const accounts = yield keyring.getAccounts();
            if (accounts.length > 0) {
                validKeyrings.push(keyring);
            }
            else {
                yield __classPrivateFieldGet(this, _KeyringController_instances, "m", _KeyringController_destroyKeyring).call(this, keyring);
            }
        })));
        __classPrivateFieldSet(this, _KeyringController_keyrings, validKeyrings, "f");
    });
}, _KeyringController_checkForDuplicate = function _KeyringController_checkForDuplicate(type, newAccountArray) {
    return __awaiter(this, void 0, void 0, function* () {
        const accounts = yield this.getAccounts();
        switch (type) {
            case KeyringTypes.simple: {
                const isIncluded = Boolean(accounts.find((key) => newAccountArray[0] &&
                    (key === newAccountArray[0] ||
                        key === (0, utils_1.remove0x)(newAccountArray[0]))));
                if (isIncluded) {
                    throw new Error(constants_1.KeyringControllerError.DuplicatedAccount);
                }
                return newAccountArray;
            }
            case KeyringTypes.remote: {
                const isIncluded = Boolean(accounts.find((key) => newAccountArray[0] &&
                    (key === newAccountArray[0] ||
                        key === (0, utils_1.remove0x)(newAccountArray[0]))));
                if (isIncluded) {
                    throw new Error(constants_1.KeyringControllerError.DuplicatedAccount);
                }
                return newAccountArray;
            }
            default: {
                return newAccountArray;
            }
        }
    });
}, _KeyringController_setUnlocked = function _KeyringController_setUnlocked() {
    this.update((state) => {
        state.isUnlocked = true;
    });
    this.messagingSystem.publish(`${name}:unlock`);
}, _KeyringController_getMemState = function _KeyringController_getMemState() {
    return {
        isUnlocked: this.state.isUnlocked,
        keyrings: this.state.keyrings,
    };
};
exports.default = KeyringController;
//# sourceMappingURL=KeyringController.js.map