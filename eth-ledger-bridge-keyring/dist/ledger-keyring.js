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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _LedgerKeyring_instances, _LedgerKeyring_migrateAccountDetails, _LedgerKeyring_signTransaction, _LedgerKeyring_getPage, _LedgerKeyring_getAccountsBIP44, _LedgerKeyring_getAccountsLegacy, _LedgerKeyring_addressFromIndex, _LedgerKeyring_pathFromAddress, _LedgerKeyring_getPathForIndex, _LedgerKeyring_isLedgerLiveHdPath, _LedgerKeyring_toLedgerPath, _LedgerKeyring_hasPreviousTransactions, _LedgerKeyring_getApiUrl;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerKeyring = void 0;
const rlp_1 = require("@ethereumjs/rlp");
const tx_1 = require("@ethereumjs/tx");
const ethUtil = __importStar(require("@ethereumjs/util"));
const eth_sig_util_1 = require("@metamask/eth-sig-util");
// eslint-disable-next-line import/no-nodejs-modules
const buffer_1 = require("buffer");
// eslint-disable-next-line import/no-nodejs-modules
const events_1 = require("events");
const hdkey_1 = __importDefault(require("hdkey"));
const pathBase = 'm';
const hdPathString = `${pathBase}/44'/60'/0'`;
const keyringType = 'Ledger Hardware';
const BRIDGE_URL = 'https://metamask.github.io/eth-ledger-bridge-keyring';
const MAX_INDEX = 1000;
var NetworkApiUrls;
(function (NetworkApiUrls) {
    NetworkApiUrls["Ropsten"] = "http://api-ropsten.etherscan.io";
    NetworkApiUrls["Kovan"] = "http://api-kovan.etherscan.io";
    NetworkApiUrls["Rinkeby"] = "https://api-rinkeby.etherscan.io";
    NetworkApiUrls["Mainnet"] = "https://api.etherscan.io";
})(NetworkApiUrls || (NetworkApiUrls = {}));
/**
 * Check if the given transaction is made with ethereumjs-tx or @ethereumjs/tx
 *
 * Transactions built with older versions of ethereumjs-tx have a
 * getChainId method that newer versions do not.
 * Older versions are mutable
 * while newer versions default to being immutable.
 * Expected shape and type
 * of data for v, r and s differ (Buffer (old) vs BN (new)).
 *
 * @param tx - Transaction to check, instance of either ethereumjs-tx or @ethereumjs/tx.
 * @returns Returns `true` if tx is an old-style ethereumjs-tx transaction.
 */
function isOldStyleEthereumjsTx(tx) {
    return 'getChainId' in tx && typeof tx.getChainId === 'function';
}
class LedgerKeyring extends events_1.EventEmitter {
    constructor({ bridge }) {
        super();
        _LedgerKeyring_instances.add(this);
        this.type = keyringType;
        this.page = 0;
        this.perPage = 5;
        this.unlockedAccount = 0;
        this.accounts = [];
        this.accountDetails = {};
        this.hdk = new hdkey_1.default();
        this.hdPath = hdPathString;
        this.paths = {};
        this.network = NetworkApiUrls.Mainnet;
        this.implementFullBIP44 = false;
        this.bridgeUrl = BRIDGE_URL;
        if (!bridge) {
            throw new Error('Bridge is a required dependency for the keyring');
        }
        this.bridge = bridge;
    }
    async init() {
        return this.bridge.init(this.bridgeUrl);
    }
    async destroy() {
        return this.bridge.destroy();
    }
    async serialize() {
        return {
            hdPath: this.hdPath,
            accounts: this.accounts,
            accountDetails: this.accountDetails,
            bridgeUrl: this.bridgeUrl,
            implementFullBIP44: false,
        };
    }
    async deserialize(opts = {}) {
        var _a, _b, _c, _d, _e;
        this.hdPath = (_a = opts.hdPath) !== null && _a !== void 0 ? _a : hdPathString;
        this.bridgeUrl = (_b = opts.bridgeUrl) !== null && _b !== void 0 ? _b : BRIDGE_URL;
        this.accounts = (_c = opts.accounts) !== null && _c !== void 0 ? _c : [];
        this.accountDetails = (_d = opts.accountDetails) !== null && _d !== void 0 ? _d : {};
        if (!opts.accountDetails) {
            __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_migrateAccountDetails).call(this, opts);
        }
        this.implementFullBIP44 = (_e = opts.implementFullBIP44) !== null && _e !== void 0 ? _e : false;
        // Remove accounts that don't have corresponding account details
        this.accounts = this.accounts.filter((account) => Object.keys(this.accountDetails).includes(ethUtil.toChecksumAddress(account)));
        return Promise.resolve();
    }
    isUnlocked() {
        var _a;
        return Boolean((_a = this.hdk) === null || _a === void 0 ? void 0 : _a.publicKey);
    }
    isConnected() {
        return this.bridge.isDeviceConnected;
    }
    setAccountToUnlock(index) {
        this.unlockedAccount =
            typeof index === 'number' ? index : parseInt(index, 10);
    }
    setHdPath(hdPath) {
        // Reset HDKey if the path changes
        if (this.hdPath !== hdPath) {
            this.hdk = new hdkey_1.default();
        }
        this.hdPath = hdPath;
    }
    async unlock(hdPath, updateHdk = true) {
        if (this.isUnlocked() && !hdPath) {
            return 'already unlocked';
        }
        const path = hdPath ? __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_toLedgerPath).call(this, hdPath) : this.hdPath;
        let payload;
        try {
            payload = await this.bridge.getPublicKey({
                hdPath: path,
            });
        }
        catch (error) {
            throw error instanceof Error ? error : new Error('Unknown error');
        }
        if (updateHdk && payload.chainCode) {
            this.hdk.publicKey = buffer_1.Buffer.from(payload.publicKey, 'hex');
            this.hdk.chainCode = buffer_1.Buffer.from(payload.chainCode, 'hex');
        }
        return payload.address;
    }
    async addAccounts(amount = 1) {
        return new Promise((resolve, reject) => {
            this.unlock()
                .then(async (_) => {
                const from = this.unlockedAccount;
                const to = from + amount;
                for (let i = from; i < to; i++) {
                    const path = __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_getPathForIndex).call(this, i);
                    let address;
                    if (__classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_isLedgerLiveHdPath).call(this)) {
                        address = await this.unlock(path);
                    }
                    else {
                        address = __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_addressFromIndex).call(this, pathBase, i);
                    }
                    this.accountDetails[ethUtil.toChecksumAddress(address)] = {
                        // TODO: consider renaming this property, as the current name is misleading
                        // It's currently used to represent whether an account uses the Ledger Live path.
                        bip44: __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_isLedgerLiveHdPath).call(this),
                        hdPath: path,
                    };
                    if (!this.accounts.includes(address)) {
                        this.accounts = [...this.accounts, address];
                    }
                    this.page = 0;
                }
                resolve(this.accounts.slice());
            })
                .catch(reject);
        });
    }
    async getFirstPage() {
        this.page = 0;
        return __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_getPage).call(this, 1);
    }
    async getNextPage() {
        return __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_getPage).call(this, 1);
    }
    async getPreviousPage() {
        return __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_getPage).call(this, -1);
    }
    async getAccounts() {
        return Promise.resolve(this.accounts.slice());
    }
    removeAccount(address) {
        if (!this.accounts.map((a) => a.toLowerCase()).includes(address.toLowerCase())) {
            throw new Error(`Address ${address} not found in this keyring`);
        }
        this.accounts = this.accounts.filter((a) => a.toLowerCase() !== address.toLowerCase());
        delete this.accountDetails[ethUtil.toChecksumAddress(address)];
    }
    async attemptMakeApp() {
        return this.bridge.attemptMakeApp();
    }
    async updateTransportMethod(transportType) {
        return this.bridge.updateTransportMethod(transportType);
    }
    // tx is an instance of the ethereumjs-transaction class.
    async signTransaction(address, tx) {
        let rawTxHex;
        // transactions built with older versions of ethereumjs-tx have a
        // getChainId method that newer versions do not. Older versions are mutable
        // while newer versions default to being immutable. Expected shape and type
        // of data for v, r and s differ (Buffer (old) vs BN (new))
        if (isOldStyleEthereumjsTx(tx)) {
            // In this version of ethereumjs-tx we must add the chainId in hex format
            // to the initial v value. The chainId must be included in the serialized
            // transaction which is only communicated to ethereumjs-tx in this
            // value. In newer versions the chainId is communicated via the 'Common'
            // object.
            // @ts-expect-error tx.v should be a Buffer but we are assigning a string
            tx.v = ethUtil.bufferToHex(tx.getChainId());
            // @ts-expect-error tx.r should be a Buffer but we are assigning a string
            tx.r = '0x00';
            // @ts-expect-error tx.s should be a Buffer but we are assigning a string
            tx.s = '0x00';
            rawTxHex = tx.serialize().toString('hex');
            return __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_signTransaction).call(this, address, rawTxHex, (payload) => {
                tx.v = buffer_1.Buffer.from(payload.v, 'hex');
                tx.r = buffer_1.Buffer.from(payload.r, 'hex');
                tx.s = buffer_1.Buffer.from(payload.s, 'hex');
                return tx;
            });
        }
        // The below `encode` call is only necessary for legacy transactions, as `getMessageToSign`
        // calls `rlp.encode` internally for non-legacy transactions. As per the "Transaction Execution"
        // section of the ethereum yellow paper, transactions need to be "well-formed RLP, with no additional
        // trailing bytes".
        // Note also that `getMessageToSign` will return valid RLP for all transaction types, whereas the
        // `serialize` method will not for any transaction type except legacy. This is because `serialize` includes
        // empty r, s and v values in the encoded rlp. This is why we use `getMessageToSign` here instead of `serialize`.
        const messageToSign = tx.getMessageToSign(false);
        rawTxHex = buffer_1.Buffer.isBuffer(messageToSign)
            ? messageToSign.toString('hex')
            : buffer_1.Buffer.from(rlp_1.RLP.encode(messageToSign)).toString('hex');
        return __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_signTransaction).call(this, address, rawTxHex, (payload) => {
            // Because tx will be immutable, first get a plain javascript object that
            // represents the transaction. Using txData here as it aligns with the
            // nomenclature of ethereumjs/tx.
            const txData = tx.toJSON();
            // The fromTxData utility expects a type to support transactions with a type other than 0
            txData.type = tx.type;
            // The fromTxData utility expects v,r and s to be hex prefixed
            txData.v = ethUtil.addHexPrefix(payload.v);
            txData.r = ethUtil.addHexPrefix(payload.r);
            txData.s = ethUtil.addHexPrefix(payload.s);
            // Adopt the 'common' option from the original transaction and set the
            // returned object to be frozen if the original is frozen.
            return tx_1.TransactionFactory.fromTxData(txData, {
                common: tx.common,
                freeze: Object.isFrozen(tx),
            });
        });
    }
    async signMessage(withAccount, data) {
        return this.signPersonalMessage(withAccount, data);
    }
    // For personal_sign, we need to prefix the message:
    async signPersonalMessage(withAccount, message) {
        const hdPath = await this.unlockAccountByAddress(withAccount);
        if (!hdPath) {
            throw new Error('Ledger: Unknown error while signing message');
        }
        let payload;
        try {
            payload = await this.bridge.deviceSignMessage({
                hdPath,
                message: ethUtil.stripHexPrefix(message),
            });
        }
        catch (error) {
            throw error instanceof Error
                ? error
                : new Error('Ledger: Unknown error while signing message');
        }
        let recoveryId = parseInt(String(payload.v), 10).toString(16);
        if (recoveryId.length < 2) {
            recoveryId = `0${recoveryId}`;
        }
        const signature = `0x${payload.r}${payload.s}${recoveryId}`;
        const addressSignedWith = (0, eth_sig_util_1.recoverPersonalSignature)({
            data: message,
            signature,
        });
        if (ethUtil.toChecksumAddress(addressSignedWith) !==
            ethUtil.toChecksumAddress(withAccount)) {
            throw new Error('Ledger: The signature doesnt match the right address');
        }
        return signature;
    }
    async unlockAccountByAddress(address) {
        const checksummedAddress = ethUtil.toChecksumAddress(address);
        const accountDetails = this.accountDetails[checksummedAddress];
        if (!accountDetails) {
            throw new Error(`Ledger: Account for address '${checksummedAddress}' not found`);
        }
        const { hdPath } = accountDetails;
        const unlockedAddress = await this.unlock(hdPath, false);
        // unlock resolves to the address for the given hdPath as reported by the ledger device
        // if that address is not the requested address, then this account belongs to a different device or seed
        if (unlockedAddress.toLowerCase() !== address.toLowerCase()) {
            throw new Error(`Ledger: Account ${address} does not belong to the connected device`);
        }
        return hdPath;
    }
    async signTypedData(withAccount, data, options = {}) {
        const isV4 = options.version === 'V4';
        if (!isV4) {
            throw new Error('Ledger: Only version 4 of typed data signing is supported');
        }
        const { domain, types, primaryType, message } = eth_sig_util_1.TypedDataUtils.sanitizeData(data);
        const domainSeparatorHex = eth_sig_util_1.TypedDataUtils.hashStruct('EIP712Domain', domain, types, eth_sig_util_1.SignTypedDataVersion.V4).toString('hex');
        const hashStructMessageHex = eth_sig_util_1.TypedDataUtils.hashStruct(primaryType.toString(), message, types, eth_sig_util_1.SignTypedDataVersion.V4).toString('hex');
        const hdPath = await this.unlockAccountByAddress(withAccount);
        if (!hdPath) {
            throw new Error('Ledger: Unknown error while signing message');
        }
        let payload;
        try {
            payload = await this.bridge.deviceSignTypedData({
                hdPath,
                domainSeparatorHex,
                hashStructMessageHex,
            });
        }
        catch (error) {
            throw error instanceof Error
                ? error
                : new Error('Ledger: Unknown error while signing message');
        }
        let recoveryId = parseInt(String(payload.v), 10).toString(16);
        if (recoveryId.length < 2) {
            recoveryId = `0${recoveryId}`;
        }
        const signature = `0x${payload.r}${payload.s}${recoveryId}`;
        const addressSignedWith = (0, eth_sig_util_1.recoverTypedSignature)({
            data,
            signature,
            version: eth_sig_util_1.SignTypedDataVersion.V4,
        });
        if (ethUtil.toChecksumAddress(addressSignedWith) !==
            ethUtil.toChecksumAddress(withAccount)) {
            throw new Error('Ledger: The signature doesnt match the right address');
        }
        return signature;
    }
    exportAccount() {
        throw new Error('Not supported on this device');
    }
    forgetDevice() {
        this.accounts = [];
        this.page = 0;
        this.unlockedAccount = 0;
        this.paths = {};
        this.accountDetails = {};
        this.hdk = new hdkey_1.default();
    }
}
exports.LedgerKeyring = LedgerKeyring;
_LedgerKeyring_instances = new WeakSet(), _LedgerKeyring_migrateAccountDetails = function _LedgerKeyring_migrateAccountDetails(opts) {
    if (__classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_isLedgerLiveHdPath).call(this) && opts.accountIndexes) {
        for (const [account, index] of Object.entries(opts.accountIndexes)) {
            this.accountDetails[account] = {
                bip44: true,
                hdPath: __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_getPathForIndex).call(this, index),
            };
        }
    }
    // try to migrate non-LedgerLive accounts too
    if (!__classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_isLedgerLiveHdPath).call(this)) {
        this.accounts
            .filter((account) => !Object.keys(this.accountDetails).includes(ethUtil.toChecksumAddress(account)))
            .forEach((account) => {
            try {
                this.accountDetails[ethUtil.toChecksumAddress(account)] = {
                    bip44: false,
                    hdPath: __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_pathFromAddress).call(this, account),
                };
            }
            catch (error) {
                console.log(`failed to migrate account ${account}`);
            }
        });
    }
}, _LedgerKeyring_signTransaction = async function _LedgerKeyring_signTransaction(address, rawTxHex, handleSigning) {
    const hdPath = await this.unlockAccountByAddress(address);
    if (!hdPath) {
        throw new Error('Ledger: Unknown error while signing transaction');
    }
    let payload;
    try {
        payload = await this.bridge.deviceSignTransaction({
            tx: rawTxHex,
            hdPath,
        });
    }
    catch (error) {
        throw error instanceof Error
            ? error
            : new Error('Ledger: Unknown error while signing transaction');
    }
    const newOrMutatedTx = handleSigning(payload);
    const valid = newOrMutatedTx.verifySignature();
    if (valid) {
        return newOrMutatedTx;
    }
    throw new Error('Ledger: The transaction signature is not valid');
}, _LedgerKeyring_getPage = 
/* PRIVATE METHODS */
async function _LedgerKeyring_getPage(increment) {
    this.page += increment;
    if (this.page <= 0) {
        this.page = 1;
    }
    const from = (this.page - 1) * this.perPage;
    const to = from + this.perPage;
    await this.unlock();
    let accounts;
    if (__classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_isLedgerLiveHdPath).call(this)) {
        accounts = await __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_getAccountsBIP44).call(this, from, to);
    }
    else {
        accounts = __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_getAccountsLegacy).call(this, from, to);
    }
    return accounts;
}, _LedgerKeyring_getAccountsBIP44 = async function _LedgerKeyring_getAccountsBIP44(from, to) {
    const accounts = [];
    for (let i = from; i < to; i++) {
        const path = __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_getPathForIndex).call(this, i);
        const address = await this.unlock(path);
        const valid = this.implementFullBIP44
            ? await __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_hasPreviousTransactions).call(this, address)
            : true;
        accounts.push({
            address,
            balance: null,
            index: i,
        });
        // PER BIP44
        // "Software should prevent a creation of an account if
        // a previous account does not have a transaction history
        // (meaning none of its addresses have been used before)."
        if (!valid) {
            break;
        }
    }
    return accounts;
}, _LedgerKeyring_getAccountsLegacy = function _LedgerKeyring_getAccountsLegacy(from, to) {
    const accounts = [];
    for (let i = from; i < to; i++) {
        const address = __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_addressFromIndex).call(this, pathBase, i);
        accounts.push({
            address,
            balance: null,
            index: i,
        });
        this.paths[ethUtil.toChecksumAddress(address)] = i;
    }
    return accounts;
}, _LedgerKeyring_addressFromIndex = function _LedgerKeyring_addressFromIndex(basePath, i) {
    const dkey = this.hdk.derive(`${basePath}/${i}`);
    const address = ethUtil
        .publicToAddress(dkey.publicKey, true)
        .toString('hex');
    return ethUtil.toChecksumAddress(`0x${address}`);
}, _LedgerKeyring_pathFromAddress = function _LedgerKeyring_pathFromAddress(address) {
    const checksummedAddress = ethUtil.toChecksumAddress(address);
    let index = this.paths[checksummedAddress];
    if (typeof index === 'undefined') {
        for (let i = 0; i < MAX_INDEX; i++) {
            if (checksummedAddress === __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_addressFromIndex).call(this, pathBase, i)) {
                index = i;
                break;
            }
        }
    }
    if (typeof index === 'undefined') {
        throw new Error('Unknown address');
    }
    return __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_getPathForIndex).call(this, index);
}, _LedgerKeyring_getPathForIndex = function _LedgerKeyring_getPathForIndex(index) {
    // Check if the path is BIP 44 (Ledger Live)
    return __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_isLedgerLiveHdPath).call(this)
        ? `m/44'/60'/${index}'/0/0`
        : `${this.hdPath}/${index}`;
}, _LedgerKeyring_isLedgerLiveHdPath = function _LedgerKeyring_isLedgerLiveHdPath() {
    return this.hdPath === `m/44'/60'/0'/0/0`;
}, _LedgerKeyring_toLedgerPath = function _LedgerKeyring_toLedgerPath(path) {
    return path.toString().replace('m/', '');
}, _LedgerKeyring_hasPreviousTransactions = async function _LedgerKeyring_hasPreviousTransactions(address) {
    const apiUrl = __classPrivateFieldGet(this, _LedgerKeyring_instances, "m", _LedgerKeyring_getApiUrl).call(this);
    const response = await window.fetch(`${apiUrl}/api?module=account&action=txlist&address=${address}&tag=latest&page=1&offset=1`);
    const parsedResponse = await response.json();
    if (parsedResponse.status !== '0' && parsedResponse.result.length > 0) {
        return true;
    }
    return false;
}, _LedgerKeyring_getApiUrl = function _LedgerKeyring_getApiUrl() {
    return this.network;
};
LedgerKeyring.type = keyringType;
//# sourceMappingURL=ledger-keyring.js.map