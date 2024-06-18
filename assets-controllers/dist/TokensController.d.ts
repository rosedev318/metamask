/// <reference types="node" />
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import type { AddApprovalRequest } from '@metamask/approval-controller';
import type { BaseConfig, BaseState, RestrictedControllerMessenger, ControllerGetStateAction, ControllerStateChangeEvent } from '@metamask/base-controller';
import { BaseControllerV1 } from '@metamask/base-controller';
import type { NetworkClientId, NetworkControllerGetNetworkClientByIdAction, NetworkControllerNetworkDidChangeEvent, Provider } from '@metamask/network-controller';
import type { PreferencesControllerStateChangeEvent } from '@metamask/preferences-controller';
import type { Hex } from '@metamask/utils';
import { EventEmitter } from 'events';
import type { TokenListStateChange } from './TokenListController';
import type { Token } from './TokenRatesController';
/**
 * @type TokensConfig
 *
 * Tokens controller configuration
 * @property selectedAddress - Vault selected address
 */
export interface TokensConfig extends BaseConfig {
    selectedAddress: string;
    chainId: Hex;
    provider: Provider | undefined;
}
/**
 * @type SuggestedAssetMeta
 *
 * Suggested asset by EIP747 meta data
 * @property id - Generated UUID associated with this suggested asset
 * @property time - Timestamp associated with this this suggested asset
 * @property type - Type type this suggested asset
 * @property asset - Asset suggested object
 * @property interactingAddress - Account address that requested watch asset
 */
declare type SuggestedAssetMeta = {
    id: string;
    time: number;
    type: string;
    asset: Token;
    interactingAddress: string;
};
/**
 * @type TokensState
 *
 * Assets controller state
 * @property tokens - List of tokens associated with the active network and address pair
 * @property ignoredTokens - List of ignoredTokens associated with the active network and address pair
 * @property detectedTokens - List of detected tokens associated with the active network and address pair
 * @property allTokens - Object containing tokens by network and account
 * @property allIgnoredTokens - Object containing hidden/ignored tokens by network and account
 * @property allDetectedTokens - Object containing tokens detected with non-zero balances
 */
export declare type TokensState = {
    tokens: Token[];
    ignoredTokens: string[];
    detectedTokens: Token[];
    allTokens: {
        [chainId: Hex]: {
            [key: string]: Token[];
        };
    };
    allIgnoredTokens: {
        [chainId: Hex]: {
            [key: string]: string[];
        };
    };
    allDetectedTokens: {
        [chainId: Hex]: {
            [key: string]: Token[];
        };
    };
};
/**
 * The name of the {@link TokensController}.
 */
declare const controllerName = "TokensController";
export declare type TokensControllerActions = TokensControllerGetStateAction | TokensControllerAddDetectedTokensAction;
export declare type TokensControllerGetStateAction = ControllerGetStateAction<typeof controllerName, TokensState>;
export declare type TokensControllerAddDetectedTokensAction = {
    type: `${typeof controllerName}:addDetectedTokens`;
    handler: TokensController['addDetectedTokens'];
};
/**
 * The external actions available to the {@link TokensController}.
 */
export declare type AllowedActions = AddApprovalRequest | NetworkControllerGetNetworkClientByIdAction;
export declare type TokensControllerStateChangeEvent = ControllerStateChangeEvent<typeof controllerName, TokensState>;
export declare type TokensControllerEvents = TokensControllerStateChangeEvent;
export declare type AllowedEvents = NetworkControllerNetworkDidChangeEvent | PreferencesControllerStateChangeEvent | TokenListStateChange;
/**
 * The messenger of the {@link TokensController}.
 */
export declare type TokensControllerMessenger = RestrictedControllerMessenger<typeof controllerName, TokensControllerActions | AllowedActions, TokensControllerEvents | AllowedEvents, AllowedActions['type'], AllowedEvents['type']>;
export declare const getDefaultTokensState: () => TokensState;
/**
 * Controller that stores assets and exposes convenience methods
 */
export declare class TokensController extends BaseControllerV1<TokensConfig, TokensState & BaseState> {
    private readonly mutex;
    private abortController;
    private readonly messagingSystem;
    /**
     * Fetch metadata for a token.
     *
     * @param tokenAddress - The address of the token.
     * @returns The token metadata.
     */
    private fetchTokenMetadata;
    /**
     * EventEmitter instance used to listen to specific EIP747 events
     */
    hub: EventEmitter;
    /**
     * Name of this controller used during composition
     */
    name: string;
    /**
     * Creates a TokensController instance.
     *
     * @param options - The controller options.
     * @param options.chainId - The chain ID of the current network.
     * @param options.config - Initial options used to configure this controller.
     * @param options.state - Initial state to set on this controller.
     * @param options.messenger - The controller messenger.
     */
    constructor({ chainId: initialChainId, config, state, messenger, }: {
        chainId: Hex;
        config?: Partial<TokensConfig>;
        state?: Partial<TokensState>;
        messenger: TokensControllerMessenger;
    });
    /**
     * Adds a token to the stored token list.
     *
     * @param options - The method argument object.
     * @param options.address - Hex address of the token contract.
     * @param options.symbol - Symbol of the token.
     * @param options.decimals - Number of decimals the token uses.
     * @param options.name - Name of the token.
     * @param options.image - Image of the token.
     * @param options.interactingAddress - The address of the account to add a token to.
     * @param options.networkClientId - Network Client ID.
     * @returns Current token list.
     */
    addToken({ address, symbol, decimals, name, image, interactingAddress, networkClientId, }: {
        address: string;
        symbol: string;
        decimals: number;
        name?: string;
        image?: string;
        interactingAddress?: string;
        networkClientId?: NetworkClientId;
    }): Promise<Token[]>;
    /**
     * Add a batch of tokens.
     *
     * @param tokensToImport - Array of tokens to import.
     * @param networkClientId - Optional network client ID used to determine interacting chain ID.
     */
    addTokens(tokensToImport: Token[], networkClientId?: NetworkClientId): Promise<void>;
    /**
     * Ignore a batch of tokens.
     *
     * @param tokenAddressesToIgnore - Array of token addresses to ignore.
     */
    ignoreTokens(tokenAddressesToIgnore: string[]): void;
    /**
     * Adds a batch of detected tokens to the stored token list.
     *
     * @param incomingDetectedTokens - Array of detected tokens to be added or updated.
     * @param detectionDetails - An object containing the chain ID and address of the currently selected network on which the incomingDetectedTokens were detected.
     * @param detectionDetails.selectedAddress - the account address on which the incomingDetectedTokens were detected.
     * @param detectionDetails.chainId - the chainId on which the incomingDetectedTokens were detected.
     */
    addDetectedTokens(incomingDetectedTokens: Token[], detectionDetails?: {
        selectedAddress: string;
        chainId: Hex;
    }): Promise<void>;
    /**
     * Adds isERC721 field to token object. This is called when a user attempts to add tokens that
     * were previously added which do not yet had isERC721 field.
     *
     * @param tokenAddress - The contract address of the token requiring the isERC721 field added.
     * @returns The new token object with the added isERC721 field.
     */
    updateTokenType(tokenAddress: string): Promise<Token>;
    /**
     * This is a function that updates the tokens name for the tokens name if it is not defined.
     *
     * @param tokenList - Represents the fetched token list from service API
     * @param tokenAttribute - Represents the token attribute that we want to update on the token list
     */
    private updateTokensAttribute;
    /**
     * Detects whether or not a token is ERC-721 compatible.
     *
     * @param tokenAddress - The token contract address.
     * @param networkClientId - Optional network client ID to fetch contract info with.
     * @returns A boolean indicating whether the token address passed in supports the EIP-721
     * interface.
     */
    _detectIsERC721(tokenAddress: string, networkClientId?: NetworkClientId): Promise<any>;
    _getProvider(networkClientId?: NetworkClientId): Web3Provider;
    _createEthersContract(tokenAddress: string, abi: string, networkClientId?: NetworkClientId): Contract;
    _generateRandomId(): string;
    /**
     * Adds a new suggestedAsset to the list of watched assets.
     * Parameters will be validated according to the asset type being watched.
     *
     * @param options - The method options.
     * @param options.asset - The asset to be watched. For now only ERC20 tokens are accepted.
     * @param options.type - The asset type.
     * @param options.interactingAddress - The address of the account that is requesting to watch the asset.
     * @param options.networkClientId - Network Client ID.
     * @returns A promise that resolves if the asset was watched successfully, and rejects otherwise.
     */
    watchAsset({ asset, type, interactingAddress, networkClientId, }: {
        asset: Token;
        type: string;
        interactingAddress?: string;
        networkClientId?: NetworkClientId;
    }): Promise<void>;
    /**
     * Takes a new tokens and ignoredTokens array for the current network/account combination
     * and returns new allTokens and allIgnoredTokens state to update to.
     *
     * @param params - Object that holds token params.
     * @param params.newTokens - The new tokens to set for the current network and selected account.
     * @param params.newIgnoredTokens - The new ignored tokens to set for the current network and selected account.
     * @param params.newDetectedTokens - The new detected tokens to set for the current network and selected account.
     * @param params.interactingAddress - The account address to use to store the tokens.
     * @param params.interactingChainId - The chainId to use to store the tokens.
     * @returns The updated `allTokens` and `allIgnoredTokens` state.
     */
    _getNewAllTokensState(params: {
        newTokens?: Token[];
        newIgnoredTokens?: string[];
        newDetectedTokens?: Token[];
        interactingAddress?: string;
        interactingChainId?: Hex;
    }): {
        newAllTokens: {
            [chainId: `0x${string}`]: {
                [key: string]: Token[];
            };
        };
        newAllIgnoredTokens: {
            [chainId: `0x${string}`]: {
                [key: string]: string[];
            };
        };
        newAllDetectedTokens: {
            [chainId: `0x${string}`]: {
                [key: string]: Token[];
            };
        };
    };
    /**
     * Removes all tokens from the ignored list.
     */
    clearIgnoredTokens(): void;
    _requestApproval(suggestedAssetMeta: SuggestedAssetMeta): Promise<unknown>;
}
export default TokensController;
//# sourceMappingURL=TokensController.d.ts.map