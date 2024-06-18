import { type Infer } from 'superstruct';
/**
 * Struct of a UserOperation as defined by ERC-4337.
 * @see https://eips.ethereum.org/EIPS/eip-4337#definitions
 */
export declare const EthUserOperationStruct: import("superstruct").Struct<{
    sender: string;
    nonce: string;
    initCode: string;
    callData: string;
    callGasLimit: string;
    verificationGasLimit: string;
    preVerificationGas: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    paymasterAndData: string;
    signature: string;
}, {
    sender: import("superstruct").Struct<string, null>;
    nonce: import("superstruct").Struct<string, null>;
    initCode: import("superstruct").Struct<string, null>;
    callData: import("superstruct").Struct<string, null>;
    callGasLimit: import("superstruct").Struct<string, null>;
    verificationGasLimit: import("superstruct").Struct<string, null>;
    preVerificationGas: import("superstruct").Struct<string, null>;
    maxFeePerGas: import("superstruct").Struct<string, null>;
    maxPriorityFeePerGas: import("superstruct").Struct<string, null>;
    paymasterAndData: import("superstruct").Struct<string, null>;
    signature: import("superstruct").Struct<string, null>;
}>;
export declare type EthUserOperation = Infer<typeof EthUserOperationStruct>;
/**
 * Struct containing the most basic transaction information required to
 * construct a UserOperation.
 */
export declare const EthBaseTransactionStruct: import("superstruct").Struct<{
    value: string;
    data: string;
    to: string;
}, {
    /**
     * Address of the transaction recipient.
     */
    to: import("superstruct").Struct<string, null>;
    /**
     * Amount of wei to transfer to the recipient.
     */
    value: import("superstruct").Struct<string, null>;
    /**
     * Data to pass to the recipient.
     */
    data: import("superstruct").Struct<string, null>;
}>;
export declare type EthBaseTransaction = Infer<typeof EthBaseTransactionStruct>;
export declare const EthBaseUserOperationStruct: import("superstruct").Struct<{
    nonce: string;
    initCode: string;
    callData: string;
    dummyPaymasterAndData: string;
    dummySignature: string;
    bundlerUrl: string;
    gasLimits?: {
        callGasLimit: string;
        verificationGasLimit: string;
        preVerificationGas: string;
    };
}, {
    nonce: import("superstruct").Struct<string, null>;
    initCode: import("superstruct").Struct<string, null>;
    callData: import("superstruct").Struct<string, null>;
    gasLimits: import("superstruct").Struct<import("../../superstruct").ExactOptionalTag | {
        callGasLimit: string;
        verificationGasLimit: string;
        preVerificationGas: string;
    }, {
        callGasLimit: import("superstruct").Struct<string, null>;
        verificationGasLimit: import("superstruct").Struct<string, null>;
        preVerificationGas: import("superstruct").Struct<string, null>;
    }>;
    dummyPaymasterAndData: import("superstruct").Struct<string, null>;
    dummySignature: import("superstruct").Struct<string, null>;
    bundlerUrl: import("superstruct").Struct<string, null>;
}>;
export declare type EthBaseUserOperation = Infer<typeof EthBaseUserOperationStruct>;
export declare const EthUserOperationPatchStruct: import("superstruct").Struct<{
    paymasterAndData: string;
}, {
    paymasterAndData: import("superstruct").Struct<string, null>;
}>;
export declare type EthUserOperationPatch = Infer<typeof EthUserOperationPatchStruct>;
