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
exports.fetchTokenContractExchangeRates = exports.mapOpenSeaContractV2ToV1 = exports.mapOpenSeaDetailedNftV2ToV1 = exports.mapOpenSeaNftV2ToV1 = exports.reduceInBatchesSerially = exports.divideIntoBatches = exports.ethersBigNumberToBN = exports.addUrlProtocolPrefix = exports.getFormattedIpfsUrl = exports.getIpfsCIDv1AndPath = exports.removeIpfsProtocolPrefix = exports.isTokenListSupportedForNetwork = exports.isTokenDetectionSupportedForNetwork = exports.SupportedTokenDetectionNetworks = exports.formatIconUrlWithProxy = exports.formatAggregatorNames = exports.compareNftMetadata = exports.TOKEN_PRICES_BATCH_SIZE = void 0;
const controller_utils_1 = require("@metamask/controller-utils");
const utils_1 = require("@metamask/utils");
const bn_js_1 = __importDefault(require("bn.js"));
const cid_1 = require("multiformats/cid");
/**
 * The maximum number of token addresses that should be sent to the Price API in
 * a single request.
 */
exports.TOKEN_PRICES_BATCH_SIZE = 30;
/**
 * Compares nft metadata entries to any nft entry.
 * We need this method when comparing a new fetched nft metadata, in case a entry changed to a defined value,
 * there's a need to update the nft in state.
 *
 * @param newNftMetadata - Nft metadata object.
 * @param nft - Nft object to compare with.
 * @returns Whether there are differences.
 */
function compareNftMetadata(newNftMetadata, nft) {
    const keys = [
        'image',
        'backgroundColor',
        'imagePreview',
        'imageThumbnail',
        'imageOriginal',
        'animation',
        'animationOriginal',
        'externalLink',
    ];
    const differentValues = keys.reduce((value, key) => {
        if (newNftMetadata[key] && newNftMetadata[key] !== nft[key]) {
            return value + 1;
        }
        return value;
    }, 0);
    return differentValues > 0;
}
exports.compareNftMetadata = compareNftMetadata;
const aggregatorNameByKey = {
    aave: 'Aave',
    bancor: 'Bancor',
    cmc: 'CMC',
    cryptocom: 'Crypto.com',
    coinGecko: 'CoinGecko',
    oneInch: '1inch',
    paraswap: 'Paraswap',
    pmm: 'PMM',
    zapper: 'Zapper',
    zerion: 'Zerion',
    zeroEx: '0x',
    synthetix: 'Synthetix',
    yearn: 'Yearn',
    apeswap: 'ApeSwap',
    binanceDex: 'BinanceDex',
    pancakeTop100: 'PancakeTop100',
    pancakeExtended: 'PancakeExtended',
    balancer: 'Balancer',
    quickswap: 'QuickSwap',
    matcha: 'Matcha',
    pangolinDex: 'PangolinDex',
    pangolinDexStableCoin: 'PangolinDexStableCoin',
    pangolinDexAvaxBridge: 'PangolinDexAvaxBridge',
    traderJoe: 'TraderJoe',
    airswapLight: 'AirswapLight',
    kleros: 'Kleros',
};
/**
 * Formats aggregator names to presentable format.
 *
 * @param aggregators - List of token list names in camelcase.
 * @returns Formatted aggregator names.
 */
const formatAggregatorNames = (aggregators) => {
    return aggregators.map((key) => aggregatorNameByKey[key] ||
        `${key[0].toUpperCase()}${key.substring(1, key.length)}`);
};
exports.formatAggregatorNames = formatAggregatorNames;
/**
 * Format token list assets to use image proxy from Codefi.
 *
 * @param params - Object that contains chainID and tokenAddress.
 * @param params.chainId - ChainID of network in 0x-prefixed hexadecimal format.
 * @param params.tokenAddress - Address of token in mixed or lowercase.
 * @returns Formatted image url
 */
const formatIconUrlWithProxy = ({ chainId, tokenAddress, }) => {
    const chainIdDecimal = (0, controller_utils_1.convertHexToDecimal)(chainId).toString();
    return `https://static.metafi.codefi.network/api/v1/tokenIcons/${chainIdDecimal}/${tokenAddress.toLowerCase()}.png`;
};
exports.formatIconUrlWithProxy = formatIconUrlWithProxy;
/**
 * Networks where token detection is supported - Values are in decimal format
 */
var SupportedTokenDetectionNetworks;
(function (SupportedTokenDetectionNetworks) {
    SupportedTokenDetectionNetworks["mainnet"] = "0x1";
    SupportedTokenDetectionNetworks["bsc"] = "0x38";
    SupportedTokenDetectionNetworks["polygon"] = "0x89";
    SupportedTokenDetectionNetworks["avax"] = "0xa86a";
    SupportedTokenDetectionNetworks["aurora"] = "0x4e454152";
    SupportedTokenDetectionNetworks["linea_goerli"] = "0xe704";
    SupportedTokenDetectionNetworks["linea_mainnet"] = "0xe708";
    SupportedTokenDetectionNetworks["arbitrum"] = "0xa4b1";
    SupportedTokenDetectionNetworks["optimism"] = "0xa";
    SupportedTokenDetectionNetworks["base"] = "0x2105";
    SupportedTokenDetectionNetworks["zksync"] = "0x144";
})(SupportedTokenDetectionNetworks = exports.SupportedTokenDetectionNetworks || (exports.SupportedTokenDetectionNetworks = {}));
/**
 * Check if token detection is enabled for certain networks.
 *
 * @param chainId - ChainID of network
 * @returns Whether the current network supports token detection
 */
function isTokenDetectionSupportedForNetwork(chainId) {
    return Object.values(SupportedTokenDetectionNetworks).includes(chainId);
}
exports.isTokenDetectionSupportedForNetwork = isTokenDetectionSupportedForNetwork;
/**
 * Check if token list polling is enabled for a given network.
 * Currently this method is used to support e2e testing for consumers of this package.
 *
 * @param chainId - ChainID of network
 * @returns Whether the current network supports tokenlists
 */
function isTokenListSupportedForNetwork(chainId) {
    return isTokenDetectionSupportedForNetwork(chainId);
}
exports.isTokenListSupportedForNetwork = isTokenListSupportedForNetwork;
/**
 * Removes IPFS protocol prefix from input string.
 *
 * @param ipfsUrl - An IPFS url (e.g. ipfs://{content id})
 * @returns IPFS content identifier and (possibly) path in a string
 * @throws Will throw if the url passed is not IPFS.
 */
function removeIpfsProtocolPrefix(ipfsUrl) {
    if (ipfsUrl.startsWith('ipfs://ipfs/')) {
        return ipfsUrl.replace('ipfs://ipfs/', '');
    }
    else if (ipfsUrl.startsWith('ipfs://')) {
        return ipfsUrl.replace('ipfs://', '');
    }
    // this method should not be used with non-ipfs urls (i.e. startsWith('ipfs://') === true)
    throw new Error('this method should not be used with non ipfs urls');
}
exports.removeIpfsProtocolPrefix = removeIpfsProtocolPrefix;
/**
 * Extracts content identifier and path from an input string.
 *
 * @param ipfsUrl - An IPFS URL minus the IPFS protocol prefix
 * @returns IFPS content identifier (cid) and sub path as string.
 * @throws Will throw if the url passed is not ipfs.
 */
function getIpfsCIDv1AndPath(ipfsUrl) {
    const url = removeIpfsProtocolPrefix(ipfsUrl);
    // check if there is a path
    // (CID is everything preceding first forward slash, path is everything after)
    const index = url.indexOf('/');
    const cid = index !== -1 ? url.substring(0, index) : url;
    const path = index !== -1 ? url.substring(index) : undefined;
    // We want to ensure that the CID is v1 (https://docs.ipfs.io/concepts/content-addressing/#identifier-formats)
    // because most cid v0s appear to be incompatible with IPFS subdomains
    return {
        cid: cid_1.CID.parse(cid).toV1().toString(),
        path,
    };
}
exports.getIpfsCIDv1AndPath = getIpfsCIDv1AndPath;
/**
 * Formats URL correctly for use retrieving assets hosted on IPFS.
 *
 * @param ipfsGateway - The users preferred IPFS gateway (full URL or just host).
 * @param ipfsUrl - The IFPS URL pointed at the asset.
 * @param subdomainSupported - Boolean indicating whether the URL should be formatted with subdomains or not.
 * @returns A formatted URL, with the user's preferred IPFS gateway and format (subdomain or not), pointing to an asset hosted on IPFS.
 */
function getFormattedIpfsUrl(ipfsGateway, ipfsUrl, subdomainSupported) {
    const { host, protocol, origin } = new URL(addUrlProtocolPrefix(ipfsGateway));
    if (subdomainSupported) {
        const { cid, path } = getIpfsCIDv1AndPath(ipfsUrl);
        return `${protocol}//${cid}.ipfs.${host}${path !== null && path !== void 0 ? path : ''}`;
    }
    const cidAndPath = removeIpfsProtocolPrefix(ipfsUrl);
    return `${origin}/ipfs/${cidAndPath}`;
}
exports.getFormattedIpfsUrl = getFormattedIpfsUrl;
/**
 * Adds URL protocol prefix to input URL string if missing.
 *
 * @param urlString - An IPFS URL.
 * @returns A URL with a https:// prepended.
 */
function addUrlProtocolPrefix(urlString) {
    if (!urlString.match(/(^http:\/\/)|(^https:\/\/)/u)) {
        return `https://${urlString}`;
    }
    return urlString;
}
exports.addUrlProtocolPrefix = addUrlProtocolPrefix;
/**
 * Converts an Ethers BigNumber to a BN.
 *
 * @param bigNumber - An Ethers BigNumber instance.
 * @returns A BN object.
 */
function ethersBigNumberToBN(bigNumber) {
    return new bn_js_1.default((0, utils_1.remove0x)(bigNumber.toHexString()), 'hex');
}
exports.ethersBigNumberToBN = ethersBigNumberToBN;
/**
 * Partitions a list of values into groups that are at most `batchSize` in
 * length.
 *
 * @param values - The list of values.
 * @param args - The remaining arguments.
 * @param args.batchSize - The desired maximum number of values per batch.
 * @returns The list of batches.
 */
function divideIntoBatches(values, { batchSize }) {
    const batches = [];
    for (let i = 0; i < values.length; i += batchSize) {
        batches.push(values.slice(i, i + batchSize));
    }
    return batches;
}
exports.divideIntoBatches = divideIntoBatches;
/**
 * Constructs an object from processing batches of the given values
 * sequentially.
 *
 * @param args - The arguments to this function.
 * @param args.values - A list of values to iterate over.
 * @param args.batchSize - The maximum number of values in each batch.
 * @param args.eachBatch - A function to call for each batch. This function is
 * similar to the function that `Array.prototype.reduce` takes, in that it
 * receives the object that is being built, each batch in the list of batches
 * and the index, and should return an updated version of the object.
 * @param args.initialResult - The initial value of the final data structure,
 * i.e., the value that will be fed into the first call of `eachBatch`.
 * @returns The built object.
 */
function reduceInBatchesSerially({ values, batchSize, eachBatch, initialResult, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const batches = divideIntoBatches(values, { batchSize });
        let workingResult = initialResult;
        for (const [index, batch] of batches.entries()) {
            workingResult = yield eachBatch(workingResult, batch, index);
        }
        // There's no way around this — we have to assume that in the end, the result
        // matches the intended type.
        const finalResult = workingResult;
        return finalResult;
    });
}
exports.reduceInBatchesSerially = reduceInBatchesSerially;
/**
 * Maps an OpenSea V2 NFT to the V1 schema.
 * @param nft - The V2 NFT to map.
 * @returns The NFT in the V1 schema.
 */
function mapOpenSeaNftV2ToV1(nft) {
    var _a;
    return {
        token_id: nft.identifier,
        num_sales: null,
        background_color: null,
        image_url: (_a = nft.image_url) !== null && _a !== void 0 ? _a : null,
        image_preview_url: null,
        image_thumbnail_url: null,
        image_original_url: null,
        animation_url: null,
        animation_original_url: null,
        name: nft.name,
        description: nft.description,
        external_link: null,
        asset_contract: {
            address: nft.contract,
            asset_contract_type: null,
            created_date: null,
            schema_name: nft.token_standard.toUpperCase(),
            symbol: null,
            total_supply: null,
            description: nft.description,
            external_link: null,
            collection: {
                name: nft.collection,
                image_url: null,
            },
        },
        creator: {
            user: { username: '' },
            profile_img_url: '',
            address: '',
        },
        last_sale: null,
    };
}
exports.mapOpenSeaNftV2ToV1 = mapOpenSeaNftV2ToV1;
/**
 * Maps an OpenSea V2 detailed NFT to the V1 schema.
 * @param nft - The V2 detailed NFT to map.
 * @returns The NFT in the V1 schema.
 */
function mapOpenSeaDetailedNftV2ToV1(nft) {
    var _a;
    const mapped = mapOpenSeaNftV2ToV1(nft);
    return Object.assign(Object.assign({}, mapped), { animation_url: (_a = nft.animation_url) !== null && _a !== void 0 ? _a : null, creator: Object.assign(Object.assign({}, mapped.creator), { address: nft.creator }) });
}
exports.mapOpenSeaDetailedNftV2ToV1 = mapOpenSeaDetailedNftV2ToV1;
/**
 * Maps an OpenSea V2 contract to the V1 schema.
 * @param contract - The v2 contract data.
 * @param collection - The v2 collection data.
 * @returns The contract in the v1 schema.
 */
function mapOpenSeaContractV2ToV1(contract, collection) {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
        address: contract.address,
        asset_contract_type: null,
        created_date: null,
        schema_name: contract.contract_standard.toUpperCase(),
        symbol: null,
        total_supply: (_d = (_b = (_a = collection === null || collection === void 0 ? void 0 : collection.total_supply) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : (_c = contract.total_supply) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : null,
        description: (_e = collection === null || collection === void 0 ? void 0 : collection.description) !== null && _e !== void 0 ? _e : null,
        external_link: (_f = collection === null || collection === void 0 ? void 0 : collection.project_url) !== null && _f !== void 0 ? _f : null,
        collection: {
            name: (_g = collection === null || collection === void 0 ? void 0 : collection.name) !== null && _g !== void 0 ? _g : contract.name,
            image_url: collection === null || collection === void 0 ? void 0 : collection.image_url,
        },
    };
}
exports.mapOpenSeaContractV2ToV1 = mapOpenSeaContractV2ToV1;
/**
 * Retrieves token prices for a set of contract addresses in a specific currency and chainId.
 *
 * @param args - The arguments to function.
 * @param args.tokenPricesService - An object in charge of retrieving token prices.
 * @param args.nativeCurrency - The native currency to request price in.
 * @param args.tokenAddresses - The list of contract addresses.
 * @param args.chainId - The chainId of the tokens.
 * @returns The prices for the requested tokens.
 */
function fetchTokenContractExchangeRates({ tokenPricesService, nativeCurrency, tokenAddresses, chainId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const isChainIdSupported = tokenPricesService.validateChainIdSupported(chainId);
        const isCurrencySupported = tokenPricesService.validateCurrencySupported(nativeCurrency);
        if (!isChainIdSupported || !isCurrencySupported) {
            return {};
        }
        const tokenPricesByTokenAddress = yield reduceInBatchesSerially({
            values: [...tokenAddresses].sort(),
            batchSize: exports.TOKEN_PRICES_BATCH_SIZE,
            eachBatch: (allTokenPricesByTokenAddress, batch) => __awaiter(this, void 0, void 0, function* () {
                const tokenPricesByTokenAddressForBatch = yield tokenPricesService.fetchTokenPrices({
                    tokenAddresses: batch,
                    chainId,
                    currency: nativeCurrency,
                });
                return Object.assign(Object.assign({}, allTokenPricesByTokenAddress), tokenPricesByTokenAddressForBatch);
            }),
            initialResult: {},
        });
        return Object.entries(tokenPricesByTokenAddress).reduce((obj, [tokenAddress, tokenPrice]) => {
            return Object.assign(Object.assign({}, obj), { [(0, controller_utils_1.toChecksumHexAddress)(tokenAddress)]: tokenPrice === null || tokenPrice === void 0 ? void 0 : tokenPrice.value });
        }, {});
    });
}
exports.fetchTokenContractExchangeRates = fetchTokenContractExchangeRates;
//# sourceMappingURL=assetsUtil.js.map