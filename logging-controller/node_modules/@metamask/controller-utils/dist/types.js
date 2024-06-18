"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworksTicker = exports.ChainId = exports.BuiltInNetworkName = exports.isInfuraNetworkType = exports.isNetworkType = exports.NetworkType = exports.InfuraNetworkType = void 0;
/**
 * The names of built-in Infura networks
 */
exports.InfuraNetworkType = {
    mainnet: 'mainnet',
    goerli: 'goerli',
    sepolia: 'sepolia',
    'linea-goerli': 'linea-goerli',
    'linea-mainnet': 'linea-mainnet',
};
/**
 * The "network type"; either the name of a built-in network, or "rpc" for custom networks.
 */
exports.NetworkType = Object.assign(Object.assign({}, exports.InfuraNetworkType), { rpc: 'rpc' });
/**
 * A helper to determine whether a given input is NetworkType.
 *
 * @param val - the value to check whether it is NetworkType or not.
 * @returns boolean indicating whether or not the argument is NetworkType.
 */
// TODO: Replace `any` with type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isNetworkType(val) {
    return Object.values(exports.NetworkType).includes(val);
}
exports.isNetworkType = isNetworkType;
/**
 * A type guard to determine whether the input is an InfuraNetworkType.
 *
 * @param value - The value to check.
 * @returns True if the given value is within the InfuraNetworkType enum,
 * false otherwise.
 */
function isInfuraNetworkType(value) {
    const infuraNetworkTypes = Object.keys(exports.InfuraNetworkType);
    return infuraNetworkTypes.includes(value);
}
exports.isInfuraNetworkType = isInfuraNetworkType;
/**
 * Names of networks built into the wallet.
 *
 * This includes both Infura and non-Infura networks.
 */
var BuiltInNetworkName;
(function (BuiltInNetworkName) {
    BuiltInNetworkName["Mainnet"] = "mainnet";
    BuiltInNetworkName["Goerli"] = "goerli";
    BuiltInNetworkName["Sepolia"] = "sepolia";
    BuiltInNetworkName["LineaGoerli"] = "linea-goerli";
    BuiltInNetworkName["LineaMainnet"] = "linea-mainnet";
    BuiltInNetworkName["Aurora"] = "aurora";
})(BuiltInNetworkName = exports.BuiltInNetworkName || (exports.BuiltInNetworkName = {}));
/**
 * Decimal string chain IDs of built-in networks, by name.
 *
 * `toHex` not invoked to avoid cyclic dependency
 */
exports.ChainId = {
    [BuiltInNetworkName.Mainnet]: '0x1',
    [BuiltInNetworkName.Goerli]: '0x5',
    [BuiltInNetworkName.Sepolia]: '0xaa36a7',
    [BuiltInNetworkName.Aurora]: '0x4e454152',
    [BuiltInNetworkName.LineaGoerli]: '0xe704',
    [BuiltInNetworkName.LineaMainnet]: '0xe708', // toHex(59144)
};
var NetworksTicker;
(function (NetworksTicker) {
    NetworksTicker["mainnet"] = "ETH";
    NetworksTicker["goerli"] = "GoerliETH";
    NetworksTicker["sepolia"] = "SepoliaETH";
    NetworksTicker["linea-goerli"] = "LineaETH";
    NetworksTicker["linea-mainnet"] = "ETH";
    NetworksTicker["rpc"] = "";
})(NetworksTicker = exports.NetworksTicker || (exports.NetworksTicker = {}));
//# sourceMappingURL=types.js.map