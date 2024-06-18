"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyringResponseStruct = exports.KeyringAccountDataStruct = exports.KeyringRequestStruct = exports.KeyringAccountStruct = exports.EthAccountType = exports.EthMethod = void 0;
const utils_1 = require("@metamask/utils");
const superstruct_1 = require("superstruct");
const superstruct_2 = require("./superstruct");
const utils_2 = require("./utils");
/**
 * Supported Ethereum methods.
 */
var EthMethod;
(function (EthMethod) {
    // General signing methods
    EthMethod["PersonalSign"] = "personal_sign";
    EthMethod["Sign"] = "eth_sign";
    EthMethod["SignTransaction"] = "eth_signTransaction";
    EthMethod["SignTypedDataV1"] = "eth_signTypedData_v1";
    EthMethod["SignTypedDataV3"] = "eth_signTypedData_v3";
    EthMethod["SignTypedDataV4"] = "eth_signTypedData_v4";
    // ERC-4337 methods
    EthMethod["PrepareUserOperation"] = "eth_prepareUserOperation";
    EthMethod["PatchUserOperation"] = "eth_patchUserOperation";
    EthMethod["SignUserOperation"] = "eth_signUserOperation";
})(EthMethod = exports.EthMethod || (exports.EthMethod = {}));
/**
 * Supported Ethereum account types.
 */
var EthAccountType;
(function (EthAccountType) {
    EthAccountType["Eoa"] = "eip155:eoa";
    EthAccountType["Erc4337"] = "eip155:erc4337";
})(EthAccountType = exports.EthAccountType || (exports.EthAccountType = {}));
exports.KeyringAccountStruct = (0, superstruct_2.object)({
    /**
     * Account ID (UUIDv4).
     */
    id: utils_2.UuidStruct,
    /**
     * Account address or next receive address (UTXO).
     */
    address: (0, superstruct_1.string)(),
    /**
     * Keyring-dependent account options.
     */
    options: (0, superstruct_1.record)((0, superstruct_1.string)(), utils_1.JsonStruct),
    /**
     * Account supported methods.
     */
    methods: (0, superstruct_1.array)((0, superstruct_1.enums)([
        `${EthMethod.PersonalSign}`,
        `${EthMethod.Sign}`,
        `${EthMethod.SignTransaction}`,
        `${EthMethod.SignTypedDataV1}`,
        `${EthMethod.SignTypedDataV3}`,
        `${EthMethod.SignTypedDataV4}`,
        `${EthMethod.PrepareUserOperation}`,
        `${EthMethod.PatchUserOperation}`,
        `${EthMethod.SignUserOperation}`,
    ])),
    /**
     * Account type.
     */
    type: (0, superstruct_1.enums)([`${EthAccountType.Eoa}`, `${EthAccountType.Erc4337}`]),
});
exports.KeyringRequestStruct = (0, superstruct_2.object)({
    /**
     * Keyring request ID (UUIDv4).
     */
    id: utils_2.UuidStruct,
    /**
     * Request's scope (CAIP-2 chain ID).
     */
    scope: (0, superstruct_1.string)(),
    /**
     * Account ID (UUIDv4).
     */
    account: utils_2.UuidStruct,
    /**
     * Inner request sent by the client application.
     */
    request: (0, superstruct_2.object)({
        method: (0, superstruct_1.string)(),
        params: (0, superstruct_2.exactOptional)((0, superstruct_1.union)([(0, superstruct_1.array)(utils_1.JsonStruct), (0, superstruct_1.record)((0, superstruct_1.string)(), utils_1.JsonStruct)])),
    }),
});
exports.KeyringAccountDataStruct = (0, superstruct_1.record)((0, superstruct_1.string)(), utils_1.JsonStruct);
exports.KeyringResponseStruct = (0, superstruct_1.union)([
    (0, superstruct_2.object)({
        /**
         * Pending flag.
         *
         * Setting the pending flag to true indicates that the request will be
         * handled asynchronously. The keyring must be called with `approveRequest`
         * or `rejectRequest` to resolve the request.
         */
        pending: (0, superstruct_1.literal)(true),
        /**
         * Redirect URL.
         *
         * If present in the response, MetaMask will display a confirmation dialog
         * with a link to the redirect URL. The user can choose to follow the link
         * or cancel the request.
         */
        redirect: (0, superstruct_2.exactOptional)((0, superstruct_2.object)({
            message: (0, superstruct_2.exactOptional)((0, superstruct_1.string)()),
            url: (0, superstruct_2.exactOptional)((0, superstruct_1.string)()),
        })),
    }),
    (0, superstruct_2.object)({
        /**
         * Pending flag.
         *
         * Setting the pending flag to false indicates that the request will be
         * handled synchronously. The keyring must return the result of the
         * request execution.
         */
        pending: (0, superstruct_1.literal)(false),
        /**
         * Request result.
         */
        result: utils_1.JsonStruct,
    }),
]);
//# sourceMappingURL=api.js.map