"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.SignatureStruct = void 0;
const utils_1 = require("@metamask/utils");
const secp256k1_1 = require("@noble/curves/secp256k1");
const sha256_1 = require("@noble/hashes/sha256");
const superstruct_1 = require("superstruct");
exports.SignatureStruct = (0, superstruct_1.object)({
    signature: utils_1.StrictHexStruct,
    curve: (0, superstruct_1.literal)('secp256k1'),
    format: (0, superstruct_1.literal)('DER'),
});
/**
 * Verifies that the Snap Registry is properly signed using a cryptographic key.
 *
 * @param options - Parameters for signing.
 * @param options.registry - Raw text of the registry.json file.
 * @param options.signature - Hex-encoded encoded signature.
 * @param options.publicKey - Hex-encoded or Uint8Array public key to compare
 * the signature to.
 * @returns Whether the signature is valid.
 */
function verify({ registry, signature, publicKey, }) {
    (0, utils_1.assertStruct)(signature, exports.SignatureStruct, 'Invalid signature object');
    const publicKeyBytes = (0, utils_1.hexToBytes)(publicKey);
    return secp256k1_1.secp256k1.verify((0, utils_1.remove0x)(signature.signature), (0, sha256_1.sha256)((0, utils_1.stringToBytes)(registry)), publicKeyBytes);
}
exports.verify = verify;
//# sourceMappingURL=verify.js.map