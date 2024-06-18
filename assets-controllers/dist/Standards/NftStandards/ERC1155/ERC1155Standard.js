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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC1155Standard = void 0;
const contracts_1 = require("@ethersproject/contracts");
const controller_utils_1 = require("@metamask/controller-utils");
const metamask_eth_abis_1 = require("@metamask/metamask-eth-abis");
const assetsUtil_1 = require("../../../assetsUtil");
class ERC1155Standard {
    constructor(provider) {
        this.provider = provider;
    }
    /**
     * Query if contract implements ERC1155 URI Metadata interface.
     *
     * @param address - ERC1155 asset contract address.
     * @returns Promise resolving to whether the contract implements ERC1155 URI Metadata interface.
     */
    contractSupportsURIMetadataInterface(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.contractSupportsInterface(address, controller_utils_1.ERC1155_METADATA_URI_INTERFACE_ID);
        });
    }
    /**
     * Query if contract implements ERC1155 Token Receiver interface.
     *
     * @param address - ERC1155 asset contract address.
     * @returns Promise resolving to whether the contract implements ERC1155 Token Receiver interface.
     */
    contractSupportsTokenReceiverInterface(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.contractSupportsInterface(address, controller_utils_1.ERC1155_TOKEN_RECEIVER_INTERFACE_ID);
        });
    }
    /**
     * Query if contract implements ERC1155 interface.
     *
     * @param address - ERC1155 asset contract address.
     * @returns Promise resolving to whether the contract implements the base ERC1155 interface.
     */
    contractSupportsBase1155Interface(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.contractSupportsInterface(address, controller_utils_1.ERC1155_INTERFACE_ID);
        });
    }
    /**
     * Query for tokenURI for a given asset.
     *
     * @param address - ERC1155 asset contract address.
     * @param tokenId - ERC1155 asset identifier.
     * @returns Promise resolving to the 'tokenURI'.
     */
    getTokenURI(address, tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = new contracts_1.Contract(address, metamask_eth_abis_1.abiERC1155, this.provider);
            return contract.uri(tokenId);
        });
    }
    /**
     * Query for balance of a given ERC1155 token.
     *
     * @param contractAddress - ERC1155 asset contract address.
     * @param address - Wallet public address.
     * @param tokenId - ERC1155 asset identifier.
     * @returns Promise resolving to the 'balanceOf'.
     */
    getBalanceOf(contractAddress, address, tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = new contracts_1.Contract(contractAddress, metamask_eth_abis_1.abiERC1155, this.provider);
            const balance = yield contract.balanceOf(address, tokenId);
            return (0, assetsUtil_1.ethersBigNumberToBN)(balance);
        });
    }
    /**
     * Transfer single ERC1155 token.
     * When minting/creating tokens, the from arg MUST be set to 0x0 (i.e. zero address).
     * When burning/destroying tokens, the to arg MUST be set to 0x0 (i.e. zero address).
     *
     * @param operator - ERC1155 token address.
     * @param from - ERC1155 token holder.
     * @param to - ERC1155 token recipient.
     * @param id - ERC1155 token id.
     * @param value - Number of tokens to be sent.
     * @returns Promise resolving to the 'transferSingle'.
     */
    transferSingle(operator, from, to, id, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = new contracts_1.Contract(operator, metamask_eth_abis_1.abiERC1155, this.provider);
            return new Promise((resolve, reject) => {
                contract.transferSingle(operator, from, to, id, value, (error, result) => {
                    /* istanbul ignore if */
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(result);
                });
            });
        });
    }
    /**
     * Query for symbol for a given asset.
     *
     * @param address - ERC1155 asset contract address.
     * @returns Promise resolving to the 'symbol'.
     */
    getAssetSymbol(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = new contracts_1.Contract(address, 
            // Contract ABI fragment containing only the symbol method to fetch the symbol of the contract.
            [
                {
                    inputs: [],
                    name: 'symbol',
                    outputs: [{ name: '_symbol', type: 'string' }],
                    stateMutability: 'view',
                    type: 'function',
                    payable: false,
                },
            ], this.provider);
            return contract.symbol();
        });
    }
    /**
     * Query for name for a given asset.
     *
     * @param address - ERC1155 asset contract address.
     * @returns Promise resolving to the 'name'.
     */
    getAssetName(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = new contracts_1.Contract(address, 
            // Contract ABI fragment containing only the name method to fetch the name of the contract.
            [
                {
                    inputs: [],
                    name: 'name',
                    outputs: [{ name: '_name', type: 'string' }],
                    stateMutability: 'view',
                    type: 'function',
                    payable: false,
                },
            ], this.provider);
            return contract.name();
        });
    }
    /**
     * Query if a contract implements an interface.
     *
     * @param address - ERC1155 asset contract address.
     * @param interfaceId - Interface identifier.
     * @returns Promise resolving to whether the contract implements `interfaceID`.
     */
    contractSupportsInterface(address, interfaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = new contracts_1.Contract(address, metamask_eth_abis_1.abiERC1155, this.provider);
            return contract.supportsInterface(interfaceId);
        });
    }
    /**
     * Query if a contract implements an interface.
     *
     * @param address - Asset contract address.
     * @param ipfsGateway - The user's preferred IPFS gateway.
     * @param tokenId - tokenId of a given token in the contract.
     * @returns Promise resolving an object containing the standard, tokenURI, symbol and name of the given contract/tokenId pair.
     */
    getDetails(address, ipfsGateway, tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isERC1155 = yield this.contractSupportsBase1155Interface(address);
            if (!isERC1155) {
                throw new Error("This isn't a valid ERC1155 contract");
            }
            let image;
            const [symbol, name, tokenURI] = yield Promise.all([
                (0, controller_utils_1.safelyExecute)(() => this.getAssetSymbol(address)),
                (0, controller_utils_1.safelyExecute)(() => this.getAssetName(address)),
                tokenId
                    ? (0, controller_utils_1.safelyExecute)(() => this.getTokenURI(address, tokenId).then((uri) => uri.startsWith('ipfs://')
                        ? (0, assetsUtil_1.getFormattedIpfsUrl)(ipfsGateway, uri, true)
                        : uri))
                    : undefined,
            ]);
            if (tokenURI) {
                try {
                    const response = yield (0, controller_utils_1.timeoutFetch)(tokenURI);
                    const object = yield response.json();
                    image = object === null || object === void 0 ? void 0 : object.image;
                    if (image === null || image === void 0 ? void 0 : image.startsWith('ipfs://')) {
                        image = (0, assetsUtil_1.getFormattedIpfsUrl)(ipfsGateway, image, true);
                    }
                }
                catch (_a) {
                    // Catch block should be kept empty to ignore exceptions, and
                    // pass as much information as possible to the return statement
                }
            }
            // TODO consider querying to the metadata to get name.
            return {
                standard: controller_utils_1.ERC1155,
                tokenURI,
                image,
                symbol,
                name,
            };
        });
    }
}
exports.ERC1155Standard = ERC1155Standard;
//# sourceMappingURL=ERC1155Standard.js.map