import { BaseController, type ControllerStateChangeEvent, type ControllerGetStateAction, type RestrictedControllerMessenger } from '@metamask/base-controller';
import type { KeyringControllerStateChangeEvent } from '@metamask/keyring-controller';
import { ETHERSCAN_SUPPORTED_CHAIN_IDS } from './constants';
/**
 * A representation of a MetaMask identity
 */
export declare type Identity = {
    /**
     * The address of the identity
     */
    address: string;
    /**
     * The timestamp for when this identity was first added
     */
    importTime?: number;
    /**
     * The name of the identity
     */
    name: string;
};
/**
 * A type union of the name for each chain that is supported by Etherscan or
 * an Etherscan-compatible service.
 */
export declare type EtherscanSupportedChains = keyof typeof ETHERSCAN_SUPPORTED_CHAIN_IDS;
/**
 * A type union of the chain ID for each chain that is supported by Etherscan
 * or an Etherscan-compatible service.
 */
export declare type EtherscanSupportedHexChainId = (typeof ETHERSCAN_SUPPORTED_CHAIN_IDS)[EtherscanSupportedChains];
/**
 * Preferences controller state
 */
export declare type PreferencesState = {
    /**
     * A map of RPC method names to enabled state (true is enabled, false is disabled)
     */
    disabledRpcMethodPreferences: {
        [methodName: string]: boolean;
    };
    /**
     * Map of specific features to enable or disable
     */
    featureFlags: {
        [feature: string]: boolean;
    };
    /**
     * Map of addresses to Identity objects
     */
    identities: {
        [address: string]: Identity;
    };
    /**
     * The configured IPFS gateway
     */
    ipfsGateway: string;
    /**
     * Controls whether IPFS is enabled or not
     */
    isIpfsGatewayEnabled: boolean;
    /**
     * Controls whether multi-account balances are enabled or not
     */
    isMultiAccountBalancesEnabled: boolean;
    /**
     * Map of lost addresses to Identity objects
     */
    lostIdentities: {
        [address: string]: Identity;
    };
    /**
     * Controls whether the OpenSea API is used
     */
    openSeaEnabled: boolean;
    /**
     * Controls whether "security alerts" are enabled
     */
    securityAlertsEnabled: boolean;
    /**
     * The current selected address
     */
    selectedAddress: string;
    /**
     * Controls whether incoming transactions are enabled, per-chain (for Etherscan-supported chains)
     */
    showIncomingTransactions: {
        [chainId in EtherscanSupportedHexChainId]: boolean;
    };
    /**
     * Controls whether test networks are shown in the wallet
     */
    showTestNetworks: boolean;
    /**
     * Controls whether NFT detection is enabled
     */
    useNftDetection: boolean;
    /**
     * Controls whether token detection is enabled
     */
    useTokenDetection: boolean;
};
declare const name = "PreferencesController";
export declare type PreferencesControllerGetStateAction = ControllerGetStateAction<typeof name, PreferencesState>;
export declare type PreferencesControllerStateChangeEvent = ControllerStateChangeEvent<typeof name, PreferencesState>;
export declare type PreferencesControllerActions = PreferencesControllerGetStateAction;
export declare type PreferencesControllerEvents = PreferencesControllerStateChangeEvent;
export declare type AllowedEvents = KeyringControllerStateChangeEvent;
export declare type PreferencesControllerMessenger = RestrictedControllerMessenger<typeof name, PreferencesControllerActions, PreferencesControllerEvents | AllowedEvents, never, AllowedEvents['type']>;
/**
 * Get the default PreferencesController state.
 *
 * @returns The default PreferencesController state.
 */
export declare function getDefaultPreferencesState(): {
    disabledRpcMethodPreferences: {
        eth_sign: boolean;
    };
    featureFlags: {};
    identities: {};
    ipfsGateway: string;
    isIpfsGatewayEnabled: boolean;
    isMultiAccountBalancesEnabled: boolean;
    lostIdentities: {};
    openSeaEnabled: boolean;
    securityAlertsEnabled: boolean;
    selectedAddress: string;
    showIncomingTransactions: {
        "0x1": boolean;
        "0x5": boolean;
        "0x38": boolean;
        "0x61": boolean;
        "0xa": boolean;
        "0xaa37dc": boolean;
        "0x89": boolean;
        "0x13881": boolean;
        "0xa86a": boolean;
        "0xa869": boolean;
        "0xfa": boolean;
        "0xfa2": boolean;
        "0xaa36a7": boolean;
        "0xe704": boolean;
        "0xe708": boolean;
        "0x504": boolean;
        "0x507": boolean;
        "0x505": boolean;
        "0x64": boolean;
    };
    showTestNetworks: boolean;
    useNftDetection: boolean;
    useTokenDetection: boolean;
};
/**
 * Controller that stores shared settings and exposes convenience methods
 */
export declare class PreferencesController extends BaseController<typeof name, PreferencesState, PreferencesControllerMessenger> {
    #private;
    /**
     * Creates a PreferencesController instance.
     *
     * @param args - Arguments
     * @param args.messenger - The preferences controller messenger.
     * @param args.state - Preferences controller state.
     */
    constructor({ messenger, state, }: {
        messenger: PreferencesControllerMessenger;
        state?: Partial<PreferencesState>;
    });
    /**
     * Adds identities to state.
     *
     * @param addresses - List of addresses to use to generate new identities.
     */
    addIdentities(addresses: string[]): void;
    /**
     * Removes an identity from state.
     *
     * @param address - Address of the identity to remove.
     */
    removeIdentity(address: string): void;
    /**
     * Associates a new label with an identity.
     *
     * @param address - Address of the identity to associate.
     * @param label - New label to assign.
     */
    setAccountLabel(address: string, label: string): void;
    /**
     * Enable or disable a specific feature flag.
     *
     * @param feature - Feature to toggle.
     * @param activated - Value to assign.
     */
    setFeatureFlag(feature: string, activated: boolean): void;
    /**
     * Sets selected address.
     *
     * @param selectedAddress - Ethereum address.
     */
    setSelectedAddress(selectedAddress: string): void;
    /**
     * Sets new IPFS gateway.
     *
     * @param ipfsGateway - IPFS gateway string.
     */
    setIpfsGateway(ipfsGateway: string): void;
    /**
     * Toggle the token detection setting.
     *
     * @param useTokenDetection - Boolean indicating user preference on token detection.
     */
    setUseTokenDetection(useTokenDetection: boolean): void;
    /**
     * Toggle the NFT detection setting.
     *
     * @param useNftDetection - Boolean indicating user preference on NFT detection.
     */
    setUseNftDetection(useNftDetection: boolean): void;
    /**
     * Toggle the opensea enabled setting.
     *
     * @param openSeaEnabled - Boolean indicating user preference on using OpenSea's API.
     */
    setOpenSeaEnabled(openSeaEnabled: boolean): void;
    /**
     * Toggle the security alert enabled setting.
     *
     * @param securityAlertsEnabled - Boolean indicating user preference on using security alerts.
     */
    setSecurityAlertsEnabled(securityAlertsEnabled: boolean): void;
    /**
     * A setter for the user preferences to enable/disable rpc methods.
     *
     * @param methodName - The RPC method name to change the setting of.
     * @param isEnabled - true to enable the rpc method, false to disable it.
     */
    setDisabledRpcMethodPreference(methodName: string, isEnabled: boolean): void;
    /**
     * A setter for the user preferences to enable/disable fetch of multiple accounts balance.
     *
     * @param isMultiAccountBalancesEnabled - true to enable multiple accounts balance fetch, false to fetch only selectedAddress.
     */
    setIsMultiAccountBalancesEnabled(isMultiAccountBalancesEnabled: boolean): void;
    /**
     * A setter for the user have the test networks visible/hidden.
     *
     * @param showTestNetworks - true to show test networks, false to hidden.
     */
    setShowTestNetworks(showTestNetworks: boolean): void;
    /**
     * A setter for the user allow to be fetched IPFS content
     *
     * @param isIpfsGatewayEnabled - true to enable ipfs source
     */
    setIsIpfsGatewayEnabled(isIpfsGatewayEnabled: boolean): void;
    /**
     * A setter for the user allow to be fetched IPFS content
     *
     * @param chainId - On hexadecimal format to enable the incoming transaction network
     * @param isIncomingTransactionNetworkEnable - true to enable incoming transactions
     */
    setEnableNetworkIncomingTransactions(chainId: EtherscanSupportedHexChainId, isIncomingTransactionNetworkEnable: boolean): void;
}
export default PreferencesController;
//# sourceMappingURL=PreferencesController.d.ts.map