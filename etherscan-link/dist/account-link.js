"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountLink = exports.createCustomAccountLink = exports.createAccountLinkForChain = exports.createAccountLink = void 0;
const helpers_1 = require("./helpers");
const prefix_for_chain_1 = __importDefault(require("./prefix-for-chain"));
const prefix_for_network_1 = __importDefault(require("./prefix-for-network"));
function createAccountLink(address, networkId) {
    const prefix = prefix_for_network_1.default(networkId);
    return prefix === null ? '' : `https://${prefix}etherscan.io/address/${address}`;
}
exports.createAccountLink = createAccountLink;
function createAccountLinkForChain(address, chainId) {
    const prefix = prefix_for_chain_1.default(chainId);
    return prefix === null ? '' : `https://${prefix}etherscan.io/address/${address}`;
}
exports.createAccountLinkForChain = createAccountLinkForChain;
function createCustomAccountLink(address, customNetworkUrl) {
    const parsedUrl = helpers_1.addPathToUrl(customNetworkUrl, 'address', address);
    return parsedUrl;
}
exports.createCustomAccountLink = createCustomAccountLink;
function getAccountLink(address, chainId, rpcPrefs = {}, networkId = '') {
    if (rpcPrefs.blockExplorerUrl) {
        return createCustomAccountLink(address, rpcPrefs.blockExplorerUrl);
    }
    if (networkId) {
        return createAccountLink(address, networkId);
    }
    return createAccountLinkForChain(address, chainId);
}
exports.getAccountLink = getAccountLink;
//# sourceMappingURL=account-link.js.map