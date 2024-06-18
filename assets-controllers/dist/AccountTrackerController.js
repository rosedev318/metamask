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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _AccountTrackerController_instances, _AccountTrackerController_getCorrectNetworkClient;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountTrackerController = void 0;
const controller_utils_1 = require("@metamask/controller-utils");
const eth_query_1 = __importDefault(require("@metamask/eth-query"));
const polling_controller_1 = require("@metamask/polling-controller");
const utils_1 = require("@metamask/utils");
const async_mutex_1 = require("async-mutex");
const lodash_1 = require("lodash");
/**
 * Controller that tracks the network balances for all user accounts.
 */
class AccountTrackerController extends polling_controller_1.StaticIntervalPollingControllerV1 {
    /**
     * Creates an AccountTracker instance.
     *
     * @param options - The controller options.
     * @param options.onPreferencesStateChange - Allows subscribing to preference controller state changes.
     * @param options.getIdentities - Gets the identities from the Preferences store.
     * @param options.getSelectedAddress - Gets the selected address from the Preferences store.
     * @param options.getMultiAccountBalancesEnabled - Gets the multi account balances enabled flag from the Preferences store.
     * @param options.getCurrentChainId - Gets the chain ID for the current network from the Network store.
     * @param options.getNetworkClientById - Gets the network client with the given id from the NetworkController.
     * @param config - Initial options used to configure this controller.
     * @param state - Initial state to set on this controller.
     */
    constructor({ onPreferencesStateChange, getIdentities, getSelectedAddress, getMultiAccountBalancesEnabled, getCurrentChainId, getNetworkClientById, }, config, state) {
        super(config, state);
        _AccountTrackerController_instances.add(this);
        this.refreshMutex = new async_mutex_1.Mutex();
        /**
         * Name of this controller used during composition
         */
        this.name = 'AccountTrackerController';
        /**
         * Refreshes the balances of the accounts depending on the multi-account setting.
         * If multi-account is disabled, only updates the selected account balance.
         * If multi-account is enabled, updates balances for all accounts.
         *
         * @param networkClientId - Optional networkClientId to fetch a network client with
         */
        this.refresh = (networkClientId) => __awaiter(this, void 0, void 0, function* () {
            const releaseLock = yield this.refreshMutex.acquire();
            try {
                const { chainId, ethQuery } = __classPrivateFieldGet(this, _AccountTrackerController_instances, "m", _AccountTrackerController_getCorrectNetworkClient).call(this, networkClientId);
                this.syncAccounts(chainId);
                const { accounts, accountsByChainId } = this.state;
                const isMultiAccountBalancesEnabled = this.getMultiAccountBalancesEnabled();
                const accountsToUpdate = isMultiAccountBalancesEnabled
                    ? Object.keys(accounts)
                    : [this.getSelectedAddress()];
                const accountsForChain = Object.assign({}, accountsByChainId[chainId]);
                for (const address of accountsToUpdate) {
                    accountsForChain[address] = {
                        balance: (0, controller_utils_1.BNToHex)(yield this.getBalanceFromChain(address, ethQuery)),
                    };
                }
                this.update(Object.assign(Object.assign({}, (chainId === this.getCurrentChainId() && {
                    accounts: accountsForChain,
                })), { accountsByChainId: Object.assign(Object.assign({}, this.state.accountsByChainId), { [chainId]: accountsForChain }) }));
            }
            catch (err) {
                releaseLock();
                throw err;
            }
        });
        this.defaultConfig = {
            interval: 10000,
        };
        this.defaultState = {
            accounts: {},
            accountsByChainId: {
                [getCurrentChainId()]: {},
            },
        };
        this.initialize();
        this.setIntervalLength(this.config.interval);
        this.getIdentities = getIdentities;
        this.getSelectedAddress = getSelectedAddress;
        this.getMultiAccountBalancesEnabled = getMultiAccountBalancesEnabled;
        this.getCurrentChainId = getCurrentChainId;
        this.getNetworkClientById = getNetworkClientById;
        onPreferencesStateChange(() => {
            this.refresh();
        });
        this.poll();
    }
    syncAccounts(newChainId) {
        const accounts = Object.assign({}, this.state.accounts);
        const accountsByChainId = (0, lodash_1.cloneDeep)(this.state.accountsByChainId);
        const existing = Object.keys(accounts);
        if (!accountsByChainId[newChainId]) {
            accountsByChainId[newChainId] = {};
            existing.forEach((address) => {
                accountsByChainId[newChainId][address] = { balance: '0x0' };
            });
        }
        const addresses = Object.keys(this.getIdentities());
        const newAddresses = addresses.filter((address) => !existing.includes(address));
        const oldAddresses = existing.filter((address) => !addresses.includes(address));
        newAddresses.forEach((address) => {
            accounts[address] = { balance: '0x0' };
        });
        Object.keys(accountsByChainId).forEach((chainId) => {
            newAddresses.forEach((address) => {
                accountsByChainId[chainId][address] = {
                    balance: '0x0',
                };
            });
        });
        oldAddresses.forEach((address) => {
            delete accounts[address];
        });
        Object.keys(accountsByChainId).forEach((chainId) => {
            oldAddresses.forEach((address) => {
                delete accountsByChainId[chainId][address];
            });
        });
        this.update({ accounts, accountsByChainId });
    }
    /**
     * Sets a new provider.
     *
     * TODO: Replace this wth a method.
     *
     * @param provider - Provider used to create a new underlying EthQuery instance.
     */
    set provider(provider) {
        this._provider = provider;
    }
    get provider() {
        throw new Error('Property only used for setting');
    }
    /**
     * Starts a new polling interval.
     *
     * @param interval - Polling interval trigger a 'refresh'.
     */
    poll(interval) {
        return __awaiter(this, void 0, void 0, function* () {
            interval && this.configure({ interval }, false, false);
            this.handle && clearTimeout(this.handle);
            yield this.refresh();
            this.handle = setTimeout(() => {
                this.poll(this.config.interval);
            }, this.config.interval);
        });
    }
    /**
     * Refreshes the balances of the accounts using the networkClientId
     *
     * @param networkClientId - The network client ID used to get balances.
     */
    _executePoll(networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.refresh(networkClientId);
        });
    }
    /**
     * Fetches the balance of a given address from the blockchain.
     *
     * @param address - The account address to fetch the balance for.
     * @param ethQuery - The EthQuery instance to query getBalnce with.
     * @returns A promise that resolves to the balance in a hex string format.
     */
    getBalanceFromChain(address, ethQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, controller_utils_1.safelyExecuteWithTimeout)(() => __awaiter(this, void 0, void 0, function* () {
                (0, utils_1.assert)(ethQuery, 'Provider not set.');
                return yield (0, controller_utils_1.query)(ethQuery, 'getBalance', [address]);
            }));
        });
    }
    /**
     * Sync accounts balances with some additional addresses.
     *
     * @param addresses - the additional addresses, may be hardware wallet addresses.
     * @param networkClientId - Optional networkClientId to fetch a network client with.
     * @returns accounts - addresses with synced balance
     */
    syncBalanceWithAddresses(addresses, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ethQuery } = __classPrivateFieldGet(this, _AccountTrackerController_instances, "m", _AccountTrackerController_getCorrectNetworkClient).call(this, networkClientId);
            return yield Promise.all(addresses.map((address) => {
                return (0, controller_utils_1.safelyExecuteWithTimeout)(() => __awaiter(this, void 0, void 0, function* () {
                    (0, utils_1.assert)(ethQuery, 'Provider not set.');
                    const balance = yield (0, controller_utils_1.query)(ethQuery, 'getBalance', [address]);
                    return [address, balance];
                }));
            })).then((value) => {
                return value.reduce((obj, item) => {
                    if (!item) {
                        return obj;
                    }
                    const [address, balance] = item;
                    return Object.assign(Object.assign({}, obj), { [address]: {
                            balance,
                        } });
                }, {});
            });
        });
    }
}
exports.AccountTrackerController = AccountTrackerController;
_AccountTrackerController_instances = new WeakSet(), _AccountTrackerController_getCorrectNetworkClient = function _AccountTrackerController_getCorrectNetworkClient(networkClientId) {
    if (networkClientId) {
        const networkClient = this.getNetworkClientById(networkClientId);
        return {
            chainId: networkClient.configuration.chainId,
            ethQuery: new eth_query_1.default(networkClient.provider),
        };
    }
    return {
        chainId: this.getCurrentChainId(),
        ethQuery: this._provider ? new eth_query_1.default(this._provider) : undefined,
    };
};
exports.default = AccountTrackerController;
//# sourceMappingURL=AccountTrackerController.js.map