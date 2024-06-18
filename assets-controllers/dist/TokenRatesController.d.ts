import type { BaseConfig, BaseState } from '@metamask/base-controller';
import type { NetworkClientId, NetworkController, NetworkState } from '@metamask/network-controller';
import { StaticIntervalPollingControllerV1 } from '@metamask/polling-controller';
import type { PreferencesState } from '@metamask/preferences-controller';
import { type Hex } from '@metamask/utils';
import type { AbstractTokenPricesService } from './token-prices-service/abstract-token-prices-service';
import type { TokensState } from './TokensController';
/**
 * @type Token
 *
 * Token representation
 * @property address - Hex address of the token contract
 * @property decimals - Number of decimals the token uses
 * @property symbol - Symbol of the token
 * @property image - Image of the token, url or bit32 image
 */
export interface Token {
    address: string;
    decimals: number;
    symbol: string;
    aggregators?: string[];
    image?: string;
    balanceError?: unknown;
    isERC721?: boolean;
    name?: string;
}
/**
 * @type TokenRatesConfig
 *
 * Token rates controller configuration
 * @property interval - Polling interval used to fetch new token rates
 * @property nativeCurrency - Current native currency selected to use base of rates
 * @property chainId - Current network chainId
 * @property tokens - List of tokens to track exchange rates for
 * @property threshold - Threshold to invalidate the supportedChains
 */
export interface TokenRatesConfig extends BaseConfig {
    interval: number;
    nativeCurrency: string;
    chainId: Hex;
    selectedAddress: string;
    allTokens: {
        [chainId: Hex]: {
            [key: string]: Token[];
        };
    };
    allDetectedTokens: {
        [chainId: Hex]: {
            [key: string]: Token[];
        };
    };
    threshold: number;
}
export interface ContractExchangeRates {
    [address: string]: number | undefined;
}
/**
 * @type TokenRatesState
 *
 * Token rates controller state
 * @property contractExchangeRates - Hash of token contract addresses to exchange rates (single globally selected chain, will be deprecated soon)
 * @property contractExchangeRatesByChainId - Hash of token contract addresses to exchange rates keyed by chain ID and native currency (ticker)
 */
export interface TokenRatesState extends BaseState {
    contractExchangeRates: ContractExchangeRates;
    contractExchangeRatesByChainId: Record<Hex, Record<string, ContractExchangeRates>>;
}
/**
 * Controller that passively polls on a set interval for token-to-fiat exchange rates
 * for tokens stored in the TokensController
 */
export declare class TokenRatesController extends StaticIntervalPollingControllerV1<TokenRatesConfig, TokenRatesState> {
    #private;
    private handle?;
    /**
     * Name of this controller used during composition
     */
    name: string;
    private readonly getNetworkClientById;
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
    constructor({ interval, threshold, getNetworkClientById, chainId: initialChainId, ticker: initialTicker, selectedAddress: initialSelectedAddress, onPreferencesStateChange, onTokensStateChange, onNetworkStateChange, tokenPricesService, }: {
        interval?: number;
        threshold?: number;
        getNetworkClientById: NetworkController['getNetworkClientById'];
        chainId: Hex;
        ticker: string;
        selectedAddress: string;
        onPreferencesStateChange: (listener: (preferencesState: PreferencesState) => void) => void;
        onTokensStateChange: (listener: (tokensState: TokensState) => void) => void;
        onNetworkStateChange: (listener: (networkState: NetworkState) => void) => void;
        tokenPricesService: AbstractTokenPricesService;
    }, config?: Partial<TokenRatesConfig>, state?: Partial<TokenRatesState>);
    /**
     * Start (or restart) polling.
     */
    start(): Promise<void>;
    /**
     * Stop polling.
     */
    stop(): void;
    /**
     * Updates exchange rates for all tokens.
     */
    updateExchangeRates(): Promise<void>;
    /**
     * Updates exchange rates for all tokens.
     *
     * @param options - The options to fetch exchange rates.
     * @param options.chainId - The chain ID.
     * @param options.nativeCurrency - The ticker for the chain.
     */
    updateExchangeRatesByChainId({ chainId, nativeCurrency, }: {
        chainId: Hex;
        nativeCurrency: string;
    }): Promise<void>;
    /**
     * Updates token rates for the given networkClientId
     *
     * @param networkClientId - The network client ID used to get a ticker value.
     * @returns The controller state.
     */
    _executePoll(networkClientId: NetworkClientId): Promise<void>;
}
export default TokenRatesController;
//# sourceMappingURL=TokenRatesController.d.ts.map