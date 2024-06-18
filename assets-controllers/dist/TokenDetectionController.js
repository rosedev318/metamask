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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _TokenDetectionController_instances, _TokenDetectionController_intervalId, _TokenDetectionController_selectedAddress, _TokenDetectionController_networkClientId, _TokenDetectionController_tokenList, _TokenDetectionController_disabled, _TokenDetectionController_isUnlocked, _TokenDetectionController_isDetectionEnabledFromPreferences, _TokenDetectionController_isDetectionEnabledForNetwork, _TokenDetectionController_getBalancesInSingleCall, _TokenDetectionController_trackMetaMetricsEvent, _TokenDetectionController_registerEventListeners, _TokenDetectionController_stopPolling, _TokenDetectionController_startPolling, _TokenDetectionController_getCorrectChainIdAndNetworkClientId, _TokenDetectionController_restartTokenDetection, _TokenDetectionController_getSlicesOfTokensToDetect, _TokenDetectionController_addDetectedTokens;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenDetectionController = exports.controllerName = exports.STATIC_MAINNET_TOKEN_LIST = exports.isEqualCaseInsensitive = void 0;
const contract_metadata_1 = __importDefault(require("@metamask/contract-metadata"));
const controller_utils_1 = require("@metamask/controller-utils");
const polling_controller_1 = require("@metamask/polling-controller");
const assetsUtil_1 = require("./assetsUtil");
const DEFAULT_INTERVAL = 180000;
/**
 * Compare 2 given strings and return boolean
 * eg: "foo" and "FOO" => true
 * eg: "foo" and "bar" => false
 * eg: "foo" and 123 => false
 *
 * @param value1 - first string to compare
 * @param value2 - first string to compare
 * @returns true if 2 strings are identical when they are lowercase
 */
function isEqualCaseInsensitive(value1, value2) {
    if (typeof value1 !== 'string' || typeof value2 !== 'string') {
        return false;
    }
    return value1.toLowerCase() === value2.toLowerCase();
}
exports.isEqualCaseInsensitive = isEqualCaseInsensitive;
exports.STATIC_MAINNET_TOKEN_LIST = Object.entries(contract_metadata_1.default).reduce((acc, [base, contract]) => {
    const { logo, erc20, erc721 } = contract, tokenMetadata = __rest(contract, ["logo", "erc20", "erc721"]);
    return Object.assign(Object.assign({}, acc), { [base.toLowerCase()]: Object.assign(Object.assign({}, tokenMetadata), { address: base.toLowerCase(), iconUrl: `images/contract/${logo}`, aggregators: [] }) });
}, {});
exports.controllerName = 'TokenDetectionController';
/**
 * Controller that passively polls on a set interval for Tokens auto detection
 * @property intervalId - Polling interval used to fetch new token rates
 * @property selectedAddress - Vault selected address
 * @property networkClientId - The network client ID of the current selected network
 * @property disabled - Boolean to track if network requests are blocked
 * @property isUnlocked - Boolean to track if the keyring state is unlocked
 * @property isDetectionEnabledFromPreferences - Boolean to track if detection is enabled from PreferencesController
 * @property isDetectionEnabledForNetwork - Boolean to track if detected is enabled for current network
 */
class TokenDetectionController extends polling_controller_1.StaticIntervalPollingController {
    /**
     * Creates a TokenDetectionController instance.
     *
     * @param options - The controller options.
     * @param options.messenger - The controller messaging system.
     * @param options.disabled - If set to true, all network requests are blocked.
     * @param options.interval - Polling interval used to fetch new token rates
     * @param options.selectedAddress - Vault selected address
     * @param options.getBalancesInSingleCall - Gets the balances of a list of tokens for the given address.
     * @param options.trackMetaMetricsEvent - Sets options for MetaMetrics event tracking.
     */
    constructor({ selectedAddress, interval = DEFAULT_INTERVAL, disabled = true, getBalancesInSingleCall, trackMetaMetricsEvent, messenger, }) {
        super({
            name: exports.controllerName,
            messenger,
            state: {},
            metadata: {},
        });
        _TokenDetectionController_instances.add(this);
        _TokenDetectionController_intervalId.set(this, void 0);
        _TokenDetectionController_selectedAddress.set(this, void 0);
        _TokenDetectionController_networkClientId.set(this, void 0);
        _TokenDetectionController_tokenList.set(this, {});
        _TokenDetectionController_disabled.set(this, void 0);
        _TokenDetectionController_isUnlocked.set(this, void 0);
        _TokenDetectionController_isDetectionEnabledFromPreferences.set(this, void 0);
        _TokenDetectionController_isDetectionEnabledForNetwork.set(this, void 0);
        _TokenDetectionController_getBalancesInSingleCall.set(this, void 0);
        _TokenDetectionController_trackMetaMetricsEvent.set(this, void 0);
        __classPrivateFieldSet(this, _TokenDetectionController_disabled, disabled, "f");
        this.setIntervalLength(interval);
        __classPrivateFieldSet(this, _TokenDetectionController_selectedAddress, selectedAddress !== null && selectedAddress !== void 0 ? selectedAddress : this.messagingSystem.call('AccountsController:getSelectedAccount')
            .address, "f");
        const { chainId, networkClientId } = __classPrivateFieldGet(this, _TokenDetectionController_instances, "m", _TokenDetectionController_getCorrectChainIdAndNetworkClientId).call(this);
        __classPrivateFieldSet(this, _TokenDetectionController_networkClientId, networkClientId, "f");
        const { useTokenDetection: defaultUseTokenDetection } = this.messagingSystem.call('PreferencesController:getState');
        __classPrivateFieldSet(this, _TokenDetectionController_isDetectionEnabledFromPreferences, defaultUseTokenDetection, "f");
        __classPrivateFieldSet(this, _TokenDetectionController_isDetectionEnabledForNetwork, (0, assetsUtil_1.isTokenDetectionSupportedForNetwork)(chainId), "f");
        __classPrivateFieldSet(this, _TokenDetectionController_getBalancesInSingleCall, getBalancesInSingleCall, "f");
        __classPrivateFieldSet(this, _TokenDetectionController_trackMetaMetricsEvent, trackMetaMetricsEvent, "f");
        const { isUnlocked } = this.messagingSystem.call('KeyringController:getState');
        __classPrivateFieldSet(this, _TokenDetectionController_isUnlocked, isUnlocked, "f");
        __classPrivateFieldGet(this, _TokenDetectionController_instances, "m", _TokenDetectionController_registerEventListeners).call(this);
    }
    /**
     * Allows controller to make active and passive polling requests
     */
    enable() {
        __classPrivateFieldSet(this, _TokenDetectionController_disabled, false, "f");
    }
    /**
     * Blocks controller from making network calls
     */
    disable() {
        __classPrivateFieldSet(this, _TokenDetectionController_disabled, true, "f");
    }
    /**
     * Internal isActive state
     * @type {boolean}
     */
    get isActive() {
        return !__classPrivateFieldGet(this, _TokenDetectionController_disabled, "f") && __classPrivateFieldGet(this, _TokenDetectionController_isUnlocked, "f");
    }
    /**
     * Start polling for detected tokens.
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.enable();
            yield __classPrivateFieldGet(this, _TokenDetectionController_instances, "m", _TokenDetectionController_startPolling).call(this);
        });
    }
    /**
     * Stop polling for detected tokens.
     */
    stop() {
        this.disable();
        __classPrivateFieldGet(this, _TokenDetectionController_instances, "m", _TokenDetectionController_stopPolling).call(this);
    }
    _executePoll(networkClientId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isActive) {
                return;
            }
            yield this.detectTokens({
                networkClientId,
                selectedAddress: options.address,
            });
        });
    }
    /**
     * For each token in the token list provided by the TokenListController, checks the token's balance for the selected account address on the active network.
     * On mainnet, if token detection is disabled in preferences, ERC20 token auto detection will be triggered for each contract address in the legacy token list from the @metamask/contract-metadata repo.
     *
     * @param options - Options for token detection.
     * @param options.networkClientId - The ID of the network client to use.
     * @param options.selectedAddress - the selectedAddress against which to detect for token balances.
     */
    detectTokens({ networkClientId, selectedAddress, } = {}) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isActive) {
                return;
            }
            const addressAgainstWhichToDetect = selectedAddress !== null && selectedAddress !== void 0 ? selectedAddress : __classPrivateFieldGet(this, _TokenDetectionController_selectedAddress, "f");
            const { chainId, networkClientId: selectedNetworkClientId } = __classPrivateFieldGet(this, _TokenDetectionController_instances, "m", _TokenDetectionController_getCorrectChainIdAndNetworkClientId).call(this, networkClientId);
            const chainIdAgainstWhichToDetect = chainId;
            const networkClientIdAgainstWhichToDetect = selectedNetworkClientId;
            if (!(0, assetsUtil_1.isTokenDetectionSupportedForNetwork)(chainIdAgainstWhichToDetect)) {
                return;
            }
            if (!__classPrivateFieldGet(this, _TokenDetectionController_isDetectionEnabledFromPreferences, "f") &&
                chainIdAgainstWhichToDetect !== controller_utils_1.ChainId.mainnet) {
                return;
            }
            const isTokenDetectionInactiveInMainnet = !__classPrivateFieldGet(this, _TokenDetectionController_isDetectionEnabledFromPreferences, "f") &&
                chainIdAgainstWhichToDetect === controller_utils_1.ChainId.mainnet;
            const { tokensChainsCache } = this.messagingSystem.call('TokenListController:getState');
            __classPrivateFieldSet(this, _TokenDetectionController_tokenList, isTokenDetectionInactiveInMainnet
                ? exports.STATIC_MAINNET_TOKEN_LIST
                : (_b = (_a = tokensChainsCache[chainIdAgainstWhichToDetect]) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : {}, "f");
            for (const tokensSlice of __classPrivateFieldGet(this, _TokenDetectionController_instances, "m", _TokenDetectionController_getSlicesOfTokensToDetect).call(this, {
                chainId: chainIdAgainstWhichToDetect,
                selectedAddress: addressAgainstWhichToDetect,
            })) {
                yield __classPrivateFieldGet(this, _TokenDetectionController_instances, "m", _TokenDetectionController_addDetectedTokens).call(this, {
                    tokensSlice,
                    selectedAddress: addressAgainstWhichToDetect,
                    networkClientId: networkClientIdAgainstWhichToDetect,
                    chainId: chainIdAgainstWhichToDetect,
                });
            }
        });
    }
}
exports.TokenDetectionController = TokenDetectionController;
_TokenDetectionController_intervalId = new WeakMap(), _TokenDetectionController_selectedAddress = new WeakMap(), _TokenDetectionController_networkClientId = new WeakMap(), _TokenDetectionController_tokenList = new WeakMap(), _TokenDetectionController_disabled = new WeakMap(), _TokenDetectionController_isUnlocked = new WeakMap(), _TokenDetectionController_isDetectionEnabledFromPreferences = new WeakMap(), _TokenDetectionController_isDetectionEnabledForNetwork = new WeakMap(), _TokenDetectionController_getBalancesInSingleCall = new WeakMap(), _TokenDetectionController_trackMetaMetricsEvent = new WeakMap(), _TokenDetectionController_instances = new WeakSet(), _TokenDetectionController_registerEventListeners = function _TokenDetectionController_registerEventListeners() {
    this.messagingSystem.subscribe('KeyringController:unlock', () => __awaiter(this, void 0, void 0, function* () {
        __classPrivateFieldSet(this, _TokenDetectionController_isUnlocked, true, "f");
        yield __classPrivateFieldGet(this, _TokenDetectionController_instances, "m", _TokenDetectionController_restartTokenDetection).call(this);
    }));
    this.messagingSystem.subscribe('KeyringController:lock', () => {
        __classPrivateFieldSet(this, _TokenDetectionController_isUnlocked, false, "f");
        __classPrivateFieldGet(this, _TokenDetectionController_instances, "m", _TokenDetectionController_stopPolling).call(this);
    });
    this.messagingSystem.subscribe('TokenListController:stateChange', ({ tokenList }) => __awaiter(this, void 0, void 0, function* () {
        const hasTokens = Object.keys(tokenList).length;
        if (hasTokens) {
            yield __classPrivateFieldGet(this, _TokenDetectionController_instances, "m", _TokenDetectionController_restartTokenDetection).call(this);
        }
    }));
    this.messagingSystem.subscribe('PreferencesController:stateChange', ({ selectedAddress: newSelectedAddress, useTokenDetection }) => __awaiter(this, void 0, void 0, function* () {
        const isSelectedAddressChanged = __classPrivateFieldGet(this, _TokenDetectionController_selectedAddress, "f") !== newSelectedAddress;
        const isDetectionChangedFromPreferences = __classPrivateFieldGet(this, _TokenDetectionController_isDetectionEnabledFromPreferences, "f") !== useTokenDetection;
        __classPrivateFieldSet(this, _TokenDetectionController_selectedAddress, newSelectedAddress, "f");
        __classPrivateFieldSet(this, _TokenDetectionController_isDetectionEnabledFromPreferences, useTokenDetection, "f");
        if (isSelectedAddressChanged || isDetectionChangedFromPreferences) {
            yield __classPrivateFieldGet(this, _TokenDetectionController_instances, "m", _TokenDetectionController_restartTokenDetection).call(this, {
                selectedAddress: __classPrivateFieldGet(this, _TokenDetectionController_selectedAddress, "f"),
            });
        }
    }));
    this.messagingSystem.subscribe('AccountsController:selectedAccountChange', ({ address: newSelectedAddress }) => __awaiter(this, void 0, void 0, function* () {
        const isSelectedAddressChanged = __classPrivateFieldGet(this, _TokenDetectionController_selectedAddress, "f") !== newSelectedAddress;
        if (isSelectedAddressChanged) {
            __classPrivateFieldSet(this, _TokenDetectionController_selectedAddress, newSelectedAddress, "f");
            yield __classPrivateFieldGet(this, _TokenDetectionController_instances, "m", _TokenDetectionController_restartTokenDetection).call(this, {
                selectedAddress: __classPrivateFieldGet(this, _TokenDetectionController_selectedAddress, "f"),
            });
        }
    }));
    this.messagingSystem.subscribe('NetworkController:networkDidChange', ({ selectedNetworkClientId }) => __awaiter(this, void 0, void 0, function* () {
        const isNetworkClientIdChanged = __classPrivateFieldGet(this, _TokenDetectionController_networkClientId, "f") !== selectedNetworkClientId;
        const { chainId: newChainId } = __classPrivateFieldGet(this, _TokenDetectionController_instances, "m", _TokenDetectionController_getCorrectChainIdAndNetworkClientId).call(this, selectedNetworkClientId);
        __classPrivateFieldSet(this, _TokenDetectionController_isDetectionEnabledForNetwork, (0, assetsUtil_1.isTokenDetectionSupportedForNetwork)(newChainId), "f");
        if (isNetworkClientIdChanged && __classPrivateFieldGet(this, _TokenDetectionController_isDetectionEnabledForNetwork, "f")) {
            __classPrivateFieldSet(this, _TokenDetectionController_networkClientId, selectedNetworkClientId, "f");
            yield __classPrivateFieldGet(this, _TokenDetectionController_instances, "m", _TokenDetectionController_restartTokenDetection).call(this, {
                networkClientId: __classPrivateFieldGet(this, _TokenDetectionController_networkClientId, "f"),
            });
        }
    }));
}, _TokenDetectionController_stopPolling = function _TokenDetectionController_stopPolling() {
    if (__classPrivateFieldGet(this, _TokenDetectionController_intervalId, "f")) {
        clearInterval(__classPrivateFieldGet(this, _TokenDetectionController_intervalId, "f"));
    }
}, _TokenDetectionController_startPolling = function _TokenDetectionController_startPolling() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isActive) {
            return;
        }
        __classPrivateFieldGet(this, _TokenDetectionController_instances, "m", _TokenDetectionController_stopPolling).call(this);
        yield this.detectTokens();
        __classPrivateFieldSet(this, _TokenDetectionController_intervalId, setInterval(() => __awaiter(this, void 0, void 0, function* () {
            yield this.detectTokens();
        }), this.getIntervalLength()), "f");
    });
}, _TokenDetectionController_getCorrectChainIdAndNetworkClientId = function _TokenDetectionController_getCorrectChainIdAndNetworkClientId(networkClientId) {
    if (networkClientId) {
        const networkConfiguration = this.messagingSystem.call('NetworkController:getNetworkConfigurationByNetworkClientId', networkClientId);
        if (networkConfiguration) {
            return {
                chainId: networkConfiguration.chainId,
                networkClientId,
            };
        }
    }
    const { selectedNetworkClientId } = this.messagingSystem.call('NetworkController:getState');
    const { configuration: { chainId }, } = this.messagingSystem.call('NetworkController:getNetworkClientById', selectedNetworkClientId);
    return {
        chainId,
        networkClientId: selectedNetworkClientId,
    };
}, _TokenDetectionController_restartTokenDetection = function _TokenDetectionController_restartTokenDetection({ selectedAddress, networkClientId, } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.detectTokens({
            networkClientId,
            selectedAddress,
        });
        this.setIntervalLength(DEFAULT_INTERVAL);
    });
}, _TokenDetectionController_getSlicesOfTokensToDetect = function _TokenDetectionController_getSlicesOfTokensToDetect({ chainId, selectedAddress, }) {
    const { allTokens, allDetectedTokens, allIgnoredTokens } = this.messagingSystem.call('TokensController:getState');
    const [tokensAddresses, detectedTokensAddresses, ignoredTokensAddresses] = [
        allTokens,
        allDetectedTokens,
        allIgnoredTokens,
    ].map((tokens) => {
        var _a, _b;
        return ((_b = (_a = tokens[chainId]) === null || _a === void 0 ? void 0 : _a[selectedAddress]) !== null && _b !== void 0 ? _b : []).map((value) => typeof value === 'string' ? value : value.address);
    });
    const tokensToDetect = [];
    for (const tokenAddress of Object.keys(__classPrivateFieldGet(this, _TokenDetectionController_tokenList, "f"))) {
        if ([
            tokensAddresses,
            detectedTokensAddresses,
            ignoredTokensAddresses,
        ].every((addresses) => !addresses.find((address) => isEqualCaseInsensitive(address, tokenAddress)))) {
            tokensToDetect.push(tokenAddress);
        }
    }
    const slicesOfTokensToDetect = [];
    for (let i = 0, size = 1000; i < tokensToDetect.length; i += size) {
        slicesOfTokensToDetect.push(tokensToDetect.slice(i, i + size));
    }
    return slicesOfTokensToDetect;
}, _TokenDetectionController_addDetectedTokens = function _TokenDetectionController_addDetectedTokens({ tokensSlice, selectedAddress, networkClientId, chainId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, controller_utils_1.safelyExecute)(() => __awaiter(this, void 0, void 0, function* () {
            const balances = yield __classPrivateFieldGet(this, _TokenDetectionController_getBalancesInSingleCall, "f").call(this, selectedAddress, tokensSlice, networkClientId);
            const tokensWithBalance = [];
            const eventTokensDetails = [];
            for (const nonZeroTokenAddress of Object.keys(balances)) {
                const { decimals, symbol, aggregators, iconUrl, name } = __classPrivateFieldGet(this, _TokenDetectionController_tokenList, "f")[nonZeroTokenAddress];
                eventTokensDetails.push(`${symbol} - ${nonZeroTokenAddress}`);
                tokensWithBalance.push({
                    address: nonZeroTokenAddress,
                    decimals,
                    symbol,
                    aggregators,
                    image: iconUrl,
                    isERC721: false,
                    name,
                });
            }
            if (tokensWithBalance.length) {
                __classPrivateFieldGet(this, _TokenDetectionController_trackMetaMetricsEvent, "f").call(this, {
                    event: 'Token Detected',
                    category: 'Wallet',
                    properties: {
                        tokens: eventTokensDetails,
                        token_standard: 'ERC20',
                        asset_type: 'TOKEN',
                    },
                });
                yield this.messagingSystem.call('TokensController:addDetectedTokens', tokensWithBalance, {
                    selectedAddress,
                    chainId,
                });
            }
        }));
    });
};
exports.default = TokenDetectionController;
//# sourceMappingURL=TokenDetectionController.js.map