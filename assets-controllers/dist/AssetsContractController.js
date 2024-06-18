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
exports.AssetsContractController = exports.MISSING_PROVIDER_ERROR = exports.SINGLE_CALL_BALANCES_ADDRESS_BY_CHAINID = void 0;
const contracts_1 = require("@ethersproject/contracts");
const providers_1 = require("@ethersproject/providers");
const base_controller_1 = require("@metamask/base-controller");
const controller_utils_1 = require("@metamask/controller-utils");
const single_call_balance_checker_abi_1 = __importDefault(require("single-call-balance-checker-abi"));
const assetsUtil_1 = require("./assetsUtil");
const ERC20Standard_1 = require("./Standards/ERC20Standard");
const ERC1155Standard_1 = require("./Standards/NftStandards/ERC1155/ERC1155Standard");
const ERC721Standard_1 = require("./Standards/NftStandards/ERC721/ERC721Standard");
/**
 * Check if token detection is enabled for certain networks
 *
 * @param chainId - ChainID of network
 * @returns Whether the current network supports token detection
 */
exports.SINGLE_CALL_BALANCES_ADDRESS_BY_CHAINID = {
    [assetsUtil_1.SupportedTokenDetectionNetworks.mainnet]: '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39',
    [assetsUtil_1.SupportedTokenDetectionNetworks.bsc]: '0x2352c63A83f9Fd126af8676146721Fa00924d7e4',
    [assetsUtil_1.SupportedTokenDetectionNetworks.polygon]: '0x2352c63A83f9Fd126af8676146721Fa00924d7e4',
    [assetsUtil_1.SupportedTokenDetectionNetworks.avax]: '0xD023D153a0DFa485130ECFdE2FAA7e612EF94818',
    [assetsUtil_1.SupportedTokenDetectionNetworks.aurora]: '0x1286415D333855237f89Df27D388127181448538',
    [assetsUtil_1.SupportedTokenDetectionNetworks.linea_goerli]: '0x10dAd7Ca3921471f616db788D9300DC97Db01783',
    [assetsUtil_1.SupportedTokenDetectionNetworks.linea_mainnet]: '0xF62e6a41561b3650a69Bb03199C735e3E3328c0D',
    [assetsUtil_1.SupportedTokenDetectionNetworks.arbitrum]: '0x151E24A486D7258dd7C33Fb67E4bB01919B7B32c',
    [assetsUtil_1.SupportedTokenDetectionNetworks.optimism]: '0xB1c568e9C3E6bdaf755A60c7418C269eb11524FC',
    [assetsUtil_1.SupportedTokenDetectionNetworks.base]: '0x6AA75276052D96696134252587894ef5FFA520af',
    [assetsUtil_1.SupportedTokenDetectionNetworks.zksync]: '0x458fEd3144680a5b8bcfaa0F9594aa19B4Ea2D34',
};
exports.MISSING_PROVIDER_ERROR = 'AssetsContractController failed to set the provider correctly. A provider must be set for this method to be available';
/**
 * Controller that interacts with contracts on mainnet through web3
 */
class AssetsContractController extends base_controller_1.BaseControllerV1 {
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
    constructor({ chainId: initialChainId, onPreferencesStateChange, onNetworkDidChange, getNetworkClientById, }, config, state) {
        super(config, state);
        /**
         * Name of this controller used during composition
         */
        this.name = 'AssetsContractController';
        this.defaultConfig = {
            provider: undefined,
            ipfsGateway: controller_utils_1.IPFS_DEFAULT_GATEWAY_URL,
            chainId: initialChainId,
        };
        this.initialize();
        this.getNetworkClientById = getNetworkClientById;
        onPreferencesStateChange(({ ipfsGateway }) => {
            this.configure({ ipfsGateway });
        });
        onNetworkDidChange((networkState) => {
            if (this.config.chainId !== networkState.providerConfig.chainId) {
                this.configure({
                    chainId: networkState.providerConfig.chainId,
                });
            }
        });
    }
    /**
     * Sets a new provider.
     *
     * TODO: Replace this wth a method.
     *
     * @property provider - Provider used to create a new underlying Web3 instance
     */
    set provider(provider) {
        this._provider = provider;
    }
    get provider() {
        throw new Error('Property only used for setting');
    }
    /**
     * Get the relevant provider instance.
     *
     * @param networkClientId - Network Client ID.
     * @returns Web3Provider instance.
     */
    getProvider(networkClientId) {
        const provider = networkClientId
            ? this.getNetworkClientById(networkClientId).provider
            : this._provider;
        if (provider === undefined) {
            throw new Error(exports.MISSING_PROVIDER_ERROR);
        }
        // @ts-expect-error TODO: remove this annotation once the `Eip1193Provider` class is released
        return new providers_1.Web3Provider(provider);
    }
    /**
     * Get the relevant chain ID.
     *
     * @param networkClientId - Network Client ID used to get the provider.
     * @returns Hex chain ID.
     */
    getChainId(networkClientId) {
        return networkClientId
            ? this.getNetworkClientById(networkClientId).configuration.chainId
            : this.config.chainId;
    }
    /**
     * Get a ERC20Standard instance using the relevant provider instance.
     *
     * @param networkClientId - Network Client ID used to get the provider.
     * @returns ERC20Standard instance.
     */
    getERC20Standard(networkClientId) {
        const provider = this.getProvider(networkClientId);
        return new ERC20Standard_1.ERC20Standard(provider);
    }
    /**
     * Get a ERC721Standard instance using the relevant provider instance.
     *
     * @param networkClientId - Network Client ID used to get the provider.
     * @returns ERC721Standard instance.
     */
    getERC721Standard(networkClientId) {
        const provider = this.getProvider(networkClientId);
        return new ERC721Standard_1.ERC721Standard(provider);
    }
    /**
     * Get a ERC1155Standard instance using the relevant provider instance.
     *
     * @param networkClientId - Network Client ID used to get the provider.
     * @returns ERC1155Standard instance.
     */
    getERC1155Standard(networkClientId) {
        const provider = this.getProvider(networkClientId);
        return new ERC1155Standard_1.ERC1155Standard(provider);
    }
    /**
     * Get balance or count for current account on specific asset contract.
     *
     * @param address - Asset ERC20 contract address.
     * @param selectedAddress - Current account public address.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to BN object containing balance for current account on specific asset contract.
     */
    getERC20BalanceOf(address, selectedAddress, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const erc20Standard = this.getERC20Standard(networkClientId);
            return erc20Standard.getBalanceOf(address, selectedAddress);
        });
    }
    /**
     * Query for the decimals for a given ERC20 asset.
     *
     * @param address - ERC20 asset contract address.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to the 'decimals'.
     */
    getERC20TokenDecimals(address, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const erc20Standard = this.getERC20Standard(networkClientId);
            return erc20Standard.getTokenDecimals(address);
        });
    }
    /**
     * Query for the name for a given ERC20 asset.
     *
     * @param address - ERC20 asset contract address.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to the 'decimals'.
     */
    getERC20TokenName(address, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const erc20Standard = this.getERC20Standard(networkClientId);
            return erc20Standard.getTokenName(address);
        });
    }
    /**
     * Enumerate assets assigned to an owner.
     *
     * @param address - ERC721 asset contract address.
     * @param selectedAddress - Current account public address.
     * @param index - An NFT counter less than `balanceOf(selectedAddress)`.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to token identifier for the 'index'th asset assigned to 'selectedAddress'.
     */
    getERC721NftTokenId(address, selectedAddress, index, networkClientId) {
        const erc721Standard = this.getERC721Standard(networkClientId);
        return erc721Standard.getNftTokenId(address, selectedAddress, index);
    }
    /**
     * Enumerate assets assigned to an owner.
     *
     * @param tokenAddress - ERC721 asset contract address.
     * @param userAddress - Current account public address.
     * @param tokenId - ERC721 asset identifier.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to an object containing the token standard and a set of details which depend on which standard the token supports.
     */
    getTokenStandardAndDetails(tokenAddress, userAddress, tokenId, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Asserts provider is available
            this.getProvider(networkClientId);
            const { ipfsGateway } = this.config;
            // ERC721
            try {
                const erc721Standard = this.getERC721Standard(networkClientId);
                return Object.assign({}, (yield erc721Standard.getDetails(tokenAddress, ipfsGateway, tokenId)));
            }
            catch (_a) {
                // Ignore
            }
            // ERC1155
            try {
                const erc1155Standard = this.getERC1155Standard(networkClientId);
                return Object.assign({}, (yield erc1155Standard.getDetails(tokenAddress, ipfsGateway, tokenId)));
            }
            catch (_b) {
                // Ignore
            }
            // ERC20
            try {
                const erc20Standard = this.getERC20Standard(networkClientId);
                return Object.assign({}, (yield erc20Standard.getDetails(tokenAddress, userAddress)));
            }
            catch (_c) {
                // Ignore
            }
            throw new Error('Unable to determine contract standard');
        });
    }
    /**
     * Query for tokenURI for a given ERC721 asset.
     *
     * @param address - ERC721 asset contract address.
     * @param tokenId - ERC721 asset identifier.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to the 'tokenURI'.
     */
    getERC721TokenURI(address, tokenId, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const erc721Standard = this.getERC721Standard(networkClientId);
            return erc721Standard.getTokenURI(address, tokenId);
        });
    }
    /**
     * Query for name for a given asset.
     *
     * @param address - ERC721 or ERC20 asset contract address.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to the 'name'.
     */
    getERC721AssetName(address, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const erc721Standard = this.getERC721Standard(networkClientId);
            return erc721Standard.getAssetName(address);
        });
    }
    /**
     * Query for symbol for a given asset.
     *
     * @param address - ERC721 or ERC20 asset contract address.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to the 'symbol'.
     */
    getERC721AssetSymbol(address, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const erc721Standard = this.getERC721Standard(networkClientId);
            return erc721Standard.getAssetSymbol(address);
        });
    }
    /**
     * Query for owner for a given ERC721 asset.
     *
     * @param address - ERC721 asset contract address.
     * @param tokenId - ERC721 asset identifier.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to the owner address.
     */
    getERC721OwnerOf(address, tokenId, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const erc721Standard = this.getERC721Standard(networkClientId);
            return erc721Standard.getOwnerOf(address, tokenId);
        });
    }
    /**
     * Query for tokenURI for a given asset.
     *
     * @param address - ERC1155 asset contract address.
     * @param tokenId - ERC1155 asset identifier.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to the 'tokenURI'.
     */
    getERC1155TokenURI(address, tokenId, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const erc1155Standard = this.getERC1155Standard(networkClientId);
            return erc1155Standard.getTokenURI(address, tokenId);
        });
    }
    /**
     * Query for balance of a given ERC 1155 token.
     *
     * @param userAddress - Wallet public address.
     * @param nftAddress - ERC1155 asset contract address.
     * @param nftId - ERC1155 asset identifier.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns Promise resolving to the 'balanceOf'.
     */
    getERC1155BalanceOf(userAddress, nftAddress, nftId, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const erc1155Standard = this.getERC1155Standard(networkClientId);
            return erc1155Standard.getBalanceOf(nftAddress, userAddress, nftId);
        });
    }
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
    transferSingleERC1155(nftAddress, senderAddress, recipientAddress, nftId, qty, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const erc1155Standard = this.getERC1155Standard(networkClientId);
            return erc1155Standard.transferSingle(nftAddress, senderAddress, recipientAddress, nftId, qty);
        });
    }
    /**
     * Get the token balance for a list of token addresses in a single call. Only non-zero balances
     * are returned.
     *
     * @param selectedAddress - The address to check token balances for.
     * @param tokensToDetect - The token addresses to detect balances for.
     * @param networkClientId - Network Client ID to fetch the provider with.
     * @returns The list of non-zero token balances.
     */
    getBalancesInSingleCall(selectedAddress, tokensToDetect, networkClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainId = this.getChainId(networkClientId);
            const provider = this.getProvider(networkClientId);
            if (!(chainId in exports.SINGLE_CALL_BALANCES_ADDRESS_BY_CHAINID)) {
                // Only fetch balance if contract address exists
                return {};
            }
            const contractAddress = exports.SINGLE_CALL_BALANCES_ADDRESS_BY_CHAINID[chainId];
            const contract = new contracts_1.Contract(contractAddress, single_call_balance_checker_abi_1.default, provider);
            const result = yield contract.balances([selectedAddress], tokensToDetect);
            const nonZeroBalances = {};
            /* istanbul ignore else */
            if (result.length > 0) {
                tokensToDetect.forEach((tokenAddress, index) => {
                    const balance = result[index];
                    /* istanbul ignore else */
                    if (String(balance) !== '0') {
                        nonZeroBalances[tokenAddress] = balance;
                    }
                });
            }
            return nonZeroBalances;
        });
    }
}
exports.AssetsContractController = AssetsContractController;
exports.default = AssetsContractController;
//# sourceMappingURL=AssetsContractController.js.map