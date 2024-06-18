"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAIN_ID_TO_ETHERS_NETWORK_NAME_MAP = exports.ApprovalType = exports.ORIGIN_METAMASK = exports.OPENSEA_PROXY_URL = exports.BUILT_IN_NETWORKS = exports.TESTNET_TICKER_SYMBOLS = exports.ASSET_TYPES = exports.GWEI = exports.ERC1155_TOKEN_RECEIVER_INTERFACE_ID = exports.ERC1155_METADATA_URI_INTERFACE_ID = exports.ERC1155_INTERFACE_ID = exports.ERC721_ENUMERABLE_INTERFACE_ID = exports.ERC721_METADATA_INTERFACE_ID = exports.ERC721_INTERFACE_ID = exports.ERC20 = exports.ERC1155 = exports.ERC721 = exports.MAX_SAFE_CHAIN_ID = exports.GANACHE_CHAIN_ID = exports.IPFS_DEFAULT_GATEWAY_URL = exports.FALL_BACK_VS_CURRENCY = exports.RPC = void 0;
const types_1 = require("./types");
exports.RPC = 'rpc';
exports.FALL_BACK_VS_CURRENCY = 'ETH';
exports.IPFS_DEFAULT_GATEWAY_URL = 'https://cloudflare-ipfs.com/ipfs/';
// NETWORKS ID
// `toHex` not invoked to avoid cyclic dependency
exports.GANACHE_CHAIN_ID = '0x539'; // toHex(1337)
/**
 * The largest possible chain ID we can handle.
 * Explanation: https://gist.github.com/rekmarks/a47bd5f2525936c4b8eee31a16345553
 */
exports.MAX_SAFE_CHAIN_ID = 4503599627370476;
// TOKEN STANDARDS
exports.ERC721 = 'ERC721';
exports.ERC1155 = 'ERC1155';
exports.ERC20 = 'ERC20';
// TOKEN INTERFACE IDS
exports.ERC721_INTERFACE_ID = '0x80ac58cd';
exports.ERC721_METADATA_INTERFACE_ID = '0x5b5e139f';
exports.ERC721_ENUMERABLE_INTERFACE_ID = '0x780e9d63';
exports.ERC1155_INTERFACE_ID = '0xd9b67a26';
exports.ERC1155_METADATA_URI_INTERFACE_ID = '0x0e89341c';
exports.ERC1155_TOKEN_RECEIVER_INTERFACE_ID = '0x4e2312e0';
// UNITS
exports.GWEI = 'gwei';
// ASSET TYPES
exports.ASSET_TYPES = {
    NATIVE: 'NATIVE',
    TOKEN: 'TOKEN',
    NFT: 'NFT',
    UNKNOWN: 'UNKNOWN',
};
// TICKER SYMBOLS
exports.TESTNET_TICKER_SYMBOLS = {
    GOERLI: 'GoerliETH',
    SEPOLIA: 'SepoliaETH',
    LINEA_GOERLI: 'LineaETH',
};
/**
 * Map of all build-in Infura networks to their network, ticker and chain IDs.
 */
exports.BUILT_IN_NETWORKS = {
    [types_1.NetworkType.goerli]: {
        chainId: types_1.ChainId.goerli,
        ticker: types_1.NetworksTicker.goerli,
        rpcPrefs: {
            blockExplorerUrl: `https://${types_1.NetworkType.goerli}.etherscan.io`,
        },
    },
    [types_1.NetworkType.sepolia]: {
        chainId: types_1.ChainId.sepolia,
        ticker: types_1.NetworksTicker.sepolia,
        rpcPrefs: {
            blockExplorerUrl: `https://${types_1.NetworkType.sepolia}.etherscan.io`,
        },
    },
    [types_1.NetworkType.mainnet]: {
        chainId: types_1.ChainId.mainnet,
        ticker: types_1.NetworksTicker.mainnet,
        rpcPrefs: {
            blockExplorerUrl: 'https://etherscan.io',
        },
    },
    [types_1.NetworkType['linea-goerli']]: {
        chainId: types_1.ChainId['linea-goerli'],
        ticker: types_1.NetworksTicker['linea-goerli'],
        rpcPrefs: {
            blockExplorerUrl: 'https://goerli.lineascan.build',
        },
    },
    [types_1.NetworkType['linea-mainnet']]: {
        chainId: types_1.ChainId['linea-mainnet'],
        ticker: types_1.NetworksTicker['linea-mainnet'],
        rpcPrefs: {
            blockExplorerUrl: 'https://lineascan.build',
        },
    },
    [types_1.NetworkType.rpc]: {
        chainId: undefined,
        blockExplorerUrl: undefined,
        ticker: undefined,
        rpcPrefs: undefined,
    },
};
// APIs
exports.OPENSEA_PROXY_URL = 'https://proxy.metafi.codefi.network/opensea/v1/api/v2';
// Default origin for controllers
exports.ORIGIN_METAMASK = 'metamask';
/**
 * Approval request types for various operations.
 * These types are used by different controllers to create and manage
 * approval requests consistently.
 */
var ApprovalType;
(function (ApprovalType) {
    ApprovalType["AddEthereumChain"] = "wallet_addEthereumChain";
    ApprovalType["ConnectAccounts"] = "connect_accounts";
    ApprovalType["EthDecrypt"] = "eth_decrypt";
    ApprovalType["EthGetEncryptionPublicKey"] = "eth_getEncryptionPublicKey";
    ApprovalType["EthSign"] = "eth_sign";
    ApprovalType["EthSignTypedData"] = "eth_signTypedData";
    ApprovalType["PersonalSign"] = "personal_sign";
    ApprovalType["ResultError"] = "result_error";
    ApprovalType["ResultSuccess"] = "result_success";
    ApprovalType["SnapDialogAlert"] = "snap_dialog:alert";
    ApprovalType["SnapDialogConfirmation"] = "snap_dialog:confirmation";
    ApprovalType["SnapDialogPrompt"] = "snap_dialog:prompt";
    ApprovalType["SwitchEthereumChain"] = "wallet_switchEthereumChain";
    ApprovalType["Transaction"] = "transaction";
    ApprovalType["Unlock"] = "unlock";
    ApprovalType["WalletConnect"] = "wallet_connect";
    ApprovalType["WalletRequestPermissions"] = "wallet_requestPermissions";
    ApprovalType["WatchAsset"] = "wallet_watchAsset";
})(ApprovalType = exports.ApprovalType || (exports.ApprovalType = {}));
exports.CHAIN_ID_TO_ETHERS_NETWORK_NAME_MAP = {
    [types_1.ChainId.goerli]: types_1.BuiltInNetworkName.Goerli,
    [types_1.ChainId.sepolia]: types_1.BuiltInNetworkName.Sepolia,
    [types_1.ChainId.mainnet]: types_1.BuiltInNetworkName.Mainnet,
    [types_1.ChainId['linea-goerli']]: types_1.BuiltInNetworkName.LineaGoerli,
    [types_1.ChainId['linea-mainnet']]: types_1.BuiltInNetworkName.LineaMainnet,
    [types_1.ChainId.aurora]: types_1.BuiltInNetworkName.Aurora,
};
//# sourceMappingURL=constants.js.map