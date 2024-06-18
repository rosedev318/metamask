/// <reference types="node" />
import type { AddApprovalRequest } from '@metamask/approval-controller';
import type { BaseConfig, BaseState, RestrictedControllerMessenger } from '@metamask/base-controller';
import { BaseControllerV1 } from '@metamask/base-controller';
import type { NetworkClientId, NetworkController, NetworkState } from '@metamask/network-controller';
import type { PreferencesState } from '@metamask/preferences-controller';
import type { Hex } from '@metamask/utils';
import { EventEmitter } from 'events';
import type { AssetsContractController } from './AssetsContractController';
import { Source } from './constants';
import type { ApiNftCreator, ApiNftLastSale } from './NftDetectionController';
declare type NFTStandardType = 'ERC721' | 'ERC1155';
declare type SuggestedNftMeta = {
    asset: {
        address: string;
        tokenId: string;
    } & NftMetadata;
    id: string;
    time: number;
    type: NFTStandardType;
    interactingAddress: string;
    origin: string;
};
export declare enum OpenSeaV2ChainIds {
    ethereum = "ethereum"
}
export declare type OpenSeaV2GetNftResponse = {
    nft: OpenSeaV2DetailedNft;
};
export declare type OpenSeaV2Nft = {
    identifier: string;
    collection: string;
    contract: string;
    token_standard: string;
    name: string;
    description: string;
    image_url?: string;
    metadata_url?: string;
    updated_at: string;
    is_disabled: boolean;
    is_nsfw: boolean;
};
export declare type OpenSeaV2DetailedNft = OpenSeaV2Nft & {
    animation_url?: string;
    is_suspicious: boolean;
    creator: string;
    traits: {
        trait_type: string;
        display_type?: string;
        max_value: string;
        trait_count?: number;
        value: number | string;
    }[];
    owners: {
        address: string;
        quantity: number;
    }[];
    rarity: {
        rank: number;
    };
};
export declare type OpenSeaV2ListNftsResponse = {
    nfts: OpenSeaV2Nft[];
    next?: string;
};
export declare type OpenSeaV2Contract = {
    address: string;
    chain: string;
    collection: string;
    contract_standard: string;
    name: string;
    total_supply?: number;
};
export declare type OpenSeaV2Collection = {
    collection: string;
    name: string;
    description?: string;
    image_url?: string;
    owner: string;
    category: string;
    is_disabled: boolean;
    is_nsfw: boolean;
    trait_offers_enabled: boolean;
    opensea_url: string;
    project_url?: string;
    wiki_url?: string;
    discord_url?: string;
    telegram_url?: string;
    twitter_username?: string;
    instagram_username?: string;
    total_supply?: number;
};
/**
 * @type Nft
 *
 * NFT representation
 * @property address - Hex address of a ERC721 contract
 * @property description - The NFT description
 * @property image - URI of custom NFT image associated with this tokenId
 * @property name - Name associated with this tokenId and contract address
 * @property tokenId - The NFT identifier
 * @property numberOfSales - Number of sales
 * @property backgroundColor - The background color to be displayed with the item
 * @property imagePreview - URI of a smaller image associated with this NFT
 * @property imageThumbnail - URI of a thumbnail image associated with this NFT
 * @property imageOriginal - URI of the original image associated with this NFT
 * @property animation - URI of a animation associated with this NFT
 * @property animationOriginal - URI of the original animation associated with this NFT
 * @property externalLink - External link containing additional information
 * @property creator - The NFT owner information object
 * @property isCurrentlyOwned - Boolean indicating whether the address/chainId combination where it's currently stored currently owns this NFT
 * @property transactionId - Transaction Id associated with the NFT
 */
export interface Nft extends NftMetadata {
    tokenId: string;
    address: string;
    isCurrentlyOwned?: boolean;
}
/**
 * @type NftContract
 *
 * NFT contract information representation
 * @property name - Contract name
 * @property logo - Contract logo
 * @property address - Contract address
 * @property symbol - Contract symbol
 * @property description - Contract description
 * @property totalSupply - Total supply of NFTs
 * @property assetContractType - The NFT type, it could be `semi-fungible` or `non-fungible`
 * @property createdDate - Creation date
 * @property schemaName - The schema followed by the contract, it could be `ERC721` or `ERC1155`
 * @property externalLink - External link containing additional information
 */
export interface NftContract {
    name?: string;
    logo?: string;
    address: string;
    symbol?: string;
    description?: string;
    totalSupply?: string;
    assetContractType?: string;
    createdDate?: string;
    schemaName?: string;
    externalLink?: string;
}
/**
 * @type NftMetadata
 *
 * NFT custom information
 * @property name - NFT custom name
 * @property description - The NFT description
 * @property numberOfSales - Number of sales
 * @property backgroundColor - The background color to be displayed with the item
 * @property image - Image custom image URI
 * @property imagePreview - URI of a smaller image associated with this NFT
 * @property imageThumbnail - URI of a thumbnail image associated with this NFT
 * @property imageOriginal - URI of the original image associated with this NFT
 * @property animation - URI of a animation associated with this NFT
 * @property animationOriginal - URI of the original animation associated with this NFT
 * @property externalLink - External link containing additional information
 * @property creator - The NFT owner information object
 * @property standard - NFT standard name for the NFT, e.g., ERC-721 or ERC-1155
 */
export interface NftMetadata {
    name: string | null;
    description: string | null;
    image: string | null;
    standard: string | null;
    favorite?: boolean;
    numberOfSales?: number;
    backgroundColor?: string;
    imagePreview?: string;
    imageThumbnail?: string;
    imageOriginal?: string;
    animation?: string;
    animationOriginal?: string;
    externalLink?: string;
    creator?: ApiNftCreator;
    lastSale?: ApiNftLastSale;
    transactionId?: string;
    tokenURI?: string | null;
}
/**
 * @type NftConfig
 *
 * NFT controller configuration
 * @property selectedAddress - Vault selected address
 */
export interface NftConfig extends BaseConfig {
    selectedAddress: string;
    chainId: Hex;
    ipfsGateway: string;
    openSeaEnabled: boolean;
    useIPFSSubdomains: boolean;
    isIpfsGatewayEnabled: boolean;
}
/**
 * @type NftState
 *
 * NFT controller state
 * @property allNftContracts - Object containing NFT contract information
 * @property allNfts - Object containing NFTs per account and network
 * @property ignoredNfts - List of NFTs that should be ignored
 */
export interface NftState extends BaseState {
    allNftContracts: {
        [key: string]: {
            [chainId: Hex]: NftContract[];
        };
    };
    allNfts: {
        [key: string]: {
            [chainId: Hex]: Nft[];
        };
    };
    ignoredNfts: Nft[];
}
interface NftAsset {
    address: string;
    tokenId: string;
}
/**
 * The name of the {@link NftController}.
 */
declare const controllerName = "NftController";
/**
 * The external actions available to the {@link NftController}.
 */
declare type AllowedActions = AddApprovalRequest;
/**
 * The messenger of the {@link NftController}.
 */
export declare type NftControllerMessenger = RestrictedControllerMessenger<typeof controllerName, AllowedActions, never, AllowedActions['type'], never>;
export declare const getDefaultNftState: () => NftState;
/**
 * Controller that stores assets and exposes convenience methods
 */
export declare class NftController extends BaseControllerV1<NftConfig, NftState> {
    private readonly mutex;
    private readonly messagingSystem;
    getNftApi({ contractAddress, tokenId, }: {
        contractAddress: string;
        tokenId: string;
    }): string;
    private getNftContractInformationApi;
    private getNftCollectionInformationApi;
    /**
     * Helper method to update nested state for allNfts and allNftContracts.
     *
     * @param newCollection - the modified piece of state to update in the controller's store
     * @param baseStateKey - The root key in the store to update.
     * @param passedConfig - An object containing the selectedAddress and chainId that are passed through the auto-detection flow.
     * @param passedConfig.userAddress - the address passed through the NFT detection flow to ensure assets are stored to the correct account
     * @param passedConfig.chainId - the chainId passed through the NFT detection flow to ensure assets are stored to the correct account
     */
    private updateNestedNftState;
    /**
     * Request individual NFT information from OpenSea API.
     *
     * @param contractAddress - Hex address of the NFT contract.
     * @param tokenId - The NFT identifier.
     * @returns Promise resolving to the current NFT name and image.
     */
    private getNftInformationFromApi;
    /**
     * Request individual NFT information from contracts that follows Metadata Interface.
     *
     * @param contractAddress - Hex address of the NFT contract.
     * @param tokenId - The NFT identifier.
     * @param networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @returns Promise resolving to the current NFT name and image.
     */
    private getNftInformationFromTokenURI;
    /**
     * Retrieve NFT uri with  metadata. TODO Update method to use IPFS.
     *
     * @param contractAddress - NFT contract address.
     * @param tokenId - NFT token id.
     * @param networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @returns Promise resolving NFT uri and token standard.
     */
    private getNftURIAndStandard;
    /**
     * Request individual NFT information (name, image url and description).
     *
     * @param contractAddress - Hex address of the NFT contract.
     * @param tokenId - The NFT identifier.
     * @param networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @returns Promise resolving to the current NFT name and image.
     */
    private getNftInformation;
    /**
     * Request NFT contract information from OpenSea API.
     *
     * @param contractAddress - Hex address of the NFT contract.
     * @returns Promise resolving to the current NFT name and image.
     */
    private getNftContractInformationFromApi;
    /**
     * Request NFT contract information from the contract itself.
     *
     * @param contractAddress - Hex address of the NFT contract.
     * @param networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @returns Promise resolving to the current NFT name and image.
     */
    private getNftContractInformationFromContract;
    /**
     * Request NFT contract information from OpenSea API.
     *
     * @param contractAddress - Hex address of the NFT contract.
     * @param networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @returns Promise resolving to the NFT contract name, image and description.
     */
    private getNftContractInformation;
    /**
     * Adds an individual NFT to the stored NFT list.
     *
     * @param tokenAddress - Hex address of the NFT contract.
     * @param tokenId - The NFT identifier.
     * @param nftMetadata - NFT optional information (name, image and description).
     * @param nftContract - An object containing contract data of the NFT being added.
     * @param chainId - The chainId of the network where the NFT is being added.
     * @param userAddress - The address of the account where the NFT is being added.
     * @param source - Whether the NFT was detected, added manually or suggested by a dapp.
     * @returns Promise resolving to the current NFT list.
     */
    private addIndividualNft;
    /**
     * Adds an NFT contract to the stored NFT contracts list.
     *
     * @param options - options.
     * @param options.tokenAddress - Hex address of the NFT contract.
     * @param options.userAddress - The address of the account where the NFT is being added.
     * @param options.networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @param options.source - Whether the NFT was detected, added manually or suggested by a dapp.
     * @returns Promise resolving to the current NFT contracts list.
     */
    private addNftContract;
    /**
     * Removes an individual NFT from the stored token list and saves it in ignored NFTs list.
     *
     * @param address - Hex address of the NFT contract.
     * @param tokenId - Token identifier of the NFT.
     * @param options - options.
     * @param options.chainId - The chainId of the network where the NFT is being removed.
     * @param options.userAddress - The address of the account where the NFT is being removed.
     */
    private removeAndIgnoreIndividualNft;
    /**
     * Removes an individual NFT from the stored token list.
     *
     * @param address - Hex address of the NFT contract.
     * @param tokenId - Token identifier of the NFT.
     * @param options - options.
     * @param options.chainId - The chainId of the network where the NFT is being removed.
     * @param options.userAddress - The address of the account where the NFT is being removed.
     */
    private removeIndividualNft;
    /**
     * Removes an NFT contract to the stored NFT contracts list.
     *
     * @param address - Hex address of the NFT contract.
     * @param options - options.
     * @param options.chainId - The chainId of the network where the NFT is being removed.
     * @param options.userAddress - The address of the account where the NFT is being removed.
     * @returns Promise resolving to the current NFT contracts list.
     */
    private removeNftContract;
    /**
     * EventEmitter instance used to listen to specific EIP747 events
     */
    hub: EventEmitter;
    /**
     * Optional API key to use with opensea
     */
    openSeaApiKey?: string;
    /**
     * Name of this controller used during composition
     */
    name: string;
    private readonly getERC721AssetName;
    private readonly getERC721AssetSymbol;
    private readonly getERC721TokenURI;
    private readonly getERC721OwnerOf;
    private readonly getERC1155BalanceOf;
    private readonly getERC1155TokenURI;
    private readonly getNetworkClientById;
    private readonly onNftAdded?;
    /**
     * Creates an NftController instance.
     *
     * @param options - The controller options.
     * @param options.chainId - The chain ID of the current network.
     * @param options.onPreferencesStateChange - Allows subscribing to preference controller state changes.
     * @param options.onNetworkStateChange - Allows subscribing to network controller state changes.
     * @param options.getERC721AssetName - Gets the name of the asset at the given address.
     * @param options.getERC721AssetSymbol - Gets the symbol of the asset at the given address.
     * @param options.getERC721TokenURI - Gets the URI of the ERC721 token at the given address, with the given ID.
     * @param options.getERC721OwnerOf - Get the owner of a ERC-721 NFT.
     * @param options.getERC1155BalanceOf - Gets balance of a ERC-1155 NFT.
     * @param options.getERC1155TokenURI - Gets the URI of the ERC1155 token at the given address, with the given ID.
     * @param options.getNetworkClientById - Gets the network client for the given networkClientId.
     * @param options.onNftAdded - Callback that is called when an NFT is added. Currently used pass data
     * for tracking the NFT added event.
     * @param options.messenger - The controller messenger.
     * @param config - Initial options used to configure this controller.
     * @param state - Initial state to set on this controller.
     */
    constructor({ chainId: initialChainId, onPreferencesStateChange, onNetworkStateChange, getERC721AssetName, getERC721AssetSymbol, getERC721TokenURI, getERC721OwnerOf, getERC1155BalanceOf, getERC1155TokenURI, getNetworkClientById, onNftAdded, messenger, }: {
        chainId: Hex;
        onPreferencesStateChange: (listener: (preferencesState: PreferencesState) => void) => void;
        onNetworkStateChange: (listener: (networkState: NetworkState) => void) => void;
        getERC721AssetName: AssetsContractController['getERC721AssetName'];
        getERC721AssetSymbol: AssetsContractController['getERC721AssetSymbol'];
        getERC721TokenURI: AssetsContractController['getERC721TokenURI'];
        getERC721OwnerOf: AssetsContractController['getERC721OwnerOf'];
        getERC1155BalanceOf: AssetsContractController['getERC1155BalanceOf'];
        getERC1155TokenURI: AssetsContractController['getERC1155TokenURI'];
        getNetworkClientById: NetworkController['getNetworkClientById'];
        onNftAdded?: (data: {
            address: string;
            symbol: string | undefined;
            tokenId: string;
            standard: string | null;
            source: string;
        }) => void;
        messenger: NftControllerMessenger;
    }, config?: Partial<BaseConfig>, state?: Partial<NftState>);
    private validateWatchNft;
    private getCorrectChainId;
    /**
     * Adds a new suggestedAsset to state. Parameters will be validated according to
     * asset type being watched. A `<suggestedNftMeta.id>:pending` hub event will be emitted once added.
     *
     * @param asset - The asset to be watched. For now ERC721 and ERC1155 tokens are accepted.
     * @param asset.address - The address of the asset contract.
     * @param asset.tokenId - The ID of the asset.
     * @param type - The asset type.
     * @param origin - Domain origin to register the asset from.
     * @param options - Options bag.
     * @param options.networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @param options.userAddress - The address of the account where the NFT is being added.
     * @returns Object containing a Promise resolving to the suggestedAsset address if accepted.
     */
    watchNft(asset: NftAsset, type: NFTStandardType, origin: string, { networkClientId, userAddress, }?: {
        networkClientId?: NetworkClientId;
        userAddress?: string;
    }): Promise<void>;
    /**
     * Sets an OpenSea API key to retrieve NFT information.
     *
     * @param openSeaApiKey - OpenSea API key.
     */
    setApiKey(openSeaApiKey: string): void;
    /**
     * Checks the ownership of a ERC-721 or ERC-1155 NFT for a given address.
     *
     * @param ownerAddress - User public address.
     * @param nftAddress - NFT contract address.
     * @param tokenId - NFT token ID.
     * @param options - Options bag.
     * @param options.networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @returns Promise resolving the NFT ownership.
     */
    isNftOwner(ownerAddress: string, nftAddress: string, tokenId: string, { networkClientId, }?: {
        networkClientId?: NetworkClientId;
    }): Promise<boolean>;
    /**
     * Verifies currently selected address owns entered NFT address/tokenId combo and
     * adds the NFT and respective NFT contract to the stored NFT and NFT contracts lists.
     *
     * @param address - Hex address of the NFT contract.
     * @param tokenId - The NFT identifier.
     * @param options - an object of arguments
     * @param options.userAddress - The address of the current user.
     * @param options.networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @param options.source - Whether the NFT was detected, added manually or suggested by a dapp.
     */
    addNftVerifyOwnership(address: string, tokenId: string, { userAddress, networkClientId, source, }?: {
        userAddress?: string;
        networkClientId?: NetworkClientId;
        source?: Source;
    }): Promise<void>;
    /**
     * Adds an NFT and respective NFT contract to the stored NFT and NFT contracts lists.
     *
     * @param tokenAddress - Hex address of the NFT contract.
     * @param tokenId - The NFT identifier.
     * @param options - an object of arguments
     * @param options.nftMetadata - NFT optional metadata.
     * @param options.userAddress - The address of the current user.
     * @param options.source - Whether the NFT was detected, added manually or suggested by a dapp.
     * @param options.networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @returns Promise resolving to the current NFT list.
     */
    addNft(tokenAddress: string, tokenId: string, { nftMetadata, userAddress, source, networkClientId, }?: {
        nftMetadata?: NftMetadata;
        userAddress?: string;
        source?: Source;
        networkClientId?: NetworkClientId;
    }): Promise<void>;
    /**
     * Removes an NFT from the stored token list.
     *
     * @param address - Hex address of the NFT contract.
     * @param tokenId - Token identifier of the NFT.
     * @param options - an object of arguments
     * @param options.networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @param options.userAddress - The address of the account where the NFT is being removed.
     */
    removeNft(address: string, tokenId: string, { networkClientId, userAddress, }?: {
        networkClientId?: NetworkClientId;
        userAddress?: string;
    }): void;
    /**
     * Removes an NFT from the stored token list and saves it in ignored NFTs list.
     *
     * @param address - Hex address of the NFT contract.
     * @param tokenId - Token identifier of the NFT.
     * @param options - an object of arguments
     * @param options.networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @param options.userAddress - The address of the account where the NFT is being removed.
     */
    removeAndIgnoreNft(address: string, tokenId: string, { networkClientId, userAddress, }?: {
        networkClientId?: NetworkClientId;
        userAddress?: string;
    }): void;
    /**
     * Removes all NFTs from the ignored list.
     */
    clearIgnoredNfts(): void;
    /**
     * Checks whether input NFT is still owned by the user
     * And updates the isCurrentlyOwned value on the NFT object accordingly.
     *
     * @param nft - The NFT object to check and update.
     * @param batch - A boolean indicating whether this method is being called as part of a batch or single update.
     * @param accountParams - The userAddress and chainId to check ownership against
     * @param accountParams.userAddress - the address passed through the confirmed transaction flow to ensure assets are stored to the correct account
     * @param accountParams.networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @returns the NFT with the updated isCurrentlyOwned value
     */
    checkAndUpdateSingleNftOwnershipStatus(nft: Nft, batch: boolean, { userAddress, networkClientId, }?: {
        networkClientId?: NetworkClientId;
        userAddress?: string;
    }): Promise<Nft>;
    /**
     * Checks whether NFTs associated with current selectedAddress/chainId combination are still owned by the user
     * And updates the isCurrentlyOwned value on each accordingly.
     * @param options - an object of arguments
     * @param options.networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @param options.userAddress - The address of the account where the NFT ownership status is checked/updated.
     */
    checkAndUpdateAllNftsOwnershipStatus({ networkClientId, userAddress, }?: {
        networkClientId?: NetworkClientId;
        userAddress?: string;
    }): Promise<void>;
    /**
     * Update NFT favorite status.
     *
     * @param address - Hex address of the NFT contract.
     * @param tokenId - Hex address of the NFT contract.
     * @param favorite - NFT new favorite status.
     * @param options - an object of arguments
     * @param options.networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @param options.userAddress - The address of the account where the NFT is being removed.
     */
    updateNftFavoriteStatus(address: string, tokenId: string, favorite: boolean, { networkClientId, userAddress, }?: {
        networkClientId?: NetworkClientId;
        userAddress?: string;
    }): void;
    /**
     * Returns an NFT by the address and token id.
     *
     * @param address - Hex address of the NFT contract.
     * @param tokenId - Number that represents the id of the token.
     * @param selectedAddress - Hex address of the user account.
     * @param chainId - Id of the current network.
     * @returns Object containing the NFT and its position in the array
     */
    findNftByAddressAndTokenId(address: string, tokenId: string, selectedAddress: string, chainId: Hex): {
        nft: Nft;
        index: number;
    } | null;
    /**
     * Update NFT data.
     *
     * @param nft - NFT object to find the right NFT to updates.
     * @param updates - NFT partial object to update properties of the NFT.
     * @param selectedAddress - Hex address of the user account.
     * @param chainId - Id of the current network.
     */
    updateNft(nft: Nft, updates: Partial<Nft>, selectedAddress: string, chainId: Hex): void;
    /**
     * Resets the transaction status of an NFT.
     *
     * @param transactionId - NFT transaction id.
     * @param selectedAddress - Hex address of the user account.
     * @param chainId - Id of the current network.
     * @returns a boolean indicating if the reset was well succeeded or not
     */
    resetNftTransactionStatusByTransactionId(transactionId: string, selectedAddress: string, chainId: Hex): boolean;
    _requestApproval(suggestedNftMeta: SuggestedNftMeta): Promise<unknown>;
}
export default NftController;
//# sourceMappingURL=NftController.d.ts.map