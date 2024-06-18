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
exports.TokensController = exports.getDefaultTokensState = void 0;
const contracts_1 = require("@ethersproject/contracts");
const providers_1 = require("@ethersproject/providers");
const base_controller_1 = require("@metamask/base-controller");
const contract_metadata_1 = __importDefault(require("@metamask/contract-metadata"));
const controller_utils_1 = require("@metamask/controller-utils");
const metamask_eth_abis_1 = require("@metamask/metamask-eth-abis");
const rpc_errors_1 = require("@metamask/rpc-errors");
const async_mutex_1 = require("async-mutex");
const events_1 = require("events");
const uuid_1 = require("uuid");
const assetsUtil_1 = require("./assetsUtil");
const ERC20Standard_1 = require("./Standards/ERC20Standard");
const ERC1155Standard_1 = require("./Standards/NftStandards/ERC1155/ERC1155Standard");
const token_service_1 = require("./token-service");
/**
 * The name of the {@link TokensController}.
 */
const controllerName = 'TokensController';
const getDefaultTokensState = () => {
    return {
        tokens: [],
        ignoredTokens: [],
        detectedTokens: [],
        allTokens: {},
        allIgnoredTokens: {},
        allDetectedTokens: {},
    };
};
exports.getDefaultTokensState = getDefaultTokensState;
/**
 * Controller that stores assets and exposes convenience methods
 */
class TokensController extends base_controller_1.BaseControllerV1 {
    /**
     * Creates a TokensController instance.
     *
     * @param options - The controller options.
     * @param options.chainId - The chain ID of the current network.
     * @param options.config - Initial options used to configure this controller.
     * @param options.state - Initial state to set on this controller.
     * @param options.messenger - The controller messenger.
     */
    constructor({ chainId: initialChainId, config, state, messenger, }) {
        super(config, state);
        this.mutex = new async_mutex_1.Mutex();
        /**
         * EventEmitter instance used to listen to specific EIP747 events
         */
        this.hub = new events_1.EventEmitter();
        /**
         * Name of this controller used during composition
         */
        this.name = 'TokensController';
        this.defaultConfig = Object.assign({ selectedAddress: '', chainId: initialChainId, provider: undefined }, config);
        this.defaultState = Object.assign(Object.assign({}, (0, exports.getDefaultTokensState)()), state);
        this.initialize();
        this.abortController = new AbortController();
        this.messagingSystem = messenger;
        this.messagingSystem.registerActionHandler(`${controllerName}:addDetectedTokens`, this.addDetectedTokens.bind(this));
        this.messagingSystem.subscribe('PreferencesController:stateChange', ({ selectedAddress }) => {
            var _a, _b, _c, _d, _e, _f;
            const { allTokens, allIgnoredTokens, allDetectedTokens } = this.state;
            const { chainId } = this.config;
            this.configure({ selectedAddress });
            this.update({
                tokens: (_b = (_a = allTokens[chainId]) === null || _a === void 0 ? void 0 : _a[selectedAddress]) !== null && _b !== void 0 ? _b : [],
                ignoredTokens: (_d = (_c = allIgnoredTokens[chainId]) === null || _c === void 0 ? void 0 : _c[selectedAddress]) !== null && _d !== void 0 ? _d : [],
                detectedTokens: (_f = (_e = allDetectedTokens[chainId]) === null || _e === void 0 ? void 0 : _e[selectedAddress]) !== null && _f !== void 0 ? _f : [],
            });
        });
        this.messagingSystem.subscribe('NetworkController:networkDidChange', ({ providerConfig }) => {
            var _a, _b, _c;
            const { allTokens, allIgnoredTokens, allDetectedTokens } = this.state;
            const { selectedAddress } = this.config;
            const { chainId } = providerConfig;
            this.abortController.abort();
            this.abortController = new AbortController();
            this.configure({ chainId });
            this.update({
                tokens: ((_a = allTokens[chainId]) === null || _a === void 0 ? void 0 : _a[selectedAddress]) || [],
                ignoredTokens: ((_b = allIgnoredTokens[chainId]) === null || _b === void 0 ? void 0 : _b[selectedAddress]) || [],
                detectedTokens: ((_c = allDetectedTokens[chainId]) === null || _c === void 0 ? void 0 : _c[selectedAddress]) || [],
            });
        });
        this.messagingSystem.subscribe('TokenListController:stateChange', ({ tokenList }) => {
            const { tokens } = this.state;
            if (tokens.length && !tokens[0].name) {
                this.updateTokensAttribute(tokenList, 'name');
            }
        });
    }
    /**
     * Fetch metadata for a token.
     *
     * @param tokenAddress - The address of the token.
     * @returns The token metadata.
     */
    fetchTokenMetadata(tokenAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield (0, token_service_1.fetchTokenMetadata)(this.config.chainId, tokenAddress, this.abortController.signal);
                return token;
            }
            catch (error) {
                if (error instanceof Error &&
                    error.message.includes(token_service_1.TOKEN_METADATA_NO_SUPPORT_ERROR)) {
                    return undefined;
                }
                throw error;
            }
        });
    }
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
    addToken({ address, symbol, decimals, name, image, interactingAddress, networkClientId, }) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { chainId, selectedAddress } = this.config;
            const releaseLock = yield this.mutex.acquire();
            const { allTokens, allIgnoredTokens, allDetectedTokens } = this.state;
            let currentChainId = chainId;
            if (networkClientId) {
                currentChainId = this.messagingSystem.call('NetworkController:getNetworkClientById', networkClientId).configuration.chainId;
            }
            const accountAddress = interactingAddress || selectedAddress;
            const isInteractingWithWalletAccount = accountAddress === selectedAddress;
            try {
                address = (0, controller_utils_1.toChecksumHexAddress)(address);
                const tokens = ((_a = allTokens[currentChainId]) === null || _a === void 0 ? void 0 : _a[accountAddress]) || [];
                const ignoredTokens = ((_b = allIgnoredTokens[currentChainId]) === null || _b === void 0 ? void 0 : _b[accountAddress]) || [];
                const detectedTokens = ((_c = allDetectedTokens[currentChainId]) === null || _c === void 0 ? void 0 : _c[accountAddress]) || [];
                const newTokens = [...tokens];
                const [isERC721, tokenMetadata] = yield Promise.all([
                    this._detectIsERC721(address, networkClientId),
                    // TODO parameterize the token metadata fetch by networkClientId
                    this.fetchTokenMetadata(address),
                ]);
                // TODO remove this once this method is fully parameterized by networkClientId
                if (!networkClientId && currentChainId !== this.config.chainId) {
                    throw new Error('TokensController Error: Switched networks while adding token');
                }
                const newEntry = {
                    address,
                    symbol,
                    decimals,
                    image: image ||
                        (0, assetsUtil_1.formatIconUrlWithProxy)({
                            chainId: currentChainId,
                            tokenAddress: address,
                        }),
                    isERC721,
                    aggregators: (0, assetsUtil_1.formatAggregatorNames)((tokenMetadata === null || tokenMetadata === void 0 ? void 0 : tokenMetadata.aggregators) || []),
                    name,
                };
                const previousIndex = newTokens.findIndex((token) => token.address.toLowerCase() === address.toLowerCase());
                if (previousIndex !== -1) {
                    newTokens[previousIndex] = newEntry;
                }
                else {
                    newTokens.push(newEntry);
                }
                const newIgnoredTokens = ignoredTokens.filter((tokenAddress) => tokenAddress.toLowerCase() !== address.toLowerCase());
                const newDetectedTokens = detectedTokens.filter((token) => token.address.toLowerCase() !== address.toLowerCase());
                const { newAllTokens, newAllIgnoredTokens, newAllDetectedTokens } = this._getNewAllTokensState({
                    newTokens,
                    newIgnoredTokens,
                    newDetectedTokens,
                    interactingAddress: accountAddress,
                    interactingChainId: currentChainId,
                });
                let newState = {
                    allTokens: newAllTokens,
                    allIgnoredTokens: newAllIgnoredTokens,
                    allDetectedTokens: newAllDetectedTokens,
                };
                // Only update active tokens if user is interacting with their active wallet account.
                if (isInteractingWithWalletAccount) {
                    newState = Object.assign(Object.assign({}, newState), { tokens: newTokens, ignoredTokens: newIgnoredTokens, detectedTokens: newDetectedTokens });
                }
                this.update(newState);
                return newTokens;
            }
            finally {
                releaseLock();
            }
        });
    }
    /**
     * Add a batch of tokens.
     *
     * @param tokensToImport - Array of tokens to import.
     * @param networkClientId - Optional network client ID used to determine interacting chain ID.
     */
    addTokens(tokensToImport, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const releaseLock = yield this.mutex.acquire();
            const { tokens, detectedTokens, ignoredTokens } = this.state;
            const importedTokensMap = {};
            // Used later to dedupe imported tokens
            const newTokensMap = tokens.reduce((output, current) => {
                output[current.address] = current;
                return output;
            }, {});
            try {
                tokensToImport.forEach((tokenToAdd) => {
                    const { address, symbol, decimals, image, aggregators, name } = tokenToAdd;
                    const checksumAddress = (0, controller_utils_1.toChecksumHexAddress)(address);
                    const formattedToken = {
                        address: checksumAddress,
                        symbol,
                        decimals,
                        image,
                        aggregators,
                        name,
                    };
                    newTokensMap[address] = formattedToken;
                    importedTokensMap[address.toLowerCase()] = true;
                    return formattedToken;
                });
                const newTokens = Object.values(newTokensMap);
                const newDetectedTokens = detectedTokens.filter((token) => !importedTokensMap[token.address.toLowerCase()]);
                const newIgnoredTokens = ignoredTokens.filter((tokenAddress) => !newTokensMap[tokenAddress.toLowerCase()]);
                let interactingChainId;
                if (networkClientId) {
                    interactingChainId = this.messagingSystem.call('NetworkController:getNetworkClientById', networkClientId).configuration.chainId;
                }
                const { newAllTokens, newAllDetectedTokens, newAllIgnoredTokens } = this._getNewAllTokensState({
                    newTokens,
                    newDetectedTokens,
                    newIgnoredTokens,
                    interactingChainId,
                });
                this.update({
                    tokens: newTokens,
                    allTokens: newAllTokens,
                    detectedTokens: newDetectedTokens,
                    allDetectedTokens: newAllDetectedTokens,
                    ignoredTokens: newIgnoredTokens,
                    allIgnoredTokens: newAllIgnoredTokens,
                });
            }
            finally {
                releaseLock();
            }
        });
    }
    /**
     * Ignore a batch of tokens.
     *
     * @param tokenAddressesToIgnore - Array of token addresses to ignore.
     */
    ignoreTokens(tokenAddressesToIgnore) {
        const { ignoredTokens, detectedTokens, tokens } = this.state;
        const ignoredTokensMap = {};
        let newIgnoredTokens = [...ignoredTokens];
        const checksummedTokenAddresses = tokenAddressesToIgnore.map((address) => {
            const checksumAddress = (0, controller_utils_1.toChecksumHexAddress)(address);
            ignoredTokensMap[address.toLowerCase()] = true;
            return checksumAddress;
        });
        newIgnoredTokens = [...ignoredTokens, ...checksummedTokenAddresses];
        const newDetectedTokens = detectedTokens.filter((token) => !ignoredTokensMap[token.address.toLowerCase()]);
        const newTokens = tokens.filter((token) => !ignoredTokensMap[token.address.toLowerCase()]);
        const { newAllIgnoredTokens, newAllDetectedTokens, newAllTokens } = this._getNewAllTokensState({
            newIgnoredTokens,
            newDetectedTokens,
            newTokens,
        });
        this.update({
            ignoredTokens: newIgnoredTokens,
            tokens: newTokens,
            detectedTokens: newDetectedTokens,
            allIgnoredTokens: newAllIgnoredTokens,
            allDetectedTokens: newAllDetectedTokens,
            allTokens: newAllTokens,
        });
    }
    /**
     * Adds a batch of detected tokens to the stored token list.
     *
     * @param incomingDetectedTokens - Array of detected tokens to be added or updated.
     * @param detectionDetails - An object containing the chain ID and address of the currently selected network on which the incomingDetectedTokens were detected.
     * @param detectionDetails.selectedAddress - the account address on which the incomingDetectedTokens were detected.
     * @param detectionDetails.chainId - the chainId on which the incomingDetectedTokens were detected.
     */
    addDetectedTokens(incomingDetectedTokens, detectionDetails) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
            const releaseLock = yield this.mutex.acquire();
            // Get existing tokens for the chain + account
            const chainId = (_a = detectionDetails === null || detectionDetails === void 0 ? void 0 : detectionDetails.chainId) !== null && _a !== void 0 ? _a : this.config.chainId;
            const accountAddress = (_b = detectionDetails === null || detectionDetails === void 0 ? void 0 : detectionDetails.selectedAddress) !== null && _b !== void 0 ? _b : this.config.selectedAddress;
            const { allTokens, allDetectedTokens, allIgnoredTokens } = this.state;
            let newTokens = [...((_d = (_c = allTokens === null || allTokens === void 0 ? void 0 : allTokens[chainId]) === null || _c === void 0 ? void 0 : _c[accountAddress]) !== null && _d !== void 0 ? _d : [])];
            let newDetectedTokens = [
                ...((_f = (_e = allDetectedTokens === null || allDetectedTokens === void 0 ? void 0 : allDetectedTokens[chainId]) === null || _e === void 0 ? void 0 : _e[accountAddress]) !== null && _f !== void 0 ? _f : []),
            ];
            try {
                incomingDetectedTokens.forEach((tokenToAdd) => {
                    var _a, _b, _c;
                    const { address, symbol, decimals, image, aggregators, isERC721, name, } = tokenToAdd;
                    const checksumAddress = (0, controller_utils_1.toChecksumHexAddress)(address);
                    const newEntry = {
                        address: checksumAddress,
                        symbol,
                        decimals,
                        image,
                        isERC721,
                        aggregators,
                        name,
                    };
                    const previousImportedIndex = newTokens.findIndex((token) => token.address.toLowerCase() === checksumAddress.toLowerCase());
                    if (previousImportedIndex !== -1) {
                        // Update existing data of imported token
                        newTokens[previousImportedIndex] = newEntry;
                    }
                    else {
                        const ignoredTokenIndex = (_c = (_b = (_a = allIgnoredTokens === null || allIgnoredTokens === void 0 ? void 0 : allIgnoredTokens[chainId]) === null || _a === void 0 ? void 0 : _a[accountAddress]) === null || _b === void 0 ? void 0 : _b.indexOf(address)) !== null && _c !== void 0 ? _c : -1;
                        if (ignoredTokenIndex === -1) {
                            // Add detected token
                            const previousDetectedIndex = newDetectedTokens.findIndex((token) => token.address.toLowerCase() === checksumAddress.toLowerCase());
                            if (previousDetectedIndex !== -1) {
                                newDetectedTokens[previousDetectedIndex] = newEntry;
                            }
                            else {
                                newDetectedTokens.push(newEntry);
                            }
                        }
                    }
                });
                const { newAllTokens, newAllDetectedTokens } = this._getNewAllTokensState({
                    newTokens,
                    newDetectedTokens,
                    interactingAddress: accountAddress,
                    interactingChainId: chainId,
                });
                // We may be detecting tokens on a different chain/account pair than are currently configured.
                // Re-point `tokens` and `detectedTokens` to keep them referencing the current chain/account.
                const { chainId: currentChain, selectedAddress: currentAddress } = this.config;
                newTokens = ((_g = newAllTokens === null || newAllTokens === void 0 ? void 0 : newAllTokens[currentChain]) === null || _g === void 0 ? void 0 : _g[currentAddress]) || [];
                newDetectedTokens =
                    ((_h = newAllDetectedTokens === null || newAllDetectedTokens === void 0 ? void 0 : newAllDetectedTokens[currentChain]) === null || _h === void 0 ? void 0 : _h[currentAddress]) || [];
                this.update({
                    tokens: newTokens,
                    allTokens: newAllTokens,
                    detectedTokens: newDetectedTokens,
                    allDetectedTokens: newAllDetectedTokens,
                });
            }
            finally {
                releaseLock();
            }
        });
    }
    /**
     * Adds isERC721 field to token object. This is called when a user attempts to add tokens that
     * were previously added which do not yet had isERC721 field.
     *
     * @param tokenAddress - The contract address of the token requiring the isERC721 field added.
     * @returns The new token object with the added isERC721 field.
     */
    updateTokenType(tokenAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const isERC721 = yield this._detectIsERC721(tokenAddress);
            const { tokens } = this.state;
            const tokenIndex = tokens.findIndex((token) => {
                return token.address.toLowerCase() === tokenAddress.toLowerCase();
            });
            tokens[tokenIndex].isERC721 = isERC721;
            this.update({ tokens });
            return tokens[tokenIndex];
        });
    }
    /**
     * This is a function that updates the tokens name for the tokens name if it is not defined.
     *
     * @param tokenList - Represents the fetched token list from service API
     * @param tokenAttribute - Represents the token attribute that we want to update on the token list
     */
    updateTokensAttribute(tokenList, tokenAttribute) {
        const { tokens } = this.state;
        const newTokens = tokens.map((token) => {
            const newToken = tokenList[token.address.toLowerCase()];
            return !token[tokenAttribute] && (newToken === null || newToken === void 0 ? void 0 : newToken[tokenAttribute])
                ? Object.assign(Object.assign({}, token), { [tokenAttribute]: newToken[tokenAttribute] }) : Object.assign({}, token);
        });
        this.update({ tokens: newTokens });
    }
    /**
     * Detects whether or not a token is ERC-721 compatible.
     *
     * @param tokenAddress - The token contract address.
     * @param networkClientId - Optional network client ID to fetch contract info with.
     * @returns A boolean indicating whether the token address passed in supports the EIP-721
     * interface.
     */
    _detectIsERC721(tokenAddress, networkClientId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const checksumAddress = (0, controller_utils_1.toChecksumHexAddress)(tokenAddress);
            // if this token is already in our contract metadata map we don't need
            // to check against the contract
            if (((_a = contract_metadata_1.default[checksumAddress]) === null || _a === void 0 ? void 0 : _a.erc721) === true) {
                return Promise.resolve(true);
            }
            else if (((_b = contract_metadata_1.default[checksumAddress]) === null || _b === void 0 ? void 0 : _b.erc20) === true) {
                return Promise.resolve(false);
            }
            const tokenContract = this._createEthersContract(tokenAddress, metamask_eth_abis_1.abiERC721, networkClientId);
            try {
                return yield tokenContract.supportsInterface(controller_utils_1.ERC721_INTERFACE_ID);
            }
            catch (error) {
                // currently we see a variety of errors across different networks when
                // token contracts are not ERC721 compatible. We need to figure out a better
                // way of differentiating token interface types but for now if we get an error
                // we have to assume the token is not ERC721 compatible.
                return false;
            }
        });
    }
    _getProvider(networkClientId) {
        return new providers_1.Web3Provider(
        // @ts-expect-error TODO: remove this annotation once the `Eip1193Provider` class is released
        networkClientId
            ? this.messagingSystem.call('NetworkController:getNetworkClientById', networkClientId).provider
            : this.config.provider);
    }
    _createEthersContract(tokenAddress, abi, networkClientId) {
        const web3provider = this._getProvider(networkClientId);
        const tokenContract = new contracts_1.Contract(tokenAddress, abi, web3provider);
        return tokenContract;
    }
    _generateRandomId() {
        return (0, uuid_1.v1)();
    }
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
    watchAsset({ asset, type, interactingAddress, networkClientId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type !== controller_utils_1.ERC20) {
                throw new Error(`Asset of type ${type} not supported`);
            }
            if (!asset.address) {
                throw rpc_errors_1.rpcErrors.invalidParams('Address must be specified');
            }
            if (!(0, controller_utils_1.isValidHexAddress)(asset.address)) {
                throw rpc_errors_1.rpcErrors.invalidParams(`Invalid address "${asset.address}"`);
            }
            // Validate contract
            if (yield this._detectIsERC721(asset.address, networkClientId)) {
                throw rpc_errors_1.rpcErrors.invalidParams(`Contract ${asset.address} must match type ${type}, but was detected as ${controller_utils_1.ERC721}`);
            }
            const provider = this._getProvider(networkClientId);
            const isErc1155 = yield (0, controller_utils_1.safelyExecute)(() => new ERC1155Standard_1.ERC1155Standard(provider).contractSupportsBase1155Interface(asset.address));
            if (isErc1155) {
                throw rpc_errors_1.rpcErrors.invalidParams(`Contract ${asset.address} must match type ${type}, but was detected as ${controller_utils_1.ERC1155}`);
            }
            const erc20 = new ERC20Standard_1.ERC20Standard(provider);
            const [contractName, contractSymbol, contractDecimals] = yield Promise.all([
                (0, controller_utils_1.safelyExecute)(() => erc20.getTokenName(asset.address)),
                (0, controller_utils_1.safelyExecute)(() => erc20.getTokenSymbol(asset.address)),
                (0, controller_utils_1.safelyExecute)(() => __awaiter(this, void 0, void 0, function* () { return erc20.getTokenDecimals(asset.address); })),
            ]);
            asset.name = contractName;
            // Validate symbol
            if (!asset.symbol && !contractSymbol) {
                throw rpc_errors_1.rpcErrors.invalidParams('A symbol is required, but was not found in either the request or contract');
            }
            if (contractSymbol !== undefined &&
                asset.symbol !== undefined &&
                asset.symbol.toUpperCase() !== contractSymbol.toUpperCase()) {
                throw rpc_errors_1.rpcErrors.invalidParams(`The symbol in the request (${asset.symbol}) does not match the symbol in the contract (${contractSymbol})`);
            }
            asset.symbol = contractSymbol !== null && contractSymbol !== void 0 ? contractSymbol : asset.symbol;
            if (typeof asset.symbol !== 'string') {
                throw rpc_errors_1.rpcErrors.invalidParams(`Invalid symbol: not a string`);
            }
            if (asset.symbol.length > 11) {
                throw rpc_errors_1.rpcErrors.invalidParams(`Invalid symbol "${asset.symbol}": longer than 11 characters`);
            }
            // Validate decimals
            if (asset.decimals === undefined && contractDecimals === undefined) {
                throw rpc_errors_1.rpcErrors.invalidParams('Decimals are required, but were not found in either the request or contract');
            }
            if (contractDecimals !== undefined &&
                asset.decimals !== undefined &&
                String(asset.decimals) !== contractDecimals) {
                throw rpc_errors_1.rpcErrors.invalidParams(`The decimals in the request (${asset.decimals}) do not match the decimals in the contract (${contractDecimals})`);
            }
            const decimalsStr = contractDecimals !== null && contractDecimals !== void 0 ? contractDecimals : asset.decimals;
            const decimalsNum = parseInt(decimalsStr, 10);
            if (!Number.isInteger(decimalsNum) || decimalsNum > 36 || decimalsNum < 0) {
                throw rpc_errors_1.rpcErrors.invalidParams(`Invalid decimals "${decimalsStr}": must be an integer 0 <= 36`);
            }
            asset.decimals = decimalsNum;
            const suggestedAssetMeta = {
                asset,
                id: this._generateRandomId(),
                time: Date.now(),
                type,
                interactingAddress: interactingAddress || this.config.selectedAddress,
            };
            yield this._requestApproval(suggestedAssetMeta);
            const { address, symbol, decimals, name, image } = asset;
            yield this.addToken({
                address,
                symbol,
                decimals,
                name,
                image,
                interactingAddress: suggestedAssetMeta.interactingAddress,
                networkClientId,
            });
        });
    }
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
    _getNewAllTokensState(params) {
        const { newTokens, newIgnoredTokens, newDetectedTokens, interactingAddress, interactingChainId, } = params;
        const { allTokens, allIgnoredTokens, allDetectedTokens } = this.state;
        const { chainId, selectedAddress } = this.config;
        const userAddressToAddTokens = interactingAddress !== null && interactingAddress !== void 0 ? interactingAddress : selectedAddress;
        const chainIdToAddTokens = interactingChainId !== null && interactingChainId !== void 0 ? interactingChainId : chainId;
        let newAllTokens = allTokens;
        if ((newTokens === null || newTokens === void 0 ? void 0 : newTokens.length) ||
            (newTokens &&
                allTokens &&
                allTokens[chainIdToAddTokens] &&
                allTokens[chainIdToAddTokens][userAddressToAddTokens])) {
            const networkTokens = allTokens[chainIdToAddTokens];
            const newNetworkTokens = Object.assign(Object.assign({}, networkTokens), { [userAddressToAddTokens]: newTokens });
            newAllTokens = Object.assign(Object.assign({}, allTokens), { [chainIdToAddTokens]: newNetworkTokens });
        }
        let newAllIgnoredTokens = allIgnoredTokens;
        if ((newIgnoredTokens === null || newIgnoredTokens === void 0 ? void 0 : newIgnoredTokens.length) ||
            (newIgnoredTokens &&
                allIgnoredTokens &&
                allIgnoredTokens[chainIdToAddTokens] &&
                allIgnoredTokens[chainIdToAddTokens][userAddressToAddTokens])) {
            const networkIgnoredTokens = allIgnoredTokens[chainIdToAddTokens];
            const newIgnoredNetworkTokens = Object.assign(Object.assign({}, networkIgnoredTokens), { [userAddressToAddTokens]: newIgnoredTokens });
            newAllIgnoredTokens = Object.assign(Object.assign({}, allIgnoredTokens), { [chainIdToAddTokens]: newIgnoredNetworkTokens });
        }
        let newAllDetectedTokens = allDetectedTokens;
        if ((newDetectedTokens === null || newDetectedTokens === void 0 ? void 0 : newDetectedTokens.length) ||
            (newDetectedTokens &&
                allDetectedTokens &&
                allDetectedTokens[chainIdToAddTokens] &&
                allDetectedTokens[chainIdToAddTokens][userAddressToAddTokens])) {
            const networkDetectedTokens = allDetectedTokens[chainIdToAddTokens];
            const newDetectedNetworkTokens = Object.assign(Object.assign({}, networkDetectedTokens), { [userAddressToAddTokens]: newDetectedTokens });
            newAllDetectedTokens = Object.assign(Object.assign({}, allDetectedTokens), { [chainIdToAddTokens]: newDetectedNetworkTokens });
        }
        return { newAllTokens, newAllIgnoredTokens, newAllDetectedTokens };
    }
    /**
     * Removes all tokens from the ignored list.
     */
    clearIgnoredTokens() {
        this.update({ ignoredTokens: [], allIgnoredTokens: {} });
    }
    _requestApproval(suggestedAssetMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.messagingSystem.call('ApprovalController:addRequest', {
                id: suggestedAssetMeta.id,
                origin: controller_utils_1.ORIGIN_METAMASK,
                type: controller_utils_1.ApprovalType.WatchAsset,
                requestData: {
                    id: suggestedAssetMeta.id,
                    interactingAddress: suggestedAssetMeta.interactingAddress,
                    asset: {
                        address: suggestedAssetMeta.asset.address,
                        decimals: suggestedAssetMeta.asset.decimals,
                        symbol: suggestedAssetMeta.asset.symbol,
                        image: suggestedAssetMeta.asset.image || null,
                    },
                },
            }, true);
        });
    }
}
exports.TokensController = TokensController;
exports.default = TokensController;
//# sourceMappingURL=TokensController.js.map