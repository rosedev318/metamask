"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PreferencesController_instances, _PreferencesController_syncIdentities;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferencesController = exports.getDefaultPreferencesState = void 0;
const base_controller_1 = require("@metamask/base-controller");
const controller_utils_1 = require("@metamask/controller-utils");
const constants_1 = require("./constants");
const metadata = {
    disabledRpcMethodPreferences: { persist: true, anonymous: true },
    featureFlags: { persist: true, anonymous: true },
    identities: { persist: true, anonymous: false },
    ipfsGateway: { persist: true, anonymous: false },
    isIpfsGatewayEnabled: { persist: true, anonymous: true },
    isMultiAccountBalancesEnabled: { persist: true, anonymous: true },
    lostIdentities: { persist: true, anonymous: false },
    openSeaEnabled: { persist: true, anonymous: true },
    securityAlertsEnabled: { persist: true, anonymous: true },
    selectedAddress: { persist: true, anonymous: false },
    showTestNetworks: { persist: true, anonymous: true },
    showIncomingTransactions: { persist: true, anonymous: true },
    useNftDetection: { persist: true, anonymous: true },
    useTokenDetection: { persist: true, anonymous: true },
};
const name = 'PreferencesController';
/**
 * Get the default PreferencesController state.
 *
 * @returns The default PreferencesController state.
 */
function getDefaultPreferencesState() {
    return {
        disabledRpcMethodPreferences: {
            eth_sign: false,
        },
        featureFlags: {},
        identities: {},
        ipfsGateway: 'https://ipfs.io/ipfs/',
        isIpfsGatewayEnabled: true,
        isMultiAccountBalancesEnabled: true,
        lostIdentities: {},
        openSeaEnabled: false,
        securityAlertsEnabled: false,
        selectedAddress: '',
        showIncomingTransactions: {
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.MAINNET]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.GOERLI]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.BSC]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.BSC_TESTNET]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.OPTIMISM]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.OPTIMISM_SEPOLIA]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.POLYGON]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.POLYGON_TESTNET]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.AVALANCHE]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.AVALANCHE_TESTNET]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.FANTOM]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.FANTOM_TESTNET]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.SEPOLIA]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.LINEA_GOERLI]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.LINEA_MAINNET]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.MOONBEAM]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.MOONBEAM_TESTNET]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.MOONRIVER]: true,
            [constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS.GNOSIS]: true,
        },
        showTestNetworks: false,
        useNftDetection: false,
        useTokenDetection: true,
    };
}
exports.getDefaultPreferencesState = getDefaultPreferencesState;
/**
 * Controller that stores shared settings and exposes convenience methods
 */
class PreferencesController extends base_controller_1.BaseController {
    /**
     * Creates a PreferencesController instance.
     *
     * @param args - Arguments
     * @param args.messenger - The preferences controller messenger.
     * @param args.state - Preferences controller state.
     */
    constructor({ messenger, state, }) {
        super({
            name,
            metadata,
            messenger,
            state: Object.assign(Object.assign({}, getDefaultPreferencesState()), state),
        });
        _PreferencesController_instances.add(this);
        messenger.subscribe('KeyringController:stateChange', (keyringState) => {
            const accounts = new Set();
            for (const keyring of keyringState.keyrings) {
                for (const account of keyring.accounts) {
                    accounts.add(account);
                }
            }
            if (accounts.size > 0) {
                __classPrivateFieldGet(this, _PreferencesController_instances, "m", _PreferencesController_syncIdentities).call(this, Array.from(accounts));
            }
        });
    }
    /**
     * Adds identities to state.
     *
     * @param addresses - List of addresses to use to generate new identities.
     */
    addIdentities(addresses) {
        const checksummedAddresses = addresses.map(controller_utils_1.toChecksumHexAddress);
        this.update((state) => {
            const { identities } = state;
            for (const address of checksummedAddresses) {
                if (identities[address]) {
                    continue;
                }
                const identityCount = Object.keys(identities).length;
                identities[address] = {
                    name: `Account ${identityCount + 1}`,
                    address,
                    importTime: Date.now(),
                };
            }
        });
    }
    /**
     * Removes an identity from state.
     *
     * @param address - Address of the identity to remove.
     */
    removeIdentity(address) {
        address = (0, controller_utils_1.toChecksumHexAddress)(address);
        const { identities } = this.state;
        if (!identities[address]) {
            return;
        }
        this.update((state) => {
            delete state.identities[address];
            if (address === state.selectedAddress) {
                state.selectedAddress = Object.keys(state.identities)[0];
            }
        });
    }
    /**
     * Associates a new label with an identity.
     *
     * @param address - Address of the identity to associate.
     * @param label - New label to assign.
     */
    setAccountLabel(address, label) {
        address = (0, controller_utils_1.toChecksumHexAddress)(address);
        this.update((state) => {
            const identity = state.identities[address] || {};
            identity.name = label;
            state.identities[address] = identity;
        });
    }
    /**
     * Enable or disable a specific feature flag.
     *
     * @param feature - Feature to toggle.
     * @param activated - Value to assign.
     */
    setFeatureFlag(feature, activated) {
        this.update((state) => {
            state.featureFlags[feature] = activated;
        });
    }
    /**
     * Sets selected address.
     *
     * @param selectedAddress - Ethereum address.
     */
    setSelectedAddress(selectedAddress) {
        this.update((state) => {
            state.selectedAddress = (0, controller_utils_1.toChecksumHexAddress)(selectedAddress);
        });
    }
    /**
     * Sets new IPFS gateway.
     *
     * @param ipfsGateway - IPFS gateway string.
     */
    setIpfsGateway(ipfsGateway) {
        this.update((state) => {
            state.ipfsGateway = ipfsGateway;
        });
    }
    /**
     * Toggle the token detection setting.
     *
     * @param useTokenDetection - Boolean indicating user preference on token detection.
     */
    setUseTokenDetection(useTokenDetection) {
        this.update((state) => {
            state.useTokenDetection = useTokenDetection;
        });
    }
    /**
     * Toggle the NFT detection setting.
     *
     * @param useNftDetection - Boolean indicating user preference on NFT detection.
     */
    setUseNftDetection(useNftDetection) {
        if (useNftDetection && !this.state.openSeaEnabled) {
            throw new Error('useNftDetection cannot be enabled if openSeaEnabled is false');
        }
        this.update((state) => {
            state.useNftDetection = useNftDetection;
        });
    }
    /**
     * Toggle the opensea enabled setting.
     *
     * @param openSeaEnabled - Boolean indicating user preference on using OpenSea's API.
     */
    setOpenSeaEnabled(openSeaEnabled) {
        this.update((state) => {
            state.openSeaEnabled = openSeaEnabled;
            if (!openSeaEnabled) {
                state.useNftDetection = false;
            }
        });
    }
    /**
     * Toggle the security alert enabled setting.
     *
     * @param securityAlertsEnabled - Boolean indicating user preference on using security alerts.
     */
    setSecurityAlertsEnabled(securityAlertsEnabled) {
        this.update((state) => {
            state.securityAlertsEnabled = securityAlertsEnabled;
        });
    }
    /**
     * A setter for the user preferences to enable/disable rpc methods.
     *
     * @param methodName - The RPC method name to change the setting of.
     * @param isEnabled - true to enable the rpc method, false to disable it.
     */
    setDisabledRpcMethodPreference(methodName, isEnabled) {
        const { disabledRpcMethodPreferences } = this.state;
        const newDisabledRpcMethods = Object.assign(Object.assign({}, disabledRpcMethodPreferences), { [methodName]: isEnabled });
        this.update((state) => {
            state.disabledRpcMethodPreferences = newDisabledRpcMethods;
        });
    }
    /**
     * A setter for the user preferences to enable/disable fetch of multiple accounts balance.
     *
     * @param isMultiAccountBalancesEnabled - true to enable multiple accounts balance fetch, false to fetch only selectedAddress.
     */
    setIsMultiAccountBalancesEnabled(isMultiAccountBalancesEnabled) {
        this.update((state) => {
            state.isMultiAccountBalancesEnabled = isMultiAccountBalancesEnabled;
        });
    }
    /**
     * A setter for the user have the test networks visible/hidden.
     *
     * @param showTestNetworks - true to show test networks, false to hidden.
     */
    setShowTestNetworks(showTestNetworks) {
        this.update((state) => {
            state.showTestNetworks = showTestNetworks;
        });
    }
    /**
     * A setter for the user allow to be fetched IPFS content
     *
     * @param isIpfsGatewayEnabled - true to enable ipfs source
     */
    setIsIpfsGatewayEnabled(isIpfsGatewayEnabled) {
        this.update((state) => {
            state.isIpfsGatewayEnabled = isIpfsGatewayEnabled;
        });
    }
    /**
     * A setter for the user allow to be fetched IPFS content
     *
     * @param chainId - On hexadecimal format to enable the incoming transaction network
     * @param isIncomingTransactionNetworkEnable - true to enable incoming transactions
     */
    setEnableNetworkIncomingTransactions(chainId, isIncomingTransactionNetworkEnable) {
        if (Object.values(constants_1.ETHERSCAN_SUPPORTED_CHAIN_IDS).includes(chainId)) {
            this.update((state) => {
                state.showIncomingTransactions = Object.assign(Object.assign({}, this.state.showIncomingTransactions), { [chainId]: isIncomingTransactionNetworkEnable });
            });
        }
    }
}
exports.PreferencesController = PreferencesController;
_PreferencesController_instances = new WeakSet(), _PreferencesController_syncIdentities = function _PreferencesController_syncIdentities(addresses) {
    addresses = addresses.map((address) => (0, controller_utils_1.toChecksumHexAddress)(address));
    this.update((state) => {
        const { identities } = state;
        const newlyLost = {};
        for (const [address, identity] of Object.entries(identities)) {
            if (!addresses.includes(address)) {
                newlyLost[address] = identity;
                delete identities[address];
            }
        }
        for (const [address, identity] of Object.entries(newlyLost)) {
            state.lostIdentities[address] = identity;
        }
    });
    this.addIdentities(addresses);
    if (!addresses.includes(this.state.selectedAddress)) {
        this.update((state) => {
            state.selectedAddress = addresses[0];
        });
    }
};
exports.default = PreferencesController;
//# sourceMappingURL=PreferencesController.js.map