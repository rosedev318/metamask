import { Web3Provider } from '@ethersproject/providers';
import type { BaseConfig, BaseState } from '@metamask/base-controller';
import { BaseControllerV1 } from '@metamask/base-controller';
import type { NetworkClientId, NetworkState, NetworkController, Provider } from '@metamask/network-controller';
import type { PreferencesState } from '@metamask/preferences-controller';
import type { Hex } from '@metamask/utils';
import type BN from 'bn.js';
import { ERC20Standard } from './Standards/ERC20Standard';
import { ERC1155Standard } from './Standards/NftStandards/ERC1155/ERC1155Standard';
import { ERC721Standard } from './Standards/NftStandards/ERC721/ERC721Standard';
/**
 * Check if token detection is enabled for certain networks
 *
 * @param chainId - ChainID of network
 * @returns Whether the current network supports token detection
 */
export declare const SINGLE_CALL_BALANCES_ADDRESS_BY_CHAINID: Record<Hex, string>;
export declare const MISSING_PROVIDER_ERROR = "AssetsContractController failed to set the provider correctly. A provider must be set for this method to be available";
/**
 * @type AssetsContractConfig
 *
 * Assets Contract controller configuration
 * @property provider - Provider used to create a new web3 instance
 */
export interface AssetsContractConfig extends BaseConfig {
    provider: Provider | undefined;
    ipfsGateway: string;
    chainId: Hex;
}
/**
 * @type BalanceMap
 *
 * Key value object containing the balance for each tokenAddress
 * @property [tokenAddress] - Address of the token
 */
export interface BalanceMap {
    [tokenAddress: string]: BN;
}
/**
 * Controller that interacts with contracts on mainnet through web3
 */
export declare class AssetsContractController extends BaseControllerV1<AssetsContractConfig, BaseState> {
    private _provider?;
    /**
     * Name of this controller used during composition
     */
    name: string;
    private readonly getNetworkClientById;
    /**
     * Creates a AssetsContractController instance.
     *
     * @param options - The controller options.
     * @param options.chainId - The chain ID of the current network.
     * @param options.onPreferencesStateChange - Allows subscribing to preference controller state changes.
     * @param options.onNetworkDidChange - Allows subscribing to network controller networkDidChange events.
     * @param options.getNetworkClientById - Gets the network client with the given id from the NetworkController.
     * @param config - Initial options used to configure this controller.
     * @param state - Initial state to set on this controller.
     */
    constructor({ chainId: initialChainId, onPreferencesStateChange, onNetworkDidChange, getNetworkClientById, }: {
        chainId: Hex;
        onPreferencesStateChange: (listener: (preferencesState: PreferencesState) => void) => void;
        onNetworkDidChange: (listener: (networkState: NetworkState) => void) => void;
        getNetworkClientById: NetworkController['getNetworkClientById'];
    }, config?: Partial<AssetsContractConfig>, state?: Partial<BaseState>);
    /**
     * Sets a new provider.
     *
     * TODO: Replace this wth a method.
     *
     * @property provider - Provider used to create a new underlying Web3 instance
     */
    set provider(provider: Provider);
    get provider(): Provider;
    /**
     * Get the relevant provider instance.
     *
     * @param networkClientId - Network Client ID.
     * @returns Web3Provider instance.
     */
    getProvider(networkClientId?: NetworkClientId): Web3Provider;
    /**
     * Get the relevant chain ID.
     *
     * @param networkClientId - Network Client ID used to get the provider.
     * @returns Hex chain ID.
     */
    getChainId(networkClientId?: NetworkClientId): Hex;
    /**
     * Get a ERC20Standard instance using the relevant provider instance.
     *
     * @param networkClientId - Network Client ID used to get the provider.
     * @returns ERC20Standard instance.
     */
    getERC20Standard(networkClientId?: NetworkClientId): ERC20Standard;
    /**
     * Get a ERC721Standard instance using the relevant provider instance.
     *
     * @param networkClientId - Network Client ID used to get the provider.
     * @returns ERC721Standard instance.
     */
    getERC721Standard(networkClientId?: NetworkClientId): ERC721Standard;
    /**
     * Get a ERC1155Standard instance using the relevant provider instance.
     *
     * @param networkClientId - Network Client ID used to get the provider.
     * @returns ERC1155Standard instance.
     */
    getERC1155Standard(networkClientId?: NetworkClientId): ERC1155Standard;
    /**
     * Get balance or count for current account on specific asset contract.
     *
     * @param address - Asset ERC20 contract address.
     * @param selectedAddress - Current account public address.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to BN object containing balance for current account on specific asset contract.
     */
    getERC20BalanceOf(address: string, selectedAddress: string, networkClientId?: NetworkClientId): Promise<BN>;
    /**
     * Query for the decimals for a given ERC20 asset.
     *
     * @param address - ERC20 asset contract address.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to the 'decimals'.
     */
    getERC20TokenDecimals(address: string, networkClientId?: NetworkClientId): Promise<string>;
    /**
     * Query for the name for a given ERC20 asset.
     *
     * @param address - ERC20 asset contract address.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to the 'decimals'.
     */
    getERC20TokenName(address: string, networkClientId?: NetworkClientId): Promise<string>;
    /**
     * Enumerate assets assigned to an owner.
     *
     * @param address - ERC721 asset contract address.
     * @param selectedAddress - Current account public address.
     * @param index - An NFT counter less than `balanceOf(selectedAddress)`.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to token identifier for the 'index'th asset assigned to 'selectedAddress'.
     */
    getERC721NftTokenId(address: string, selectedAddress: string, index: number, networkClientId?: NetworkClientId): Promise<string>;
    /**
     * Enumerate assets assigned to an owner.
     *
     * @param tokenAddress - ERC721 asset contract address.
     * @param userAddress - Current account public address.
     * @param tokenId - ERC721 asset identifier.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to an object containing the token standard and a set of details which depend on which standard the token supports.
     */
    getTokenStandardAndDetails(tokenAddress: string, userAddress?: string, tokenId?: string, networkClientId?: NetworkClientId): Promise<{
        standard: string;
        tokenURI?: string | undefined;
        symbol?: string | undefined;
        name?: string | undefined;
        decimals?: string | undefined;
        balance?: BN | undefined;
    }>;
    /**
     * Query for tokenURI for a given ERC721 asset.
     *
     * @param address - ERC721 asset contract address.
     * @param tokenId - ERC721 asset identifier.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to the 'tokenURI'.
     */
    getERC721TokenURI(address: string, tokenId: string, networkClientId?: NetworkClientId): Promise<string>;
    /**
     * Query for name for a given asset.
     *
     * @param address - ERC721 or ERC20 asset contract address.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to the 'name'.
     */
    getERC721AssetName(address: string, networkClientId?: NetworkClientId): Promise<string>;
    /**
     * Query for symbol for a given asset.
     *
     * @param address - ERC721 or ERC20 asset contract address.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to the 'symbol'.
     */
    getERC721AssetSymbol(address: string, networkClientId?: NetworkClientId): Promise<string>;
    /**
     * Query for owner for a given ERC721 asset.
     *
     * @param address - ERC721 asset contract address.
     * @param tokenId - ERC721 asset identifier.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to the owner address.
     */
    getERC721OwnerOf(address: string, tokenId: string, networkClientId?: NetworkClientId): Promise<string>;
    /**
     * Query for tokenURI for a given asset.
     *
     * @param address - ERC1155 asset contract address.
     * @param tokenId - ERC1155 asset identifier.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to the 'tokenURI'.
     */
    getERC1155TokenURI(address: string, tokenId: string, networkClientId?: NetworkClientId): Promise<string>;
    /**
     * Query for balance of a given ERC 1155 token.
     *
     * @param userAddress - Wallet public address.
     * @param nftAddress - ERC1155 asset contract address.
     * @param nftId - ERC1155 asset identifier.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to the 'balanceOf'.
     */
    getERC1155BalanceOf(userAddress: string, nftAddress: string, nftId: string, networkClientId?: NetworkClientId): Promise<BN>;
    /**
     * Transfer single ERC1155 token.
     *
     * @param nftAddress - ERC1155 token address.
     * @param senderAddress - ERC1155 token sender.
     * @param recipientAddress - ERC1155 token recipient.
     * @param nftId - ERC1155 token id.
     * @param qty - Quantity of tokens to be sent.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to the 'transferSingle' ERC1155 token.
     */
    transferSingleERC1155(nftAddress: string, senderAddress: string, recipientAddress: string, nftId: string, qty: string, networkClientId?: NetworkClientId): Promise<void>;
    /**
     * Get the token balance for a list of token addresses in a single call. Only non-zero balances
     * are returned.
     *
     * @param selectedAddress - The address to check token balances for.
     * @param tokensToDetect - The token addresses to detect balances for.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns The list of non-zero token balances.
     */
    getBalancesInSingleCall(selectedAddress: string, tokensToDetect: string[], networkClientId?: NetworkClientId): Promise<BalanceMap>;
}
export default AssetsContractController;
//# sourceMappingURL=AssetsContractController.d.ts.map