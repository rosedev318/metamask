"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    deriveChildKey: function() {
        return deriveChildKey;
    },
    deriveSecretExtension: function() {
        return deriveSecretExtension;
    },
    derivePublicExtension: function() {
        return derivePublicExtension;
    },
    derivePublicChildKey: function() {
        return derivePublicChildKey;
    },
    privateAdd: function() {
        return privateAdd;
    },
    generateEntropy: function() {
        return generateEntropy;
    },
    validateNode: function() {
        return validateNode;
    }
});
const _utils = require("@metamask/utils");
const _hmac = require("@noble/hashes/hmac");
const _sha512 = require("@noble/hashes/sha512");
const _constants = require("../constants");
const _curves = require("../curves");
const _SLIP10Node = require("../SLIP10Node");
const _utils1 = require("../utils");
async function deriveChildKey({ path, node, curve }, handleError) {
    validateNode(node);
    const { childIndex, isHardened } = getValidatedPath(path, node, curve);
    const args = {
        chainCode: node.chainCodeBytes,
        childIndex,
        isHardened,
        depth: node.depth,
        parentFingerprint: node.fingerprint,
        masterFingerprint: node.masterFingerprint,
        curve
    };
    if (node.privateKeyBytes) {
        const secretExtension = await deriveSecretExtension({
            privateKey: node.privateKeyBytes,
            childIndex,
            isHardened,
            curve
        });
        const entropy = generateEntropy({
            chainCode: node.chainCodeBytes,
            extension: secretExtension
        });
        return await deriveNode({
            privateKey: node.privateKeyBytes,
            entropy,
            ...args
        }, handleError);
    }
    const publicExtension = derivePublicExtension({
        parentPublicKey: node.compressedPublicKeyBytes,
        childIndex
    });
    const entropy = generateEntropy({
        chainCode: node.chainCodeBytes,
        extension: publicExtension
    });
    return await deriveNode({
        publicKey: node.compressedPublicKeyBytes,
        entropy,
        ...args
    }, handleError);
}
/**
 * Derive a SLIP-10 child key from a parent key.
 *
 * @param options - The options for deriving a child key.
 * @param options.privateKey - The private key to derive from.
 * @param options.publicKey - The public key to derive from.
 * @param options.entropy - The entropy to use for deriving the child key.
 * @param options.chainCode - The chain code to use for deriving the child key.
 * @param options.childIndex - The child index to use for deriving the child key.
 * @param options.isHardened - Whether the child key is hardened.
 * @param options.depth - The depth of the child key.
 * @param options.parentFingerprint - The fingerprint of the parent key.
 * @param options.masterFingerprint - The fingerprint of the master key.
 * @param options.curve - The curve to use for deriving the child key.
 * @param handleError - A function to handle errors during derivation.
 * @returns The derived child key as {@link SLIP10Node}.
 */ async function deriveNode(options, handleError) {
    const { privateKey, publicKey, entropy, childIndex, isHardened, depth, parentFingerprint, masterFingerprint, curve } = options;
    try {
        if (privateKey) {
            return await derivePrivateChildKey({
                entropy,
                privateKey,
                depth,
                masterFingerprint,
                parentFingerprint,
                childIndex,
                isHardened,
                curve
            });
        }
        return await derivePublicChildKey({
            entropy,
            publicKey,
            depth,
            masterFingerprint,
            parentFingerprint,
            childIndex,
            curve
        });
    } catch (error) {
        return await deriveNode(await handleError(error, options), handleError);
    }
}
async function deriveSecretExtension({ privateKey, childIndex, isHardened, curve }) {
    if (isHardened) {
        // Hardened child
        return (0, _utils.concatBytes)([
            new Uint8Array([
                0
            ]),
            privateKey,
            (0, _utils1.numberToUint32)(childIndex + _constants.BIP_32_HARDENED_OFFSET)
        ]);
    }
    // Normal child
    const parentPublicKey = await curve.getPublicKey(privateKey, true);
    return derivePublicExtension({
        parentPublicKey,
        childIndex
    });
}
function derivePublicExtension({ parentPublicKey, childIndex }) {
    return (0, _utils.concatBytes)([
        parentPublicKey,
        (0, _utils1.numberToUint32)(childIndex)
    ]);
}
/**
 * Derive a BIP-32 key from a parent key and secret extension.
 *
 * @param options - The options for deriving a key.
 * @param options.privateKey - The parent private key bytes.
 * @param options.entropy - The entropy bytes.
 * @param options.curve - The curve to use for derivation.
 * @returns The derived key.
 */ async function generateKey({ privateKey, entropy, curve }) {
    const keyMaterial = entropy.slice(0, 32);
    const childChainCode = entropy.slice(32);
    // If curve is ed25519: The returned child key ki is parse256(IL).
    // https://github.com/satoshilabs/slips/blob/133ea52a8e43d338b98be208907e144277e44c0e/slip-0010.md#private-parent-key--private-child-key
    if (curve.name === 'ed25519') {
        const publicKey = await curve.getPublicKey(keyMaterial);
        return {
            privateKey: keyMaterial,
            publicKey,
            chainCode: childChainCode
        };
    }
    const childPrivateKey = privateAdd(privateKey, keyMaterial, curve);
    const publicKey = await curve.getPublicKey(childPrivateKey);
    return {
        privateKey: childPrivateKey,
        publicKey,
        chainCode: childChainCode
    };
}
/**
 * Derive a BIP-32 private child key with a given path from a parent key.
 *
 * @param args - The arguments for deriving a private child key.
 * @param args.entropy - The entropy to use for derivation.
 * @param args.privateKey - The parent private key to use for derivation.
 * @param args.depth - The depth of the parent node.
 * @param args.masterFingerprint - The fingerprint of the master node.
 * @param args.parentFingerprint - The fingerprint of the parent node.
 * @param args.childIndex - The child index to derive.
 * @param args.isHardened - Whether the child index is hardened.
 * @param args.curve - The curve to use for derivation.
 * @returns The derived {@link SLIP10Node}.
 */ async function derivePrivateChildKey({ entropy, privateKey, depth, masterFingerprint, parentFingerprint, childIndex, isHardened, curve }) {
    const actualChildIndex = childIndex + (isHardened ? _constants.BIP_32_HARDENED_OFFSET : 0);
    const { privateKey: childPrivateKey, chainCode: childChainCode } = await generateKey({
        privateKey,
        entropy,
        curve
    });
    return await _SLIP10Node.SLIP10Node.fromExtendedKey({
        privateKey: childPrivateKey,
        chainCode: childChainCode,
        depth: depth + 1,
        masterFingerprint,
        parentFingerprint,
        index: actualChildIndex,
        curve: curve.name
    });
}
/**
 * Derive a BIP-32 public key from a parent key and public extension.
 *
 * @param options - The options for deriving a public key.
 * @param options.publicKey - The parent public key bytes.
 * @param options.entropy - The entropy bytes.
 * @param options.curve - The curve to use for derivation.
 * @returns The derived public key.
 */ function generatePublicKey({ publicKey, entropy, curve }) {
    const keyMaterial = entropy.slice(0, 32);
    const childChainCode = entropy.slice(32);
    // This function may fail if the resulting key is invalid.
    const childPublicKey = curve.publicAdd(publicKey, keyMaterial);
    return {
        publicKey: childPublicKey,
        chainCode: childChainCode
    };
}
async function derivePublicChildKey({ entropy, publicKey, depth, masterFingerprint, parentFingerprint, childIndex, curve }) {
    const { publicKey: childPublicKey, chainCode: childChainCode } = generatePublicKey({
        publicKey,
        entropy,
        curve
    });
    return await _SLIP10Node.SLIP10Node.fromExtendedKey({
        publicKey: childPublicKey,
        chainCode: childChainCode,
        depth: depth + 1,
        masterFingerprint,
        parentFingerprint,
        index: childIndex,
        curve: curve.name
    });
}
function privateAdd(privateKeyBytes, tweakBytes, curve) {
    (0, _utils.assert)((0, _utils1.isValidBytesKey)(tweakBytes, 32), 'Invalid tweak: Tweak must be a non-zero 32-byte Uint8Array.');
    const privateKey = (0, _utils.bytesToBigInt)(privateKeyBytes);
    const tweak = (0, _utils.bytesToBigInt)(tweakBytes);
    if (tweak >= curve.curve.n) {
        throw new Error('Invalid tweak: Tweak is larger than the curve order.');
    }
    const added = (0, _curves.mod)(privateKey + tweak, curve.curve.n);
    const bytes = (0, _utils.hexToBytes)(added.toString(16).padStart(64, '0'));
    if (!curve.isValidPrivateKey(bytes)) {
        throw new Error('Invalid private key or tweak: The resulting private key is invalid.');
    }
    return bytes;
}
function generateEntropy({ chainCode, extension }) {
    return (0, _hmac.hmac)(_sha512.sha512, chainCode, extension);
}
function validateNode(node) {
    (0, _utils.assert)(node, 'Invalid parameters: Must specify a node to derive from.');
}
/**
 * Validate a path.
 *
 * @param path - The path to validate.
 * @param node - The node to validate the path against.
 * @param curve - The curve to validate the path against.
 * @throws If the path is invalid.
 */ function validatePath(path, node, curve) {
    (0, _utils.assert)(typeof path === 'string', 'Invalid path: Must be a string.');
    const isHardened = path.endsWith(`'`);
    (0, _utils.assert)(!isHardened || node.privateKey, 'Invalid parameters: Cannot derive hardened child keys without a private key.');
    (0, _utils.assert)(isHardened || curve.deriveUnhardenedKeys, `Invalid path: Cannot derive unhardened child keys with ${curve.name}.`);
}
/**
 * Validate a path and return the child index and whether it is hardened.
 *
 * @param path - The path to validate.
 * @param node - The node to validate the path against.
 * @param curve - The curve to validate the path against.
 * @returns The child index and whether it is hardened.
 */ function getValidatedPath(path, node, curve) {
    validatePath(path, node, curve);
    const indexPart = path.split(`'`)[0];
    (0, _utils.assert)(indexPart);
    const childIndex = parseInt(indexPart, 10);
    if (!_constants.UNPREFIXED_PATH_REGEX.test(indexPart) || !Number.isInteger(childIndex) || childIndex < 0 || childIndex >= _constants.BIP_32_HARDENED_OFFSET) {
        throw new Error(`Invalid path: The index must be a non-negative decimal integer less than ${_constants.BIP_32_HARDENED_OFFSET}.`);
    }
    return {
        childIndex,
        isHardened: path.includes(`'`)
    };
}

//# sourceMappingURL=shared.js.map