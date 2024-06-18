import type { ControllerGetStateAction, ControllerStateChangeEvent, RestrictedControllerMessenger } from '@metamask/base-controller';
import { BaseController } from '@metamask/base-controller';
import { InfuraNetworkType, NetworkType } from '@metamask/controller-utils';
import EthQuery from '@metamask/eth-query';
import type { SwappableProxy } from '@metamask/swappable-obj-proxy';
import type { Hex } from '@metamask/utils';
import { NetworkStatus } from './constants';
import type { AutoManagedNetworkClient, ProxyWithAccessibleTarget } from './create-auto-managed-network-client';
import type { BlockTracker, Provider, CustomNetworkClientConfiguration, InfuraNetworkClientConfiguration } from './types';
/**
 * @type ProviderConfig
 *
 * Configuration passed to web3-provider-engine
 * @property rpcUrl - RPC target URL.
 * @property type - Human-readable network name.
 * @property chainId - Network ID as per EIP-155.
 * @property ticker - Currency ticker.
 * @property nickname - Personalized network name.
 * @property id - Network Configuration Id.
 */
export declare type ProviderConfig = {
    rpcUrl?: string;
    type: NetworkType;
    chainId: Hex;
    ticker: string;
    nickname?: string;
    rpcPrefs?: {
        blockExplorerUrl?: string;
    };
    id?: NetworkConfigurationId;
};
export declare type Block = {
    baseFeePerGas?: string;
};
/**
 * Information about a network not held by any other part of state.
 */
export declare type NetworkMetadata = {
    /**
     * EIPs supported by the network.
     */
    EIPS: {
        [eipNumber: number]: boolean;
    };
    /**
     * Indicates the availability of the network
     */
    status: NetworkStatus;
};
/**
 * Custom RPC network information
 *
 * @property rpcUrl - RPC target URL.
 * @property chainId - Network ID as per EIP-155
 * @property nickname - Personalized network name.
 * @property ticker - Currency ticker.
 * @property rpcPrefs - Personalized preferences.
 */
export declare type NetworkConfiguration = {
    rpcUrl: string;
    chainId: Hex;
    ticker: string;
    nickname?: string;
    rpcPrefs?: {
        blockExplorerUrl: string;
    };
};
/**
 * The collection of network configurations in state.
 */
declare type NetworkConfigurations = Record<NetworkConfigurationId, NetworkConfiguration & {
    id: NetworkConfigurationId;
}>;
/**
 * `Object.keys()` is intentionally generic: it returns the keys of an object,
 * but it cannot make guarantees about the contents of that object, so the type
 * of the keys is merely `string[]`. While this is technically accurate, it is
 * also unnecessary if we have an object that we own and whose contents are
 * known exactly.
 *
 * TODO: Move to @metamask/utils.
 *
 * @param object - The object.
 * @returns The keys of an object, typed according to the type of the object
 * itself.
 */
export declare function knownKeysOf<K extends PropertyKey>(object: Partial<Record<K, any>>): K[];
/**
 * The string that uniquely identifies an Infura network client.
 */
declare type BuiltInNetworkClientId = InfuraNetworkType;
/**
 * The string that uniquely identifies a custom network client.
 */
declare type CustomNetworkClientId = string;
/**
 * The string that uniquely identifies a network client.
 */
export declare type NetworkClientId = BuiltInNetworkClientId | CustomNetworkClientId;
/**
 * Information about networks not held by any other part of state.
 */
export declare type NetworksMetadata = {
    [networkClientId: NetworkClientId]: NetworkMetadata;
};
/**
 * @type NetworkState
 *
 * Network controller state
 * @property providerConfig - RPC URL and network name provider settings of the currently connected network
 * @property properties - an additional set of network properties for the currently connected network
 * @property networkConfigurations - the full list of configured networks either preloaded or added by the user.
 */
export declare type NetworkState = {
    selectedNetworkClientId: NetworkClientId;
    providerConfig: ProviderConfig;
    networkConfigurations: NetworkConfigurations;
    networksMetadata: NetworksMetadata;
};
declare const name = "NetworkController";
/**
 * Represents the block tracker for the currently selected network. (Note that
 * this is a proxy around a proxy: the inner one exists so that the block
 * tracker doesn't have to exist until it's used, and the outer one exists so
 * that the currently selected network can change without consumers needing to
 * refresh the object reference to that network.)
 */
export declare type BlockTrackerProxy = SwappableProxy<ProxyWithAccessibleTarget<BlockTracker>>;
/**
 * Represents the provider for the currently selected network. (Note that this
 * is a proxy around a proxy: the inner one exists so that the provider doesn't
 * have to exist until it's used, and the outer one exists so that the currently
 * selected network can change without consumers needing to refresh the object
 * reference to that network.)
 */
export declare type ProviderProxy = SwappableProxy<ProxyWithAccessibleTarget<Provider>>;
export declare type NetworkControllerStateChangeEvent = ControllerStateChangeEvent<typeof name, NetworkState>;
/**
 * `networkWillChange` is published when the current network is about to be
 * switched, but the new provider has not been created and no state changes have
 * occurred yet.
 */
export declare type NetworkControllerNetworkWillChangeEvent = {
    type: 'NetworkController:networkWillChange';
    payload: [NetworkState];
};
/**
 * `networkDidChange` is published after a provider has been created for a newly
 * switched network (but before the network has been confirmed to be available).
 */
export declare type NetworkControllerNetworkDidChangeEvent = {
    type: 'NetworkController:networkDidChange';
    payload: [NetworkState];
};
/**
 * `infuraIsBlocked` is published after the network is switched to an Infura
 * network, but when Infura returns an error blocking the user based on their
 * location.
 */
export declare type NetworkControllerInfuraIsBlockedEvent = {
    type: 'NetworkController:infuraIsBlocked';
    payload: [];
};
/**
 * `infuraIsBlocked` is published either after the network is switched to an
 * Infura network and Infura does not return an error blocking the user based on
 * their location, or the network is switched to a non-Infura network.
 */
export declare type NetworkControllerInfuraIsUnblockedEvent = {
    type: 'NetworkController:infuraIsUnblocked';
    payload: [];
};
export declare type NetworkControllerEvents = NetworkControllerStateChangeEvent | NetworkControllerNetworkWillChangeEvent | NetworkControllerNetworkDidChangeEvent | NetworkControllerInfuraIsBlockedEvent | NetworkControllerInfuraIsUnblockedEvent;
export declare type NetworkControllerGetStateAction = ControllerGetStateAction<typeof name, NetworkState>;
export declare type NetworkControllerGetProviderConfigAction = {
    type: `NetworkController:getProviderConfig`;
    handler: () => ProviderConfig;
};
export declare type NetworkControllerGetEthQueryAction = {
    type: `NetworkController:getEthQuery`;
    handler: () => EthQuery | undefined;
};
export declare type NetworkControllerGetNetworkClientByIdAction = {
    type: `NetworkController:getNetworkClientById`;
    handler: NetworkController['getNetworkClientById'];
};
export declare type NetworkControllerGetEIP1559CompatibilityAction = {
    type: `NetworkController:getEIP1559Compatibility`;
    handler: NetworkController['getEIP1559Compatibility'];
};
export declare type NetworkControllerFindNetworkClientIdByChainIdAction = {
    type: `NetworkController:findNetworkClientIdByChainId`;
    handler: NetworkController['findNetworkClientIdByChainId'];
};
/**
 * Change the currently selected network to the given built-in network type.
 *
 * @deprecated This action has been replaced by `setActiveNetwork`, and will be
 * removed in a future release.
 */
export declare type NetworkControllerSetProviderTypeAction = {
    type: `NetworkController:setProviderType`;
    handler: NetworkController['setProviderType'];
};
export declare type NetworkControllerSetActiveNetworkAction = {
    type: `NetworkController:setActiveNetwork`;
    handler: NetworkController['setActiveNetwork'];
};
export declare type NetworkControllerGetNetworkConfigurationByNetworkClientId = {
    type: `NetworkController:getNetworkConfigurationByNetworkClientId`;
    handler: NetworkController['getNetworkConfigurationByNetworkClientId'];
};
export declare type NetworkControllerActions = NetworkControllerGetStateAction | NetworkControllerGetProviderConfigAction | NetworkControllerGetEthQueryAction | NetworkControllerGetNetworkClientByIdAction | NetworkControllerGetEIP1559CompatibilityAction | NetworkControllerFindNetworkClientIdByChainIdAction | NetworkControllerSetActiveNetworkAction | NetworkControllerSetProviderTypeAction | NetworkControllerGetNetworkConfigurationByNetworkClientId;
export declare type NetworkControllerMessenger = RestrictedControllerMessenger<typeof name, NetworkControllerActions, NetworkControllerEvents, never, never>;
export declare type NetworkControllerOptions = {
    messenger: NetworkControllerMessenger;
    trackMetaMetricsEvent: () => void;
    infuraProjectId: string;
    state?: Partial<NetworkState>;
};
export declare const defaultState: NetworkState;
declare type NetworkConfigurationId = string;
/**
 * The collection of auto-managed network clients that map to Infura networks.
 */
declare type AutoManagedBuiltInNetworkClientRegistry = Record<BuiltInNetworkClientId, AutoManagedNetworkClient<InfuraNetworkClientConfiguration>>;
/**
 * The collection of auto-managed network clients that map to Infura networks.
 */
declare type AutoManagedCustomNetworkClientRegistry = Record<CustomNetworkClientId, AutoManagedNetworkClient<CustomNetworkClientConfiguration>>;
/**
 * Controller that creates and manages an Ethereum network provider.
 */
export declare class NetworkController extends BaseController<typeof name, NetworkState, NetworkControllerMessenger> {
    #private;
    constructor({ messenger, state, infuraProjectId, trackMetaMetricsEvent, }: NetworkControllerOptions);
    /**
     * Accesses the provider and block tracker for the currently selected network.
     *
     * @returns The proxy and block tracker proxies.
     */
    getProviderAndBlockTracker(): {
        provider: SwappableProxy<ProxyWithAccessibleTarget<Provider>> | undefined;
        blockTracker: SwappableProxy<ProxyWithAccessibleTarget<BlockTracker>> | undefined;
    };
    /**
     * Returns all of the network clients that have been created so far, keyed by
     * their identifier in the network client registry. This collection represents
     * not only built-in networks but also any custom networks that consumers have
     * added.
     *
     * @returns The list of known network clients.
     */
    getNetworkClientRegistry(): AutoManagedBuiltInNetworkClientRegistry & AutoManagedCustomNetworkClientRegistry;
    /**
     * Returns the Infura network client with the given ID.
     *
     * @param infuraNetworkClientId - An Infura network client ID.
     * @returns The Infura network client.
     * @throws If an Infura network client does not exist with the given ID.
     */
    getNetworkClientById(infuraNetworkClientId: BuiltInNetworkClientId): AutoManagedNetworkClient<InfuraNetworkClientConfiguration>;
    /**
     * Returns the custom network client with the given ID.
     *
     * @param customNetworkClientId - A custom network client ID.
     * @returns The custom network client.
     * @throws If a custom network client does not exist with the given ID.
     */
    getNetworkClientById(customNetworkClientId: CustomNetworkClientId): AutoManagedNetworkClient<CustomNetworkClientConfiguration>;
    /**
     * Populates the network clients and establishes the initial network based on
     * the provider configuration in state.
     */
    initializeProvider(): Promise<void>;
    /**
     * Refreshes the network meta with EIP-1559 support and the network status
     * based on the given network client ID.
     *
     * @param networkClientId - The ID of the network client to update.
     */
    lookupNetworkByClientId(networkClientId: NetworkClientId): Promise<void>;
    /**
     * Performs side effects after switching to a network. If the network is
     * available, updates the network state with the network ID of the network and
     * stores whether the network supports EIP-1559; otherwise clears said
     * information about the network that may have been previously stored.
     *
     * @param networkClientId - (Optional) The ID of the network client to update.
     * If no ID is provided, uses the currently selected network.
     * @fires infuraIsBlocked if the network is Infura-supported and is blocking
     * requests.
     * @fires infuraIsUnblocked if the network is Infura-supported and is not
     * blocking requests, or if the network is not Infura-supported.
     */
    lookupNetwork(networkClientId?: NetworkClientId): Promise<void>;
    /**
     * Convenience method to update provider network type settings.
     *
     * @param type - Human readable network name.
     * @deprecated This has been replaced by `setActiveNetwork`, and will be
     * removed in a future release
     */
    setProviderType(type: InfuraNetworkType): Promise<void>;
    /**
     * Convenience method to update provider RPC settings.
     *
     * @param networkConfigurationIdOrType - The unique id for the network configuration to set as the active provider,
     * or the type of a built-in network.
     */
    setActiveNetwork(networkConfigurationIdOrType: string): Promise<void>;
    /**
     * Determines whether the network supports EIP-1559 by checking whether the
     * latest block has a `baseFeePerGas` property, then updates state
     * appropriately.
     *
     * @param networkClientId - The networkClientId to fetch the correct provider against which to check 1559 compatibility.
     * @returns A promise that resolves to true if the network supports EIP-1559
     * , false otherwise, or `undefined` if unable to determine the compatibility.
     */
    getEIP1559Compatibility(networkClientId?: NetworkClientId): Promise<boolean | undefined>;
    get1559CompatibilityWithNetworkClientId(networkClientId: NetworkClientId): Promise<boolean>;
    /**
     * Re-initializes the provider and block tracker for the current network.
     */
    resetConnection(): Promise<void>;
    /**
     * Returns a configuration object for the network identified by the given
     * network client ID. If given an Infura network type, constructs one based on
     * what we know about the network; otherwise attempts locates a network
     * configuration in state that corresponds to the network client ID.
     *
     * @param networkClientId - The network client ID.
     * @returns The configuration for the referenced network if one exists, or
     * undefined otherwise.
     */
    getNetworkConfigurationByNetworkClientId(networkClientId: NetworkClientId): NetworkConfiguration | undefined;
    /**
     * Adds a new custom network or updates the information for an existing
     * network.
     *
     * This may involve updating the `networkConfigurations` property in
     * state as well and/or adding a new network client to the network client
     * registry. The `rpcUrl` and `chainId` of the given object are used to
     * determine which action to take:
     *
     * - If the `rpcUrl` corresponds to an existing network configuration
     * (case-insensitively), then it is overwritten with the object. Furthermore,
     * if the `chainId` is different from the existing network configuration, then
     * the existing network client is replaced with a new one.
     * - If the `rpcUrl` does not correspond to an existing network configuration
     * (case-insensitively), then the object is used to add a new network
     * configuration along with a new network client.
     *
     * @param networkConfiguration - The network configuration to add or update.
     * @param options - Additional configuration options.
     * @param options.referrer - Used to create a metrics event; the site from which the call originated, or 'metamask' for internal calls.
     * @param options.source - Used to create a metrics event; where the event originated (i.e. from a dapp or from the network form).
     * @param options.setActive - If true, switches to the network upon adding or updating it (default: false).
     * @returns The ID for the added or updated network configuration.
     */
    upsertNetworkConfiguration(networkConfiguration: NetworkConfiguration, { referrer, source, setActive, }: {
        referrer: string;
        source: string;
        setActive?: boolean;
    }): Promise<string>;
    /**
     * Removes a custom network from state.
     *
     * This involves updating the `networkConfigurations` property in state as
     * well and removing the network client that corresponds to the network from
     * the client registry.
     *
     * @param networkConfigurationId - The ID of an existing network
     * configuration.
     */
    removeNetworkConfiguration(networkConfigurationId: string): void;
    /**
     * Switches to the previously selected network, assuming that there is one
     * (if not and `initializeProvider` has not been previously called, then this
     * method is equivalent to calling `resetConnection`).
     */
    rollbackToPreviousProvider(): Promise<void>;
    /**
     * Deactivates the controller, stopping any ongoing polling.
     *
     * In-progress requests will not be aborted.
     */
    destroy(): Promise<void>;
    /**
     * Updates the controller using the given backup data.
     *
     * @param backup - The data that has been backed up.
     * @param backup.networkConfigurations - Network configurations in the backup.
     */
    loadBackup({ networkConfigurations, }: {
        networkConfigurations: NetworkState['networkConfigurations'];
    }): void;
    /**
     * Searches for a network configuration ID with the given ChainID and returns it.
     *
     * @param chainId - ChainId to search for
     * @returns networkClientId of the network configuration with the given chainId
     */
    findNetworkClientIdByChainId(chainId: Hex): NetworkClientId;
}
export {};
//# sourceMappingURL=NetworkController.d.ts.map