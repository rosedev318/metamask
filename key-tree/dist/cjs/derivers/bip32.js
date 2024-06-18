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
    privateKeyToEthAddress: function() {
        return privateKeyToEthAddress;
    },
    publicKeyToEthAddress: function() {
        return publicKeyToEthAddress;
    },
    deriveChildKey: function() {
        return deriveChildKey;
    }
});
const _utils = require("@metamask/utils");
const _sha3 = require("@noble/hashes/sha3");
const _constants = require("../constants");
const _curves = require("../curves");
const _utils1 = require("../utils");
const _shared = require("./shared");
function privateKeyToEthAddress(key) {
    (0, _utils.assert)(key instanceof Uint8Array && (0, _utils1.isValidBytesKey)(key, _constants.BYTES_KEY_LENGTH), 'Invalid key: The key must be a 32-byte, non-zero Uint8Array.');
    const publicKey = _curves.secp256k1.getPublicKey(key, false);
    return publicKeyToEthAddress(publicKey);
}
function publicKeyToEthAddress(key) {
    (0, _utils.assert)(key instanceof Uint8Array && (0, _utils1.isValidBytesKey)(key, _curves.secp256k1.publicKeyLength), 'Invalid key: The key must be a 65-byte, non-zero Uint8Array.');
    return (0, _sha3.keccak_256)(key.slice(1)).slice(-20);
}
async function deriveChildKey(options) {
    (0, _utils.assert)(options.curve.name === 'secp256k1', 'Invalid curve: Only secp256k1 is supported by BIP-32.');
    return (0, _shared.deriveChildKey)(options, handleError);
}
/**
 * Handles an error thrown during derivation by incrementing the child index
 * and retrying.
 *
 * @param _ - The error that was thrown.
 * @param options - The options for deriving a child key.
 * @returns The options for deriving a child key with the child index
 * incremented by one.
 */ async function handleError(_, options) {
    const { childIndex, privateKey, publicKey, isHardened, curve, chainCode } = options;
    (0, _utils1.validateBIP32Index)(childIndex + 1);
    if (privateKey) {
        const secretExtension = await (0, _shared.deriveSecretExtension)({
            privateKey,
            childIndex: childIndex + 1,
            isHardened,
            curve
        });
        const newEntropy = (0, _shared.generateEntropy)({
            chainCode,
            extension: secretExtension
        });
        return {
            ...options,
            childIndex: childIndex + 1,
            entropy: newEntropy
        };
    }
    const publicExtension = (0, _shared.derivePublicExtension)({
        parentPublicKey: publicKey,
        childIndex: childIndex + 1
    });
    const newEntropy = (0, _shared.generateEntropy)({
        chainCode,
        extension: publicExtension
    });
    return {
        ...options,
        childIndex: childIndex + 1,
        entropy: newEntropy
    };
}

//# sourceMappingURL=bip32.js.map