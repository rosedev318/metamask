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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftController = exports.getDefaultNftState = exports.OpenSeaV2ChainIds = void 0;
const address_1 = require("@ethersproject/address");
const base_controller_1 = require("@metamask/base-controller");
const controller_utils_1 = require("@metamask/controller-utils");
const rpc_errors_1 = require("@metamask/rpc-errors");
const utils_1 = require("@metamask/utils");
const async_mutex_1 = require("async-mutex");
const bn_js_1 = __importDefault(require("bn.js"));
const events_1 = require("events");
const uuid_1 = require("uuid");
const assetsUtil_1 = require("./assetsUtil");
const constants_1 = require("./constants");
var OpenSeaV2ChainIds;
(function (OpenSeaV2ChainIds) {
    OpenSeaV2ChainIds["ethereum"] = "ethereum";
})(OpenSeaV2ChainIds = exports.OpenSeaV2ChainIds || (exports.OpenSeaV2ChainIds = {}));
const ALL_NFTS_STATE_KEY = 'allNfts';
const ALL_NFTS_CONTRACTS_STATE_KEY = 'allNftContracts';
/**
 * The name of the {@link NftController}.
 */
const controllerName = 'NftController';
const getDefaultNftState = () => {
    return {
        allNftContracts: {},
        allNfts: {},
        ignoredNfts: [],
    };
};
exports.getDefaultNftState = getDefaultNftState;
/**
 * Controller that stores assets and exposes convenience methods
 */
class NftController extends base_controller_1.BaseControllerV1 {
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
    constructor({ chainId: initialChainId, onPreferencesStateChange, onNetworkStateChange, getERC721AssetName, getERC721AssetSymbol, getERC721TokenURI, getERC721OwnerOf, getERC1155BalanceOf, getERC1155TokenURI, getNetworkClientById, onNftAdded, messenger, }, config, state) {
        super(config, state);
        this.mutex = new async_mutex_1.Mutex();
        /**
         * EventEmitter instance used to listen to specific EIP747 events
         */
        this.hub = new events_1.EventEmitter();
        /**
         * Name of this controller used during composition
         */
        this.name = 'NftController';
        this.defaultConfig = {
            selectedAddress: '',
            chainId: initialChainId,
            ipfsGateway: controller_utils_1.IPFS_DEFAULT_GATEWAY_URL,
            openSeaEnabled: false,
            useIPFSSubdomains: true,
            isIpfsGatewayEnabled: true,
        };
        this.defaultState = (0, exports.getDefaultNftState)();
        this.initialize();
        this.getERC721AssetName = getERC721AssetName;
        this.getERC721AssetSymbol = getERC721AssetSymbol;
        this.getERC721TokenURI = getERC721TokenURI;
        this.getERC721OwnerOf = getERC721OwnerOf;
        this.getERC1155BalanceOf = getERC1155BalanceOf;
        this.getERC1155TokenURI = getERC1155TokenURI;
        this.getNetworkClientById = getNetworkClientById;
        this.onNftAdded = onNftAdded;
        this.messagingSystem = messenger;
        onPreferencesStateChange(({ selectedAddress, ipfsGateway, openSeaEnabled, isIpfsGatewayEnabled, }) => {
            this.configure({
                selectedAddress,
                ipfsGateway,
                openSeaEnabled,
                isIpfsGatewayEnabled,
            });
        });
        onNetworkStateChange(({ providerConfig }) => {
            const { chainId } = providerConfig;
            this.configure({ chainId });
        });
    }
    getNftApi({ contractAddress, tokenId, }) {
        return `${controller_utils_1.OPENSEA_PROXY_URL}/chain/${OpenSeaV2ChainIds.ethereum}/contract/${contractAddress}/nfts/${tokenId}`;
    }
    getNftContractInformationApi({ contractAddress, }) {
        return `${controller_utils_1.OPENSEA_PROXY_URL}/chain/${OpenSeaV2ChainIds.ethereum}/contract/${contractAddress}`;
    }
    getNftCollectionInformationApi({ collectionSlug, }) {
        return `${controller_utils_1.OPENSEA_PROXY_URL}/collections/${collectionSlug}`;
    }
    /**
     * Helper method to update nested state for allNfts and allNftContracts.
     *
     * @param newCollection - the modified piece of state to update in the controller's store
     * @param baseStateKey - The root key in the store to update.
     * @param passedConfig - An object containing the selectedAddress and chainId that are passed through the auto-detection flow.
     * @param passedConfig.userAddress - the address passed through the NFT detection flow to ensure assets are stored to the correct account
     * @param passedConfig.chainId - the chainId passed through the NFT detection flow to ensure assets are stored to the correct account
     */
    updateNestedNftState(newCollection, baseStateKey, { userAddress, chainId }) {
        const { [baseStateKey]: oldState } = this.state;
        const addressState = oldState[userAddress];
        const newAddressState = Object.assign(Object.assign({}, addressState), { [chainId]: newCollection });
        const newState = Object.assign(Object.assign({}, oldState), { [userAddress]: newAddressState });
        this.update({
            [baseStateKey]: newState,
        });
    }
    /**
     * Request individual NFT information from OpenSea API.
     *
     * @param contractAddress - Hex address of the NFT contract.
     * @param tokenId - The NFT identifier.
     * @returns Promise resolving to the current NFT name and image.
     */
    getNftInformationFromApi(contractAddress, tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO Parameterize this by chainId for non-mainnet token detection
            // Attempt to fetch the data with the proxy
            const nftInformation = yield (0, controller_utils_1.fetchWithErrorHandling)({
                url: this.getNftApi({
                    contractAddress,
                    tokenId,
                }),
            });
            // if we were still unable to fetch the data we return out the default/null of `NftMetadata`
            if (!(nftInformation === null || nftInformation === void 0 ? void 0 : nftInformation.nft)) {
                return {
                    name: null,
                    description: null,
                    image: null,
                    standard: null,
                };
            }
            // if we've reached this point, we have successfully fetched some data for nftInformation
            // now we reconfigure the data to conform to the `NftMetadata` type for storage.
            const { num_sales, background_color, image_url, image_preview_url, image_thumbnail_url, image_original_url, animation_url, animation_original_url, name, description, external_link, creator, last_sale, asset_contract: { schema_name }, } = (0, assetsUtil_1.mapOpenSeaDetailedNftV2ToV1)(nftInformation.nft);
            /* istanbul ignore next */
            const nftMetadata = Object.assign({}, { name: name || null }, { description: description || null }, { image: image_url || null }, creator && { creator }, num_sales && { numberOfSales: num_sales }, background_color && { backgroundColor: background_color }, image_preview_url && { imagePreview: image_preview_url }, image_thumbnail_url && { imageThumbnail: image_thumbnail_url }, image_original_url && { imageOriginal: image_original_url }, animation_url && { animation: animation_url }, animation_original_url && {
                animationOriginal: animation_original_url,
            }, external_link && { externalLink: external_link }, last_sale && { lastSale: last_sale }, schema_name && { standard: schema_name });
            return nftMetadata;
        });
    }
    /**
     * Request individual NFT information from contracts that follows Metadata Interface.
     *
     * @param contractAddress - Hex address of the NFT contract.
     * @param tokenId - The NFT identifier.
     * @param networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @returns Promise resolving to the current NFT name and image.
     */
    getNftInformationFromTokenURI(contractAddress, tokenId, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ipfsGateway, useIPFSSubdomains, isIpfsGatewayEnabled } = this.config;
            const result = yield this.getNftURIAndStandard(contractAddress, tokenId, networkClientId);
            let tokenURI = result[0];
            const standard = result[1];
            const hasIpfsTokenURI = tokenURI.startsWith('ipfs://');
            if (hasIpfsTokenURI && !isIpfsGatewayEnabled) {
                return {
                    image: null,
                    name: null,
                    description: null,
                    standard: standard || null,
                    favorite: false,
                    tokenURI: tokenURI !== null && tokenURI !== void 0 ? tokenURI : null,
                };
            }
            const isDisplayNFTMediaToggleEnabled = this.config.openSeaEnabled;
            if (!hasIpfsTokenURI && !isDisplayNFTMediaToggleEnabled) {
                return {
                    image: null,
                    name: null,
                    description: null,
                    standard: standard || null,
                    favorite: false,
                    tokenURI: tokenURI !== null && tokenURI !== void 0 ? tokenURI : null,
                };
            }
            if (hasIpfsTokenURI) {
                tokenURI = (0, assetsUtil_1.getFormattedIpfsUrl)(ipfsGateway, tokenURI, useIPFSSubdomains);
            }
            try {
                const object = yield (0, controller_utils_1.handleFetch)(tokenURI);
                // TODO: Check image_url existence. This is not part of EIP721 nor EIP1155
                const image = Object.prototype.hasOwnProperty.call(object, 'image')
                    ? 'image'
                    : /* istanbul ignore next */ 'image_url';
                return {
                    image: object[image],
                    name: object.name,
                    description: object.description,
                    standard,
                    favorite: false,
                    tokenURI: tokenURI !== null && tokenURI !== void 0 ? tokenURI : null,
                };
            }
            catch (_a) {
                return {
                    image: null,
                    name: null,
                    description: null,
                    standard: standard || null,
                    favorite: false,
                    tokenURI: tokenURI !== null && tokenURI !== void 0 ? tokenURI : null,
                };
            }
        });
    }
    /**
     * Retrieve NFT uri with  metadata. TODO Update method to use IPFS.
     *
     * @param contractAddress - NFT contract address.
     * @param tokenId - NFT token id.
     * @param networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @returns Promise resolving NFT uri and token standard.
     */
    getNftURIAndStandard(contractAddress, tokenId, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            // try ERC721 uri
            try {
                const uri = yield this.getERC721TokenURI(contractAddress, tokenId, networkClientId);
                return [uri, controller_utils_1.ERC721];
            }
            catch (_a) {
                // Ignore error
            }
            // try ERC1155 uri
            try {
                const tokenURI = yield this.getERC1155TokenURI(contractAddress, tokenId, networkClientId);
                /**
                 * According to EIP1155 the URI value allows for ID substitution
                 * in case the string `{id}` exists.
                 * https://eips.ethereum.org/EIPS/eip-1155#metadata
                 */
                if (!tokenURI.includes('{id}')) {
                    return [tokenURI, controller_utils_1.ERC1155];
                }
                const hexTokenId = (0, utils_1.remove0x)((0, controller_utils_1.BNToHex)(new bn_js_1.default(tokenId)))
                    .padStart(64, '0')
                    .toLowerCase();
                return [tokenURI.replace('{id}', hexTokenId), controller_utils_1.ERC1155];
            }
            catch (_b) {
                // Ignore error
            }
            return ['', ''];
        });
    }
    /**
     * Request individual NFT information (name, image url and description).
     *
     * @param contractAddress - Hex address of the NFT contract.
     * @param tokenId - The NFT identifier.
     * @param networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @returns Promise resolving to the current NFT name and image.
     */
    getNftInformation(contractAddress, tokenId, networkClientId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            const chainId = this.getCorrectChainId({
                networkClientId,
            });
            const [blockchainMetadata, openSeaMetadata] = yield Promise.all([
                (0, controller_utils_1.safelyExecute)(() => this.getNftInformationFromTokenURI(contractAddress, tokenId, networkClientId)),
                this.config.openSeaEnabled && chainId === '0x1'
                    ? (0, controller_utils_1.safelyExecute)(() => this.getNftInformationFromApi(contractAddress, tokenId))
                    : undefined,
            ]);
            return Object.assign(Object.assign({}, openSeaMetadata), { name: (_b = (_a = blockchainMetadata === null || blockchainMetadata === void 0 ? void 0 : blockchainMetadata.name) !== null && _a !== void 0 ? _a : openSeaMetadata === null || openSeaMetadata === void 0 ? void 0 : openSeaMetadata.name) !== null && _b !== void 0 ? _b : null, description: (_d = (_c = blockchainMetadata === null || blockchainMetadata === void 0 ? void 0 : blockchainMetadata.description) !== null && _c !== void 0 ? _c : openSeaMetadata === null || openSeaMetadata === void 0 ? void 0 : openSeaMetadata.description) !== null && _d !== void 0 ? _d : null, image: (_f = (_e = blockchainMetadata === null || blockchainMetadata === void 0 ? void 0 : blockchainMetadata.image) !== null && _e !== void 0 ? _e : openSeaMetadata === null || openSeaMetadata === void 0 ? void 0 : openSeaMetadata.image) !== null && _f !== void 0 ? _f : null, standard: (_h = (_g = blockchainMetadata === null || blockchainMetadata === void 0 ? void 0 : blockchainMetadata.standard) !== null && _g !== void 0 ? _g : openSeaMetadata === null || openSeaMetadata === void 0 ? void 0 : openSeaMetadata.standard) !== null && _h !== void 0 ? _h : null, tokenURI: (_j = blockchainMetadata === null || blockchainMetadata === void 0 ? void 0 : blockchainMetadata.tokenURI) !== null && _j !== void 0 ? _j : null });
        });
    }
    /**
     * Request NFT contract information from OpenSea API.
     *
     * @param contractAddress - Hex address of the NFT contract.
     * @returns Promise resolving to the current NFT name and image.
     */
    getNftContractInformationFromApi(contractAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            /* istanbul ignore if */
            const apiNftContractObject = yield (0, controller_utils_1.fetchWithErrorHandling)({
                url: this.getNftContractInformationApi({
                    contractAddress,
                }),
            });
            // If we successfully fetched the contract
            if (apiNftContractObject) {
                // Then fetch some additional details from the collection
                const collection = yield (0, controller_utils_1.fetchWithErrorHandling)({
                    url: this.getNftCollectionInformationApi({
                        collectionSlug: apiNftContractObject.collection,
                    }),
                });
                return (0, assetsUtil_1.mapOpenSeaContractV2ToV1)(apiNftContractObject, collection);
            }
            // If we've reached this point we were unable to fetch data from either the proxy or opensea so we return
            // the default/null of ApiNftContract
            return {
                address: contractAddress,
                asset_contract_type: null,
                created_date: null,
                schema_name: null,
                symbol: null,
                total_supply: null,
                description: null,
                external_link: null,
                collection: {
                    name: null,
                    image_url: null,
                },
            };
        });
    }
    /**
     * Request NFT contract information from the contract itself.
     *
     * @param contractAddress - Hex address of the NFT contract.
     * @param networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @returns Promise resolving to the current NFT name and image.
     */
    getNftContractInformationFromContract(contractAddress, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [name, symbol] = yield Promise.all([
                this.getERC721AssetName(contractAddress, networkClientId),
                this.getERC721AssetSymbol(contractAddress, networkClientId),
            ]);
            return {
                collection: { name },
                symbol,
                address: contractAddress,
            };
        });
    }
    /**
     * Request NFT contract information from OpenSea API.
     *
     * @param contractAddress - Hex address of the NFT contract.
     * @param networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @returns Promise resolving to the NFT contract name, image and description.
     */
    getNftContractInformation(contractAddress, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainId = this.getCorrectChainId({
                networkClientId,
            });
            const [blockchainContractData, openSeaContractData] = yield Promise.all([
                (0, controller_utils_1.safelyExecute)(() => this.getNftContractInformationFromContract(contractAddress, networkClientId)),
                this.config.openSeaEnabled && chainId === '0x1'
                    ? (0, controller_utils_1.safelyExecute)(() => this.getNftContractInformationFromApi(contractAddress))
                    : undefined,
            ]);
            if (blockchainContractData || openSeaContractData) {
                return Object.assign(Object.assign(Object.assign({ address: contractAddress }, openSeaContractData), blockchainContractData), { collection: Object.assign(Object.assign({ name: null, image_url: null }, openSeaContractData === null || openSeaContractData === void 0 ? void 0 : openSeaContractData.collection), blockchainContractData === null || blockchainContractData === void 0 ? void 0 : blockchainContractData.collection) });
            }
            /* istanbul ignore next */
            return {
                address: contractAddress,
                asset_contract_type: null,
                created_date: null,
                schema_name: null,
                symbol: null,
                total_supply: null,
                description: null,
                external_link: null,
                collection: { name: null, image_url: null },
            };
        });
    }
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
    addIndividualNft(tokenAddress, tokenId, nftMetadata, nftContract, chainId, userAddress, source) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Remove unused return
            const releaseLock = yield this.mutex.acquire();
            try {
                tokenAddress = (0, controller_utils_1.toChecksumHexAddress)(tokenAddress);
                const { allNfts } = this.state;
                const nfts = ((_a = allNfts[userAddress]) === null || _a === void 0 ? void 0 : _a[chainId]) || [];
                const existingEntry = nfts.find((nft) => nft.address.toLowerCase() === tokenAddress.toLowerCase() &&
                    nft.tokenId === tokenId);
                if (existingEntry) {
                    const differentMetadata = (0, assetsUtil_1.compareNftMetadata)(nftMetadata, existingEntry);
                    if (differentMetadata || !existingEntry.isCurrentlyOwned) {
                        // TODO: Switch to indexToUpdate
                        const indexToRemove = nfts.findIndex((nft) => nft.address.toLowerCase() === tokenAddress.toLowerCase() &&
                            nft.tokenId === tokenId);
                        /* istanbul ignore next */
                        if (indexToRemove !== -1) {
                            nfts.splice(indexToRemove, 1);
                        }
                    }
                    else {
                        return nfts;
                    }
                }
                const newEntry = Object.assign({ address: tokenAddress, tokenId, favorite: (existingEntry === null || existingEntry === void 0 ? void 0 : existingEntry.favorite) || false, isCurrentlyOwned: true }, nftMetadata);
                const newNfts = [...nfts, newEntry];
                this.updateNestedNftState(newNfts, ALL_NFTS_STATE_KEY, {
                    chainId,
                    userAddress,
                });
                if (this.onNftAdded) {
                    this.onNftAdded({
                        address: tokenAddress,
                        symbol: nftContract.symbol,
                        tokenId: tokenId.toString(),
                        standard: nftMetadata.standard,
                        source,
                    });
                }
                return newNfts;
            }
            finally {
                releaseLock();
            }
        });
    }
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
    addNftContract({ tokenAddress, userAddress, networkClientId, source, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const releaseLock = yield this.mutex.acquire();
            try {
                tokenAddress = (0, controller_utils_1.toChecksumHexAddress)(tokenAddress);
                const { allNftContracts } = this.state;
                const chainId = this.getCorrectChainId({
                    networkClientId,
                });
                const nftContracts = ((_a = allNftContracts[userAddress]) === null || _a === void 0 ? void 0 : _a[chainId]) || [];
                const existingEntry = nftContracts.find((nftContract) => nftContract.address.toLowerCase() === tokenAddress.toLowerCase());
                if (existingEntry) {
                    return nftContracts;
                }
                // this doesn't work currently for detection if the user switches networks while the detection is processing
                // will be fixed once detection uses networkClientIds
                const contractInformation = yield this.getNftContractInformation(tokenAddress, networkClientId);
                const { asset_contract_type, created_date, schema_name, symbol, total_supply, description, external_link, collection: { name, image_url }, } = contractInformation;
                // If the nft is auto-detected we want some valid metadata to be present
                if (source === constants_1.Source.Detected &&
                    'address' in contractInformation &&
                    typeof contractInformation.address === 'string' &&
                    'collection' in contractInformation &&
                    contractInformation.collection.name === null &&
                    'image_url' in contractInformation.collection &&
                    contractInformation.collection.image_url === null &&
                    Object.entries(contractInformation).every(([key, value]) => {
                        return key === 'address' || key === 'collection' || !value;
                    })) {
                    return nftContracts;
                }
                /* istanbul ignore next */
                const newEntry = Object.assign({}, { address: tokenAddress }, description && { description }, name && { name }, image_url && { logo: image_url }, symbol && { symbol }, total_supply !== null &&
                    typeof total_supply !== 'undefined' && { totalSupply: total_supply }, asset_contract_type && { assetContractType: asset_contract_type }, created_date && { createdDate: created_date }, schema_name && { schemaName: schema_name }, external_link && { externalLink: external_link });
                const newNftContracts = [...nftContracts, newEntry];
                this.updateNestedNftState(newNftContracts, ALL_NFTS_CONTRACTS_STATE_KEY, {
                    chainId,
                    userAddress,
                });
                return newNftContracts;
            }
            finally {
                releaseLock();
            }
        });
    }
    /**
     * Removes an individual NFT from the stored token list and saves it in ignored NFTs list.
     *
     * @param address - Hex address of the NFT contract.
     * @param tokenId - Token identifier of the NFT.
     * @param options - options.
     * @param options.chainId - The chainId of the network where the NFT is being removed.
     * @param options.userAddress - The address of the account where the NFT is being removed.
     */
    removeAndIgnoreIndividualNft(address, tokenId, { chainId, userAddress, }) {
        var _a;
        address = (0, controller_utils_1.toChecksumHexAddress)(address);
        const { allNfts, ignoredNfts } = this.state;
        const newIgnoredNfts = [...ignoredNfts];
        const nfts = ((_a = allNfts[userAddress]) === null || _a === void 0 ? void 0 : _a[chainId]) || [];
        const newNfts = nfts.filter((nft) => {
            if (nft.address.toLowerCase() === address.toLowerCase() &&
                nft.tokenId === tokenId) {
                const alreadyIgnored = newIgnoredNfts.find((c) => c.address === address && c.tokenId === tokenId);
                !alreadyIgnored && newIgnoredNfts.push(nft);
                return false;
            }
            return true;
        });
        this.updateNestedNftState(newNfts, ALL_NFTS_STATE_KEY, {
            userAddress,
            chainId,
        });
        this.update({
            ignoredNfts: newIgnoredNfts,
        });
    }
    /**
     * Removes an individual NFT from the stored token list.
     *
     * @param address - Hex address of the NFT contract.
     * @param tokenId - Token identifier of the NFT.
     * @param options - options.
     * @param options.chainId - The chainId of the network where the NFT is being removed.
     * @param options.userAddress - The address of the account where the NFT is being removed.
     */
    removeIndividualNft(address, tokenId, { chainId, userAddress }) {
        var _a;
        address = (0, controller_utils_1.toChecksumHexAddress)(address);
        const { allNfts } = this.state;
        const nfts = ((_a = allNfts[userAddress]) === null || _a === void 0 ? void 0 : _a[chainId]) || [];
        const newNfts = nfts.filter((nft) => !(nft.address.toLowerCase() === address.toLowerCase() &&
            nft.tokenId === tokenId));
        this.updateNestedNftState(newNfts, ALL_NFTS_STATE_KEY, {
            userAddress,
            chainId,
        });
    }
    /**
     * Removes an NFT contract to the stored NFT contracts list.
     *
     * @param address - Hex address of the NFT contract.
     * @param options - options.
     * @param options.chainId - The chainId of the network where the NFT is being removed.
     * @param options.userAddress - The address of the account where the NFT is being removed.
     * @returns Promise resolving to the current NFT contracts list.
     */
    removeNftContract(address, { chainId, userAddress }) {
        var _a;
        address = (0, controller_utils_1.toChecksumHexAddress)(address);
        const { allNftContracts } = this.state;
        const nftContracts = ((_a = allNftContracts[userAddress]) === null || _a === void 0 ? void 0 : _a[chainId]) || [];
        const newNftContracts = nftContracts.filter((nftContract) => !(nftContract.address.toLowerCase() === address.toLowerCase()));
        this.updateNestedNftState(newNftContracts, ALL_NFTS_CONTRACTS_STATE_KEY, {
            chainId,
            userAddress,
        });
        return newNftContracts;
    }
    validateWatchNft(asset, type, userAddress, { networkClientId } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { address: contractAddress, tokenId } = asset;
            // Validate parameters
            if (!type) {
                throw rpc_errors_1.rpcErrors.invalidParams('Asset type is required');
            }
            if (type !== controller_utils_1.ERC721 && type !== controller_utils_1.ERC1155) {
                throw rpc_errors_1.rpcErrors.invalidParams(`Non NFT asset type ${type} not supported by watchNft`);
            }
            if (!contractAddress || !tokenId) {
                throw rpc_errors_1.rpcErrors.invalidParams('Both address and tokenId are required');
            }
            if (!(0, address_1.isAddress)(contractAddress)) {
                throw rpc_errors_1.rpcErrors.invalidParams('Invalid address');
            }
            if (!/^\d+$/u.test(tokenId)) {
                throw rpc_errors_1.rpcErrors.invalidParams('Invalid tokenId');
            }
            // Check if the user owns the suggested NFT
            try {
                const isOwner = yield this.isNftOwner(userAddress, contractAddress, tokenId, { networkClientId });
                if (!isOwner) {
                    throw rpc_errors_1.rpcErrors.invalidInput('Suggested NFT is not owned by the selected account');
                }
            }
            catch (error) {
                // error thrown here: "Unable to verify ownership. Possibly because the standard is not supported or the user's currently selected network does not match the chain of the asset in question."
                if (error instanceof Error) {
                    throw rpc_errors_1.rpcErrors.resourceUnavailable(error.message);
                }
                throw error;
            }
        });
    }
    // temporary method to get the correct chainId until we remove chainId from the config & the chainId arg from the detection logic
    // Just a helper method to prefer the networkClient chainId first then the chainId argument and then finally the config chainId
    getCorrectChainId({ networkClientId, }) {
        if (networkClientId) {
            return this.getNetworkClientById(networkClientId).configuration.chainId;
        }
        return this.config.chainId;
    }
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
    watchNft(asset, type, origin, { networkClientId, userAddress = this.config.selectedAddress, } = {
        userAddress: this.config.selectedAddress,
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateWatchNft(asset, type, userAddress);
            const nftMetadata = yield this.getNftInformation(asset.address, asset.tokenId, networkClientId);
            if (nftMetadata.standard && nftMetadata.standard !== type) {
                throw rpc_errors_1.rpcErrors.invalidInput(`Suggested NFT of type ${nftMetadata.standard} does not match received type ${type}`);
            }
            const suggestedNftMeta = {
                asset: Object.assign(Object.assign({}, asset), nftMetadata),
                type,
                id: (0, uuid_1.v4)(),
                time: Date.now(),
                interactingAddress: userAddress,
                origin,
            };
            yield this._requestApproval(suggestedNftMeta);
            const { address, tokenId } = asset;
            const { name, standard, description, image } = nftMetadata;
            yield this.addNft(address, tokenId, {
                nftMetadata: {
                    name: name !== null && name !== void 0 ? name : null,
                    description: description !== null && description !== void 0 ? description : null,
                    image: image !== null && image !== void 0 ? image : null,
                    standard: standard !== null && standard !== void 0 ? standard : null,
                },
                userAddress,
                source: constants_1.Source.Dapp,
                networkClientId,
            });
        });
    }
    /**
     * Sets an OpenSea API key to retrieve NFT information.
     *
     * @param openSeaApiKey - OpenSea API key.
     */
    setApiKey(openSeaApiKey) {
        this.openSeaApiKey = openSeaApiKey;
    }
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
    isNftOwner(ownerAddress, nftAddress, tokenId, { networkClientId, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Checks the ownership for ERC-721.
            try {
                const owner = yield this.getERC721OwnerOf(nftAddress, tokenId, networkClientId);
                return ownerAddress.toLowerCase() === owner.toLowerCase();
                // eslint-disable-next-line no-empty
            }
            catch (_a) {
                // Ignore ERC-721 contract error
            }
            // Checks the ownership for ERC-1155.
            try {
                const balance = yield this.getERC1155BalanceOf(ownerAddress, nftAddress, tokenId, networkClientId);
                return !balance.isZero();
                // eslint-disable-next-line no-empty
            }
            catch (_b) {
                // Ignore ERC-1155 contract error
            }
            throw new Error(`Unable to verify ownership. Possibly because the standard is not supported or the user's currently selected network does not match the chain of the asset in question.`);
        });
    }
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
    addNftVerifyOwnership(address, tokenId, { userAddress = this.config.selectedAddress, networkClientId, source, } = {
        userAddress: this.config.selectedAddress,
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isNftOwner(userAddress, address, tokenId, {
                networkClientId,
            }))) {
                throw new Error('This NFT is not owned by the user');
            }
            yield this.addNft(address, tokenId, {
                networkClientId,
                userAddress,
                source,
            });
        });
    }
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
    addNft(tokenAddress, tokenId, { nftMetadata, userAddress = this.config.selectedAddress, source = constants_1.Source.Custom, networkClientId, } = { userAddress: this.config.selectedAddress }) {
        return __awaiter(this, void 0, void 0, function* () {
            tokenAddress = (0, controller_utils_1.toChecksumHexAddress)(tokenAddress);
            const chainId = this.getCorrectChainId({ networkClientId });
            const newNftContracts = yield this.addNftContract({
                tokenAddress,
                userAddress,
                networkClientId,
                source,
            });
            nftMetadata =
                nftMetadata ||
                    (yield this.getNftInformation(tokenAddress, tokenId, networkClientId));
            // If NFT contract was not added, do not add individual NFT
            const nftContract = newNftContracts.find((contract) => contract.address.toLowerCase() === tokenAddress.toLowerCase());
            // If NFT contract information, add individual NFT
            if (nftContract) {
                yield this.addIndividualNft(tokenAddress, tokenId, nftMetadata, nftContract, chainId, userAddress, source);
            }
        });
    }
    /**
     * Removes an NFT from the stored token list.
     *
     * @param address - Hex address of the NFT contract.
     * @param tokenId - Token identifier of the NFT.
     * @param options - an object of arguments
     * @param options.networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @param options.userAddress - The address of the account where the NFT is being removed.
     */
    removeNft(address, tokenId, { networkClientId, userAddress = this.config.selectedAddress, } = {
        userAddress: this.config.selectedAddress,
    }) {
        var _a;
        const chainId = this.getCorrectChainId({ networkClientId });
        address = (0, controller_utils_1.toChecksumHexAddress)(address);
        this.removeIndividualNft(address, tokenId, { chainId, userAddress });
        const { allNfts } = this.state;
        const nfts = ((_a = allNfts[userAddress]) === null || _a === void 0 ? void 0 : _a[chainId]) || [];
        const remainingNft = nfts.find((nft) => nft.address.toLowerCase() === address.toLowerCase());
        if (!remainingNft) {
            this.removeNftContract(address, { chainId, userAddress });
        }
    }
    /**
     * Removes an NFT from the stored token list and saves it in ignored NFTs list.
     *
     * @param address - Hex address of the NFT contract.
     * @param tokenId - Token identifier of the NFT.
     * @param options - an object of arguments
     * @param options.networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @param options.userAddress - The address of the account where the NFT is being removed.
     */
    removeAndIgnoreNft(address, tokenId, { networkClientId, userAddress = this.config.selectedAddress, } = {
        userAddress: this.config.selectedAddress,
    }) {
        var _a;
        const chainId = this.getCorrectChainId({ networkClientId });
        address = (0, controller_utils_1.toChecksumHexAddress)(address);
        this.removeAndIgnoreIndividualNft(address, tokenId, {
            chainId,
            userAddress,
        });
        const { allNfts } = this.state;
        const nfts = ((_a = allNfts[userAddress]) === null || _a === void 0 ? void 0 : _a[chainId]) || [];
        const remainingNft = nfts.find((nft) => nft.address.toLowerCase() === address.toLowerCase());
        if (!remainingNft) {
            this.removeNftContract(address, { chainId, userAddress });
        }
    }
    /**
     * Removes all NFTs from the ignored list.
     */
    clearIgnoredNfts() {
        this.update({ ignoredNfts: [] });
    }
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
    checkAndUpdateSingleNftOwnershipStatus(nft, batch, { userAddress = this.config.selectedAddress, networkClientId, } = {
        userAddress: this.config.selectedAddress,
    }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const chainId = this.getCorrectChainId({ networkClientId });
            const { address, tokenId } = nft;
            let isOwned = nft.isCurrentlyOwned;
            try {
                isOwned = yield this.isNftOwner(userAddress, address, tokenId, {
                    networkClientId,
                });
            }
            catch (_b) {
                // ignore error
                // this will only throw an error 'Unable to verify ownership' in which case
                // we want to keep the current value of isCurrentlyOwned for this flow.
            }
            nft.isCurrentlyOwned = isOwned;
            if (batch) {
                return nft;
            }
            // if this is not part of a batched update we update this one NFT in state
            const { allNfts } = this.state;
            const nfts = ((_a = allNfts[userAddress]) === null || _a === void 0 ? void 0 : _a[chainId]) || [];
            const nftToUpdate = nfts.find((item) => item.tokenId === tokenId &&
                item.address.toLowerCase() === address.toLowerCase());
            if (nftToUpdate) {
                nftToUpdate.isCurrentlyOwned = isOwned;
                this.updateNestedNftState(nfts, ALL_NFTS_STATE_KEY, {
                    userAddress,
                    chainId,
                });
            }
            return nft;
        });
    }
    /**
     * Checks whether NFTs associated with current selectedAddress/chainId combination are still owned by the user
     * And updates the isCurrentlyOwned value on each accordingly.
     * @param options - an object of arguments
     * @param options.networkClientId - The networkClientId that can be used to identify the network client to use for this request.
     * @param options.userAddress - The address of the account where the NFT ownership status is checked/updated.
     */
    checkAndUpdateAllNftsOwnershipStatus({ networkClientId, userAddress = this.config.selectedAddress, } = {
        userAddress: this.config.selectedAddress,
    }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const chainId = this.getCorrectChainId({ networkClientId });
            const { allNfts } = this.state;
            const nfts = ((_a = allNfts[userAddress]) === null || _a === void 0 ? void 0 : _a[chainId]) || [];
            const updatedNfts = yield Promise.all(nfts.map((nft) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                return ((_b = (yield this.checkAndUpdateSingleNftOwnershipStatus(nft, true, {
                    networkClientId,
                    userAddress,
                }))) !== null && _b !== void 0 ? _b : nft);
            })));
            this.updateNestedNftState(updatedNfts, ALL_NFTS_STATE_KEY, {
                userAddress,
                chainId,
            });
        });
    }
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
    updateNftFavoriteStatus(address, tokenId, favorite, { networkClientId, userAddress = this.config.selectedAddress, } = {
        userAddress: this.config.selectedAddress,
    }) {
        var _a;
        const chainId = this.getCorrectChainId({ networkClientId });
        const { allNfts } = this.state;
        const nfts = ((_a = allNfts[userAddress]) === null || _a === void 0 ? void 0 : _a[chainId]) || [];
        const index = nfts.findIndex((nft) => nft.address === address && nft.tokenId === tokenId);
        if (index === -1) {
            return;
        }
        const updatedNft = Object.assign(Object.assign({}, nfts[index]), { favorite });
        // Update Nfts array
        nfts[index] = updatedNft;
        this.updateNestedNftState(nfts, ALL_NFTS_STATE_KEY, {
            chainId,
            userAddress,
        });
    }
    /**
     * Returns an NFT by the address and token id.
     *
     * @param address - Hex address of the NFT contract.
     * @param tokenId - Number that represents the id of the token.
     * @param selectedAddress - Hex address of the user account.
     * @param chainId - Id of the current network.
     * @returns Object containing the NFT and its position in the array
     */
    findNftByAddressAndTokenId(address, tokenId, selectedAddress, chainId) {
        var _a;
        const { allNfts } = this.state;
        const nfts = ((_a = allNfts[selectedAddress]) === null || _a === void 0 ? void 0 : _a[chainId]) || [];
        const index = nfts.findIndex((nft) => nft.address.toLowerCase() === address.toLowerCase() &&
            nft.tokenId === tokenId);
        if (index === -1) {
            return null;
        }
        return { nft: nfts[index], index };
    }
    /**
     * Update NFT data.
     *
     * @param nft - NFT object to find the right NFT to updates.
     * @param updates - NFT partial object to update properties of the NFT.
     * @param selectedAddress - Hex address of the user account.
     * @param chainId - Id of the current network.
     */
    updateNft(nft, updates, selectedAddress, chainId) {
        var _a;
        const { allNfts } = this.state;
        const nfts = ((_a = allNfts[selectedAddress]) === null || _a === void 0 ? void 0 : _a[chainId]) || [];
        const nftInfo = this.findNftByAddressAndTokenId(nft.address, nft.tokenId, selectedAddress, chainId);
        if (!nftInfo) {
            return;
        }
        const updatedNft = Object.assign(Object.assign({}, nft), updates);
        const newNfts = [
            ...nfts.slice(0, nftInfo.index),
            updatedNft,
            ...nfts.slice(nftInfo.index + 1),
        ];
        this.updateNestedNftState(newNfts, ALL_NFTS_STATE_KEY, {
            chainId,
            userAddress: selectedAddress,
        });
    }
    /**
     * Resets the transaction status of an NFT.
     *
     * @param transactionId - NFT transaction id.
     * @param selectedAddress - Hex address of the user account.
     * @param chainId - Id of the current network.
     * @returns a boolean indicating if the reset was well succeeded or not
     */
    resetNftTransactionStatusByTransactionId(transactionId, selectedAddress, chainId) {
        var _a;
        const { allNfts } = this.state;
        const nfts = ((_a = allNfts[selectedAddress]) === null || _a === void 0 ? void 0 : _a[chainId]) || [];
        const index = nfts.findIndex((nft) => nft.transactionId === transactionId);
        if (index === -1) {
            return false;
        }
        const updatedNft = Object.assign(Object.assign({}, nfts[index]), { transactionId: undefined });
        const newNfts = [
            ...nfts.slice(0, index),
            updatedNft,
            ...nfts.slice(index + 1),
        ];
        this.updateNestedNftState(newNfts, ALL_NFTS_STATE_KEY, {
            chainId,
            userAddress: selectedAddress,
        });
        return true;
    }
    _requestApproval(suggestedNftMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.messagingSystem.call('ApprovalController:addRequest', {
                id: suggestedNftMeta.id,
                origin: suggestedNftMeta.origin,
                type: controller_utils_1.ApprovalType.WatchAsset,
                requestData: {
                    id: suggestedNftMeta.id,
                    interactingAddress: suggestedNftMeta.interactingAddress,
                    asset: {
                        address: suggestedNftMeta.asset.address,
                        tokenId: suggestedNftMeta.asset.tokenId,
                        name: suggestedNftMeta.asset.name,
                        description: suggestedNftMeta.asset.description,
                        image: suggestedNftMeta.asset.image,
                        standard: suggestedNftMeta.asset.standard,
                    },
                },
            }, true);
        });
    }
}
exports.NftController = NftController;
exports.default = NftController;
//# sourceMappingURL=NftController.js.map