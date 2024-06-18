"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDecryptedMessageData = exports.validateEncryptionPublicKeyMessageData = exports.validateTypedSignMessageDataV3V4 = exports.validateTypedSignMessageDataV1 = exports.validateSignMessageData = exports.normalizeMessageData = void 0;
const controller_utils_1 = require("@metamask/controller-utils");
const eth_sig_util_1 = require("@metamask/eth-sig-util");
const utils_1 = require("@metamask/utils");
const jsonschema_1 = require("jsonschema");
const hexRe = /^[0-9A-Fa-f]+$/gu;
/**
 * Validates an address string and throws in the event of any validation error.
 *
 * @param address - The address to validate.
 * @param propertyName - The name of the property source to use in the error message.
 */
function validateAddress(address, propertyName) {
    if (!address || typeof address !== 'string' || !(0, controller_utils_1.isValidHexAddress)(address)) {
        throw new Error(`Invalid "${propertyName}" address: ${address} must be a valid string.`);
    }
}
/**
 * A helper function that converts rawmessageData buffer data to a hex, or just returns the data if
 * it is already formatted as a hex.
 *
 * @param data - The buffer data to convert to a hex.
 * @returns A hex string conversion of the buffer data.
 */
function normalizeMessageData(data) {
    try {
        const stripped = (0, utils_1.remove0x)(data);
        if (stripped.match(hexRe)) {
            return (0, utils_1.add0x)(stripped);
        }
    }
    catch (e) {
        /* istanbul ignore next */
    }
    return (0, utils_1.bytesToHex)(Buffer.from(data, 'utf8'));
}
exports.normalizeMessageData = normalizeMessageData;
/**
 * Validates a PersonalMessageParams and MessageParams objects for required properties and throws in
 * the event of any validation error.
 *
 * @param messageData - PersonalMessageParams object to validate.
 */
function validateSignMessageData(messageData) {
    const { from, data } = messageData;
    validateAddress(from, 'from');
    if (!data || typeof data !== 'string') {
        throw new Error(`Invalid message "data": ${data} must be a valid string.`);
    }
}
exports.validateSignMessageData = validateSignMessageData;
/**
 * Validates a TypedMessageParams object for required properties and throws in
 * the event of any validation error for eth_signTypedMessage_V1.
 *
 * @param messageData - TypedMessageParams object to validate.
 */
function validateTypedSignMessageDataV1(messageData) {
    validateAddress(messageData.from, 'from');
    if (!messageData.data || !Array.isArray(messageData.data)) {
        throw new Error(`Invalid message "data": ${messageData.data} must be a valid array.`);
    }
    try {
        // typedSignatureHash will throw if the data is invalid.
        // TODO: Replace `any` with type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (0, eth_sig_util_1.typedSignatureHash)(messageData.data);
    }
    catch (e) {
        throw new Error(`Expected EIP712 typed data.`);
    }
}
exports.validateTypedSignMessageDataV1 = validateTypedSignMessageDataV1;
/**
 * Validates a TypedMessageParams object for required properties and throws in
 * the event of any validation error for eth_signTypedMessage_V3.
 *
 * @param messageData - TypedMessageParams object to validate.
 * @param currentChainId - The current chainId.
 */
function validateTypedSignMessageDataV3V4(messageData, currentChainId) {
    validateAddress(messageData.from, 'from');
    if (!messageData.data ||
        Array.isArray(messageData.data) ||
        (typeof messageData.data !== 'object' &&
            typeof messageData.data !== 'string')) {
        throw new Error(`Invalid message "data": Must be a valid string or object.`);
    }
    let data;
    if (typeof messageData.data === 'object') {
        data = messageData.data;
    }
    else {
        try {
            data = JSON.parse(messageData.data);
        }
        catch (e) {
            throw new Error('Data must be passed as a valid JSON string.');
        }
    }
    const validation = (0, jsonschema_1.validate)(data, eth_sig_util_1.TYPED_MESSAGE_SCHEMA);
    if (validation.errors.length > 0) {
        throw new Error('Data must conform to EIP-712 schema. See https://git.io/fNtcx.');
    }
    if (!currentChainId) {
        throw new Error('Current chainId cannot be null or undefined.');
    }
    let { chainId } = data.domain;
    if (chainId) {
        if (typeof chainId === 'string') {
            chainId = parseInt(chainId, chainId.startsWith('0x') ? 16 : 10);
        }
        const activeChainId = parseInt(currentChainId, 16);
        if (Number.isNaN(activeChainId)) {
            throw new Error(`Cannot sign messages for chainId "${chainId}", because MetaMask is switching networks.`);
        }
        if (chainId !== activeChainId) {
            throw new Error(`Provided chainId "${chainId}" must match the active chainId "${activeChainId}"`);
        }
    }
}
exports.validateTypedSignMessageDataV3V4 = validateTypedSignMessageDataV3V4;
/**
 * Validates messageData for the eth_getEncryptionPublicKey message and throws in
 * the event of any validation error.
 *
 * @param messageData - address string to validate.
 */
function validateEncryptionPublicKeyMessageData(messageData) {
    const { from } = messageData;
    validateAddress(from, 'from');
}
exports.validateEncryptionPublicKeyMessageData = validateEncryptionPublicKeyMessageData;
/**
 * Validates messageData for the eth_decrypt message and throws in
 * the event of any validation error.
 *
 * @param messageData - address string to validate.
 */
function validateDecryptedMessageData(messageData) {
    const { from } = messageData;
    validateAddress(from, 'from');
}
exports.validateDecryptedMessageData = validateDecryptedMessageData;
//# sourceMappingURL=utils.js.map