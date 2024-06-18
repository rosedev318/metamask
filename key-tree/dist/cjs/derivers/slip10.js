"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "deriveChildKey", {
    enumerable: true,
    get: function() {
        return deriveChildKey;
    }
});
const _utils = require("@metamask/utils");
const _constants = require("../constants");
const _utils1 = require("../utils");
const _shared = require("./shared");
async function deriveChildKey(options) {
    return await (0, _shared.deriveChildKey)(options, handleError);
}
/**
 * Handle an error that occurs during SLIP-10 derivation.
 *
 * @param error - The error that occurred.
 * @param options - The options that were used for derivation.
 * @returns The new options to use for derivation.
 */ async function handleError(error, options) {
    const { curve, isHardened, childIndex, entropy, chainCode } = options;
    // `ed25519` keys are always valid, so this error should never be thrown. If
    // it is, we re-throw it.
    if (curve.name === 'ed25519') {
        throw error;
    }
    const actualChildIndex = isHardened ? childIndex + _constants.BIP_32_HARDENED_OFFSET : childIndex;
    // As per SLIP-10, if the resulting key is invalid, the new entropy is
    // generated as follows:
    // Key material (32 bytes), child chain code (32 bytes) =
    //   HMAC-SHA512(parent chain code, 0x01 || chain code from invalid key || index).
    const newEntropy = (0, _shared.generateEntropy)({
        chainCode,
        extension: (0, _utils.concatBytes)([
            0x01,
            entropy.slice(32, 64),
            (0, _utils1.numberToUint32)(actualChildIndex)
        ])
    });
    return {
        ...options,
        entropy: newEntropy
    };
}

//# sourceMappingURL=slip10.js.map