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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyRateController = void 0;
const controller_utils_1 = require("@metamask/controller-utils");
const polling_controller_1 = require("@metamask/polling-controller");
const async_mutex_1 = require("async-mutex");
const crypto_compare_1 = require("./crypto-compare");
const name = 'CurrencyRateController';
const metadata = {
    currentCurrency: { persist: true, anonymous: true },
    currencyRates: { persist: true, anonymous: true },
};
const defaultState = {
    currentCurrency: 'usd',
    currencyRates: {
        ETH: {
            conversionDate: 0,
            conversionRate: 0,
            usdConversionRate: null,
        },
    },
};
/**
 * Controller that passively polls on a set interval for an exchange rate from the current network
 * asset to the user's preferred currency.
 */
class CurrencyRateController extends polling_controller_1.StaticIntervalPollingController {
    /**
     * Creates a CurrencyRateController instance.
     *
     * @param options - Constructor options.
     * @param options.includeUsdRate - Keep track of the USD rate in addition to the current currency rate.
     * @param options.interval - The polling interval, in milliseconds.
     * @param options.messenger - A reference to the messaging system.
     * @param options.state - Initial state to set on this controller.
     * @param options.fetchExchangeRate - Fetches the exchange rate from an external API. This option is primarily meant for use in unit tests.
     */
    constructor({ includeUsdRate = false, interval = 180000, messenger, state, fetchExchangeRate = crypto_compare_1.fetchExchangeRate, }) {
        super({
            name,
            metadata,
            messenger,
            state: Object.assign(Object.assign({}, defaultState), state),
        });
        this.mutex = new async_mutex_1.Mutex();
        this.includeUsdRate = includeUsdRate;
        this.setIntervalLength(interval);
        this.fetchExchangeRate = fetchExchangeRate;
    }
    /**
     * Sets a currency to track.
     *
     * @param currentCurrency - ISO 4217 currency code.
     */
    setCurrentCurrency(currentCurrency) {
        return __awaiter(this, void 0, void 0, function* () {
            const releaseLock = yield this.mutex.acquire();
            const nativeCurrencies = Object.keys(this.state.currencyRates);
            try {
                this.update(() => {
                    return Object.assign(Object.assign({}, defaultState), { currentCurrency });
                });
            }
            finally {
                releaseLock();
            }
            nativeCurrencies.forEach(this.updateExchangeRate.bind(this));
        });
    }
    /**
     * Updates the exchange rate for the current currency and native currency pair.
     *
     * @param nativeCurrency - The ticker symbol for the chain.
     */
    updateExchangeRate(nativeCurrency) {
        return __awaiter(this, void 0, void 0, function* () {
            const releaseLock = yield this.mutex.acquire();
            const { currentCurrency, currencyRates } = this.state;
            let conversionDate = null;
            let conversionRate = null;
            let usdConversionRate = null;
            // For preloaded testnets (Goerli, Sepolia) we want to fetch exchange rate for real ETH.
            const nativeCurrencyForExchangeRate = Object.values(controller_utils_1.TESTNET_TICKER_SYMBOLS).includes(nativeCurrency)
                ? controller_utils_1.FALL_BACK_VS_CURRENCY // ETH
                : nativeCurrency;
            try {
                if (currentCurrency &&
                    nativeCurrency &&
                    // if either currency is an empty string we can skip the comparison
                    // because it will result in an error from the api and ultimately
                    // a null conversionRate either way.
                    currentCurrency !== '' &&
                    nativeCurrency !== '') {
                    const fetchExchangeRateResponse = yield this.fetchExchangeRate(currentCurrency, nativeCurrencyForExchangeRate, this.includeUsdRate);
                    conversionRate = fetchExchangeRateResponse.conversionRate;
                    usdConversionRate = fetchExchangeRateResponse.usdConversionRate;
                    conversionDate = Date.now() / 1000;
                }
            }
            catch (error) {
                if (!(error instanceof Error &&
                    error.message.includes('market does not exist for this coin pair'))) {
                    throw error;
                }
            }
            finally {
                try {
                    this.update(() => {
                        return {
                            currencyRates: Object.assign(Object.assign({}, currencyRates), { [nativeCurrency]: {
                                    conversionDate,
                                    conversionRate,
                                    usdConversionRate,
                                } }),
                            currentCurrency,
                        };
                    });
                }
                finally {
                    releaseLock();
                }
            }
        });
    }
    /**
     * Prepare to discard this controller.
     *
     * This stops any active polling.
     */
    destroy() {
        super.destroy();
        this.stopAllPolling();
    }
    /**
     * Updates exchange rate for the current currency.
     *
     * @param networkClientId - The network client ID used to get a ticker value.
     * @returns The controller state.
     */
    _executePoll(networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const networkClient = this.messagingSystem.call('NetworkController:getNetworkClientById', networkClientId);
            yield this.updateExchangeRate(networkClient.configuration.ticker);
        });
    }
}
exports.CurrencyRateController = CurrencyRateController;
exports.default = CurrencyRateController;
//# sourceMappingURL=CurrencyRateController.js.map