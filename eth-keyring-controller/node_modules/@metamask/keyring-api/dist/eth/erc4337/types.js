"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthUserOperationPatchStruct = exports.EthBaseUserOperationStruct = exports.EthBaseTransactionStruct = exports.EthUserOperationStruct = void 0;
const superstruct_1 = require("superstruct");
const superstruct_2 = require("../../superstruct");
const types_1 = require("../types");
/**
 * Struct of a UserOperation as defined by ERC-4337.
 * @see https://eips.ethereum.org/EIPS/eip-4337#definitions
 */
exports.EthUserOperationStruct = (0, superstruct_2.object)({
    sender: types_1.EthAddressStruct,
    nonce: types_1.EthUint256Struct,
    initCode: types_1.EthBytesStruct,
    callData: types_1.EthBytesStruct,
    callGasLimit: types_1.EthUint256Struct,
    verificationGasLimit: types_1.EthUint256Struct,
    preVerificationGas: types_1.EthUint256Struct,
    maxFeePerGas: types_1.EthUint256Struct,
    maxPriorityFeePerGas: types_1.EthUint256Struct,
    paymasterAndData: types_1.EthBytesStruct,
    signature: types_1.EthBytesStruct,
});
/**
 * Struct containing the most basic transaction information required to
 * construct a UserOperation.
 */
exports.EthBaseTransactionStruct = (0, superstruct_2.object)({
    /**
     * Address of the transaction recipient.
     */
    to: types_1.EthAddressStruct,
    /**
     * Amount of wei to transfer to the recipient.
     */
    value: types_1.EthUint256Struct,
    /**
     * Data to pass to the recipient.
     */
    data: types_1.EthBytesStruct,
});
exports.EthBaseUserOperationStruct = (0, superstruct_2.object)({
    nonce: types_1.EthUint256Struct,
    initCode: types_1.EthBytesStruct,
    callData: types_1.EthBytesStruct,
    gasLimits: (0, superstruct_2.exactOptional)((0, superstruct_2.object)({
        callGasLimit: types_1.EthUint256Struct,
        verificationGasLimit: types_1.EthUint256Struct,
        preVerificationGas: types_1.EthUint256Struct,
    })),
    dummyPaymasterAndData: types_1.EthBytesStruct,
    dummySignature: types_1.EthBytesStruct,
    bundlerUrl: (0, superstruct_1.string)(),
});
exports.EthUserOperationPatchStruct = (0, superstruct_2.object)({
    paymasterAndData: types_1.EthBytesStruct,
});
//# sourceMappingURL=types.js.map