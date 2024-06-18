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
var _TokenRatesController_instances, _TokenRatesController_pollState, _TokenRatesController_tokenPricesService, _TokenRatesController_inProcessExchangeRateUpdates, _TokenRatesController_getTokenAddresses, _TokenRatesController_stopPoll, _TokenRatesController_poll, _TokenRatesController_fetchAndMapExchangeRates, _TokenRatesController_fetchAndMapExchangeRatesForSupportedNativeCurrency, _TokenRatesController_fetchAndMapExchangeRatesForUnsupportedNativeCurrency;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRatesController = void 0;
const controller_utils_1 = require("@metamask/controller-utils");
const polling_controller_1 = require("@metamask/polling-controller");
const utils_1 = require("@metamask/utils");
const lodash_1 = require("lodash");
const assetsUtil_1 = require("./assetsUtil");
const crypto_compare_1 = require("./crypto-compare");
var PollState;
(function (PollState) {
    PollState["Active"] = "Active";
    PollState["Inactive"] = "Inactive";
})(PollState || (PollState = {}));
/**
 * Uses the CryptoCompare API to fetch the exchange rate between one currency
 * and another, i.e., the multiplier to apply the amount of one currency in
 * order to convert it to another.
 *
 * @param args - The arguments to this function.
 * @param args.from - The currency to convert from.
 * @param args.to - The currency to convert to.
 * @returns The exchange rate between `fromCurrency` to `toCurrency` if one
 * exists, or null if one does not.
 */
function getCurrencyConversionRate({ from, to, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const includeUSDRate = false;
        try {
            const result = yield (0, crypto_compare_1.fetchExchangeRate)(to, from, includeUSDRate);
            return result.conversionRate;
        }
        catch (error) {
            if (error instanceof Error &&
                error.message.includes('market does not exist for this coin pair')) {
                return null;
            }
            throw error;
        }
    });
}
/**
 * Controller that passively polls on a set interval for token-to-fiat exchange rates
 * for tokens stored in the TokensController
 */
class TokenRatesController extends polling_controller_1.StaticIntervalPollingControllerV1 {
    /**
     * Creates a TokenRatesController instance.
     *
     * @param options - The controller options.
     * @param options.interval - The polling interval in ms
     * @param options.threshold - The duration in ms before metadata fetched from CoinGecko is considered stale
     * @param options.getNetworkClientById - Gets the network client with the given id from the NetworkController.
     * @param options.chainId - The chain ID of the current network.
     * @param options.ticker - The ticker for the current network.
     * @param options.selectedAddress - The current selected address.
     * @param options.onPreferencesStateChange - Allows subscribing to preference controller state changes.
     * @param options.onTokensStateChange - Allows subscribing to token controller state changes.
     * @param options.onNetworkStateChange - Allows subscribing to network state changes.
     * @param options.tokenPricesService - An object in charge of retrieving token prices.
     * @param config - Initial options used to configure this controller.
     * @param state - Initial state to set on this controller.
     */
    constructor({ interval = 3 * 60 * 1000, threshold = 6 * 60 * 60 * 1000, getNetworkClientById, chainId: initialChainId, ticker: initialTicker, selectedAddress: initialSelectedAddress, onPreferencesStateChange, onTokensStateChange, onNetworkStateChange, tokenPricesService, }, config, state) {
        super(config, state);
        _TokenRatesController_instances.add(this);
        _TokenRatesController_pollState.set(this, PollState.Inactive);
        _TokenRatesController_tokenPricesService.set(this, void 0);
        _TokenRatesController_inProcessExchangeRateUpdates.set(this, {});
        /**
         * Name of this controller used during composition
         */
        this.name = 'TokenRatesController';
        this.defaultConfig = {
            interval,
            threshold,
            disabled: false,
            nativeCurrency: initialTicker,
            chainId: initialChainId,
            selectedAddress: initialSelectedAddress,
            allTokens: {},
            allDetectedTokens: {},
        };
        this.defaultState = {
            contractExchangeRates: {},
            contractExchangeRatesByChainId: {},
        };
        this.initialize();
        this.setIntervalLength(interval);
        this.getNetworkClientById = getNetworkClientById;
        __classPrivateFieldSet(this, _TokenRatesController_tokenPricesService, tokenPricesService, "f");
        if (config === null || config === void 0 ? void 0 : config.disabled) {
            this.configure({ disabled: true }, false, false);
        }
        onPreferencesStateChange(({ selectedAddress }) => __awaiter(this, void 0, void 0, function* () {
            if (this.config.selectedAddress !== selectedAddress) {
                this.configure({ selectedAddress });
                if (__classPrivateFieldGet(this, _TokenRatesController_pollState, "f") === PollState.Active) {
                    yield this.updateExchangeRates();
                }
            }
        }));
        onTokensStateChange(({ allTokens, allDetectedTokens }) => __awaiter(this, void 0, void 0, function* () {
            const previousTokenAddresses = __classPrivateFieldGet(this, _TokenRatesController_instances, "m", _TokenRatesController_getTokenAddresses).call(this, this.config.chainId);
            this.configure({ allTokens, allDetectedTokens });
            const newTokenAddresses = __classPrivateFieldGet(this, _TokenRatesController_instances, "m", _TokenRatesController_getTokenAddresses).call(this, this.config.chainId);
            if (!(0, lodash_1.isEqual)(previousTokenAddresses, newTokenAddresses) &&
                __classPrivateFieldGet(this, _TokenRatesController_pollState, "f") === PollState.Active) {
                yield this.updateExchangeRates();
            }
        }));
        onNetworkStateChange(({ providerConfig }) => __awaiter(this, void 0, void 0, function* () {
            const { chainId, ticker } = providerConfig;
            if (this.config.chainId !== chainId ||
                this.config.nativeCurrency !== ticker) {
                this.update({ contractExchangeRates: {} });
                this.configure({ chainId, nativeCurrency: ticker });
                if (__classPrivateFieldGet(this, _TokenRatesController_pollState, "f") === PollState.Active) {
                    yield this.updateExchangeRates();
                }
            }
        }));
    }
    /**
     * Start (or restart) polling.
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldGet(this, _TokenRatesController_instances, "m", _TokenRatesController_stopPoll).call(this);
            __classPrivateFieldSet(this, _TokenRatesController_pollState, PollState.Active, "f");
            yield __classPrivateFieldGet(this, _TokenRatesController_instances, "m", _TokenRatesController_poll).call(this);
        });
    }
    /**
     * Stop polling.
     */
    stop() {
        __classPrivateFieldGet(this, _TokenRatesController_instances, "m", _TokenRatesController_stopPoll).call(this);
        __classPrivateFieldSet(this, _TokenRatesController_pollState, PollState.Inactive, "f");
    }
    /**
     * Updates exchange rates for all tokens.
     */
    updateExchangeRates() {
        return __awaiter(this, void 0, void 0, function* () {
            const { chainId, nativeCurrency } = this.config;
            yield this.updateExchangeRatesByChainId({
                chainId,
                nativeCurrency,
            });
        });
    }
    /**
     * Updates exchange rates for all tokens.
     *
     * @param options - The options to fetch exchange rates.
     * @param options.chainId - The chain ID.
     * @param options.nativeCurrency - The ticker for the chain.
     */
    updateExchangeRatesByChainId({ chainId, nativeCurrency, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.disabled) {
                return;
            }
            const tokenAddresses = __classPrivateFieldGet(this, _TokenRatesController_instances, "m", _TokenRatesController_getTokenAddresses).call(this, chainId);
            if (tokenAddresses.length === 0) {
                return;
            }
            const updateKey = `${chainId}:${nativeCurrency}`;
            if (updateKey in __classPrivateFieldGet(this, _TokenRatesController_inProcessExchangeRateUpdates, "f")) {
                // This prevents redundant updates
                // This promise is resolved after the in-progress update has finished,
                // and state has been updated.
                yield __classPrivateFieldGet(this, _TokenRatesController_inProcessExchangeRateUpdates, "f")[updateKey];
                return;
            }
            const { promise: inProgressUpdate, resolve: updateSucceeded, reject: updateFailed, } = (0, utils_1.createDeferredPromise)({ suppressUnhandledRejection: true });
            __classPrivateFieldGet(this, _TokenRatesController_inProcessExchangeRateUpdates, "f")[updateKey] = inProgressUpdate;
            try {
                const newContractExchangeRates = yield __classPrivateFieldGet(this, _TokenRatesController_instances, "m", _TokenRatesController_fetchAndMapExchangeRates).call(this, {
                    tokenAddresses,
                    chainId,
                    nativeCurrency,
                });
                const existingContractExchangeRates = this.state.contractExchangeRates;
                const updatedContractExchangeRates = chainId === this.config.chainId &&
                    nativeCurrency === this.config.nativeCurrency
                    ? newContractExchangeRates
                    : existingContractExchangeRates;
                const existingContractExchangeRatesForChainId = (_a = this.state.contractExchangeRatesByChainId[chainId]) !== null && _a !== void 0 ? _a : {};
                const updatedContractExchangeRatesForChainId = Object.assign(Object.assign({}, this.state.contractExchangeRatesByChainId), { [chainId]: Object.assign(Object.assign({}, existingContractExchangeRatesForChainId), { [nativeCurrency]: Object.assign(Object.assign({}, existingContractExchangeRatesForChainId[nativeCurrency]), newContractExchangeRates) }) });
                this.update({
                    contractExchangeRates: updatedContractExchangeRates,
                    contractExchangeRatesByChainId: updatedContractExchangeRatesForChainId,
                });
                updateSucceeded();
            }
            catch (error) {
                updateFailed(error);
                throw error;
            }
            finally {
                delete __classPrivateFieldGet(this, _TokenRatesController_inProcessExchangeRateUpdates, "f")[updateKey];
            }
        });
    }
    /**
     * Updates token rates for the given networkClientId
     *
     * @param networkClientId - The network client ID used to get a ticker value.
     * @returns The controller state.
     */
    _executePoll(networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const networkClient = this.getNetworkClientById(networkClientId);
            yield this.updateExchangeRatesByChainId({
                chainId: networkClient.configuration.chainId,
                nativeCurrency: networkClient.configuration.ticker,
            });
        });
    }
}
exports.TokenRatesController = TokenRatesController;
_TokenRatesController_pollState = new WeakMap(), _TokenRatesController_tokenPricesService = new WeakMap(), _TokenRatesController_inProcessExchangeRateUpdates = new WeakMap(), _TokenRatesController_instances = new WeakSet(), _TokenRatesController_getTokenAddresses = function _TokenRatesController_getTokenAddresses(chainId) {
    var _a, _b;
    const { allTokens, allDetectedTokens } = this.config;
    const tokens = ((_a = allTokens[chainId]) === null || _a === void 0 ? void 0 : _a[this.config.selectedAddress]) || [];
    const detectedTokens = ((_b = allDetectedTokens[chainId]) === null || _b === void 0 ? void 0 : _b[this.config.selectedAddress]) || [];
    return [
        ...new Set([...tokens, ...detectedTokens].map((token) => (0, controller_utils_1.toHex)((0, controller_utils_1.toChecksumHexAddress)(token.address)))),
    ].sort();
}, _TokenRatesController_stopPoll = function _TokenRatesController_stopPoll() {
    if (this.handle) {
        clearTimeout(this.handle);
    }
}, _TokenRatesController_poll = function _TokenRatesController_poll() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, controller_utils_1.safelyExecute)(() => this.updateExchangeRates());
        // Poll using recursive `setTimeout` instead of `setInterval` so that
        // requests don't stack if they take longer than the polling interval
        this.handle = setTimeout(() => {
            __classPrivateFieldGet(this, _TokenRatesController_instances, "m", _TokenRatesController_poll).call(this);
        }, this.config.interval);
    });
}, _TokenRatesController_fetchAndMapExchangeRates = function _TokenRatesController_fetchAndMapExchangeRates({ tokenAddresses, chainId, nativeCurrency, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!__classPrivateFieldGet(this, _TokenRatesController_tokenPricesService, "f").validateChainIdSupported(chainId)) {
            return tokenAddresses.reduce((obj, tokenAddress) => {
                return Object.assign(Object.assign({}, obj), { [tokenAddress]: undefined });
            }, {});
        }
        if (__classPrivateFieldGet(this, _TokenRatesController_tokenPricesService, "f").validateCurrencySupported(nativeCurrency)) {
            return yield __classPrivateFieldGet(this, _TokenRatesController_instances, "m", _TokenRatesController_fetchAndMapExchangeRatesForSupportedNativeCurrency).call(this, {
                tokenAddresses,
                chainId,
                nativeCurrency,
            });
        }
        return yield __classPrivateFieldGet(this, _TokenRatesController_instances, "m", _TokenRatesController_fetchAndMapExchangeRatesForUnsupportedNativeCurrency).call(this, {
            tokenAddresses,
            nativeCurrency,
        });
    });
}, _TokenRatesController_fetchAndMapExchangeRatesForSupportedNativeCurrency = function _TokenRatesController_fetchAndMapExchangeRatesForSupportedNativeCurrency({ tokenAddresses, chainId, nativeCurrency, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenPricesByTokenAddress = yield (0, assetsUtil_1.reduceInBatchesSerially)({
            values: [...tokenAddresses].sort(),
            batchSize: assetsUtil_1.TOKEN_PRICES_BATCH_SIZE,
            eachBatch: (allTokenPricesByTokenAddress, batch) => __awaiter(this, void 0, void 0, function* () {
                const tokenPricesByTokenAddressForBatch = yield __classPrivateFieldGet(this, _TokenRatesController_tokenPricesService, "f").fetchTokenPrices({
                    tokenAddresses: batch,
                    chainId,
                    currency: nativeCurrency,
                });
                return Object.assign(Object.assign({}, allTokenPricesByTokenAddress), tokenPricesByTokenAddressForBatch);
            }),
            initialResult: {},
        });
        return Object.entries(tokenPricesByTokenAddress).reduce((obj, [tokenAddress, tokenPrice]) => {
            return Object.assign(Object.assign({}, obj), { [tokenAddress]: tokenPrice === null || tokenPrice === void 0 ? void 0 : tokenPrice.value });
        }, {});
    });
}, _TokenRatesController_fetchAndMapExchangeRatesForUnsupportedNativeCurrency = function _TokenRatesController_fetchAndMapExchangeRatesForUnsupportedNativeCurrency({ tokenAddresses, nativeCurrency, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const [contractExchangeRates, fallbackCurrencyToNativeCurrencyConversionRate,] = yield Promise.all([
            __classPrivateFieldGet(this, _TokenRatesController_instances, "m", _TokenRatesController_fetchAndMapExchangeRatesForSupportedNativeCurrency).call(this, {
                tokenAddresses,
                chainId: this.config.chainId,
                nativeCurrency: controller_utils_1.FALL_BACK_VS_CURRENCY,
            }),
            getCurrencyConversionRate({
                from: controller_utils_1.FALL_BACK_VS_CURRENCY,
                to: nativeCurrency,
            }),
        ]);
        if (fallbackCurrencyToNativeCurrencyConversionRate === null) {
            return {};
        }
        return Object.entries(contractExchangeRates).reduce((obj, [tokenAddress, tokenValue]) => {
            return Object.assign(Object.assign({}, obj), { [tokenAddress]: tokenValue
                    ? tokenValue * fallbackCurrencyToNativeCurrencyConversionRate
                    : undefined });
        }, {});
    });
};
exports.default = TokenRatesController;
//# sourceMappingURL=TokenRatesController.js.map