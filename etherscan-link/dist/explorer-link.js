"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockExplorerLink = exports.createExplorerLinkForChain = exports.createExplorerLink = exports.createCustomExplorerLink = void 0;
const helpers_1 = require("./helpers");
const prefix_for_chain_1 = __importDefault(require("./prefix-for-chain"));
const prefix_for_network_1 = __importDefault(require("./prefix-for-network"));
function createCustomExplorerLink(hash, customNetworkUrl) {
    const parsedUrl = helpers_1.addPathToUrl(customNetworkUrl, 'tx', hash);
    return parsedUrl;
}
exports.createCustomExplorerLink = createCustomExplorerLink;
function createExplorerLink(hash, network) {
    const prefix = prefix_for_network_1.default(network);
    return prefix === null ? '' : `https://${prefix}etherscan.io/tx/${hash}`;
}
exports.createExplorerLink = createExplorerLink;
function createExplorerLinkForChain(hash, chainId) {
    const prefix = prefix_for_chain_1.default(chainId);
    return prefix === null ? '' : `https://${prefix}etherscan.io/tx/${hash}`;
}
exports.createExplorerLinkForChain = createExplorerLinkForChain;
function getBlockExplorerLink(transaction, rpcPrefs = {}) {
    if (rpcPrefs.blockExplorerUrl) {
        return createCustomExplorerLink(transaction.hash, rpcPrefs.blockExplorerUrl);
    }
    if (transaction.chainId) {
        return createExplorerLinkForChain(transaction.hash, transaction.chainId);
    }
    return createExplorerLink(transaction.hash, transaction.metamaskNetworkId);
}
exports.getBlockExplorerLink = getBlockExplorerLink;
//# sourceMappingURL=explorer-link.js.map