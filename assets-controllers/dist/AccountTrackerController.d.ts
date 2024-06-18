import type { BaseConfig, BaseState } from '@metamask/base-controller';
import type { Provider } from '@metamask/eth-query';
import type { NetworkClientId, NetworkController, NetworkState } from '@metamask/network-controller';
import { StaticIntervalPollingControllerV1 } from '@metamask/polling-controller';
import type { PreferencesState } from '@metamask/preferences-controller';
/**
 * @type AccountInformation
 *
 * Account information object
 * @property balance - Hex string of an account balancec in wei
 */
export interface AccountInformation {
    balance: string;
}
/**
 * @type AccountTrackerConfig
 *
 * Account tracker controller configuration
 * @property provider - Provider used to create a new underlying EthQuery instance
 */
export interface AccountTrackerConfig extends BaseConfig {
    interval: number;
    provider?: Provider;
}
/**
 * @type AccountTrackerState
 *
 * Account tracker controller state
 * @property accounts - Map of addresses to account information
 */
export interface AccountTrackerState extends BaseState {
    accounts: {
        [address: string]: AccountInformation;
    };
    accountsByChainId: Record<string, {
        [address: string]: AccountInformation;
    }>;
}
/**
 * Controller that tracks the network balances for all user accounts.
 */
export declare class AccountTrackerController extends StaticIntervalPollingControllerV1<AccountTrackerConfig, AccountTrackerState> {
    #private;
    private _provider?;
    private readonly refreshMutex;
    private handle?;
    private syncAccounts;
    /**
     * Name of this controller used during composition
     */
    name: string;
    private readonly getIdentities;
    private readonly getSelectedAddress;
    private readonly getMultiAccountBalancesEnabled;
    private readonly getCurrentChainId;
    private readonly getNetworkClientById;
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
    constructor({ onPreferencesStateChange, getIdentities, getSelectedAddress, getMultiAccountBalancesEnabled, getCurrentChainId, getNetworkClientById, }: {
        onPreferencesStateChange: (listener: (preferencesState: PreferencesState) => void) => void;
        getIdentities: () => PreferencesState['identities'];
        getSelectedAddress: () => PreferencesState['selectedAddress'];
        getMultiAccountBalancesEnabled: () => PreferencesState['isMultiAccountBalancesEnabled'];
        getCurrentChainId: () => NetworkState['providerConfig']['chainId'];
        getNetworkClientById: NetworkController['getNetworkClientById'];
    }, config?: Partial<AccountTrackerConfig>, state?: Partial<AccountTrackerState>);
    /**
     * Sets a new provider.
     *
     * TODO: Replace this wth a method.
     *
     * @param provider - Provider used to create a new underlying EthQuery instance.
     */
    set provider(provider: Provider);
    get provider(): Provider;
    /**
     * Starts a new polling interval.
     *
     * @param interval - Polling interval trigger a 'refresh'.
     */
    poll(interval?: number): Promise<void>;
    /**
     * Refreshes the balances of the accounts using the networkClientId
     *
     * @param networkClientId - The network client ID used to get balances.
     */
    _executePoll(networkClientId: string): Promise<void>;
    /**
     * Refreshes the balances of the accounts depending on the multi-account setting.
     * If multi-account is disabled, only updates the selected account balance.
     * If multi-account is enabled, updates balances for all accounts.
     *
     * @param networkClientId - Optional networkClientId to fetch a network client with
     */
    refresh: (networkClientId?: NetworkClientId) => Promise<void>;
    /**
     * Fetches the balance of a given address from the blockchain.
     *
     * @param address - The account address to fetch the balance for.
     * @param ethQuery - The EthQuery instance to query getBalnce with.
     * @returns A promise that resolves to the balance in a hex string format.
     */
    private getBalanceFromChain;
    /**
     * Sync accounts balances with some additional addresses.
     *
     * @param addresses - the additional addresses, may be hardware wallet addresses.
     * @param networkClientId - Optional networkClientId to fetch a network client with.
     * @returns accounts - addresses with synced balance
     */
    syncBalanceWithAddresses(addresses: string[], networkClientId?: NetworkClientId): Promise<Record<string, {
        balance: string;
    }>>;
}
export default AccountTrackerController;
//# sourceMappingURL=AccountTrackerController.d.ts.map