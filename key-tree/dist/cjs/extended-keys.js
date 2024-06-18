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
    PUBLIC_KEY_VERSION: function() {
        return PUBLIC_KEY_VERSION;
    },
    PRIVATE_KEY_VERSION: function() {
        return PRIVATE_KEY_VERSION;
    },
    decodeExtendedKey: function() {
        return decodeExtendedKey;
    },
    encodeExtendedKey: function() {
        return encodeExtendedKey;
    }
});
const _utils = require("@metamask/utils");
const _BIP44Node = require("./BIP44Node");
const _secp256k1 = require("./curves/secp256k1");
const _utils1 = require("./utils");
const PUBLIC_KEY_VERSION = 0x0488b21e;
const PRIVATE_KEY_VERSION = 0x0488ade4;
const decodeExtendedKey = (extendedKey)=>{
    const bytes = (0, _utils1.decodeBase58check)(extendedKey);
    if (bytes.length !== 78) {
        throw new Error(`Invalid extended key: Expected a length of 78, got ${bytes.length}.`);
    }
    const view = (0, _utils.createDataView)(bytes);
    const version = view.getUint32(0, false);
    const depth = view.getUint8(4);
    (0, _BIP44Node.validateBIP44Depth)(depth);
    const parentFingerprint = view.getUint32(5, false);
    const index = view.getUint32(9, false);
    const chainCode = bytes.slice(13, 45);
    if (!(0, _utils1.isValidBytesKey)(chainCode, 32)) {
        throw new Error(`Invalid extended key: Chain code must be a 32-byte non-zero byte array.`);
    }
    const key = bytes.slice(45, 78);
    if (!(0, _utils1.isValidBytesKey)(key, 33)) {
        throw new Error(`Invalid extended key: Key must be a 33-byte non-zero byte array.`);
    }
    const keyView = (0, _utils.createDataView)(key);
    if (version === PUBLIC_KEY_VERSION) {
        if (keyView.getUint8(0) !== 0x02 && keyView.getUint8(0) !== 0x03) {
            throw new Error(`Invalid extended key: Public key must start with 0x02 or 0x03.`);
        }
        return {
            version,
            depth,
            parentFingerprint,
            index,
            chainCode,
            publicKey: (0, _secp256k1.decompressPublicKey)(key)
        };
    }
    if (version === PRIVATE_KEY_VERSION) {
        if (keyView.getUint8(0) !== 0x00) {
            throw new Error(`Invalid extended key: Private key must start with 0x00.`);
        }
        return {
            version,
            depth,
            parentFingerprint,
            index,
            chainCode,
            privateKey: key.slice(1)
        };
    }
    throw new Error(`Invalid extended key: Expected a public (xpub) or private key (xprv) version.`);
};
const encodeExtendedKey = (extendedKey)=>{
    const { version, depth, parentFingerprint, index, chainCode } = extendedKey;
    const bytes = new Uint8Array(78);
    const view = (0, _utils.createDataView)(bytes);
    view.setUint32(0, version, false);
    view.setUint8(4, depth);
    view.setUint32(5, parentFingerprint, false);
    view.setUint32(9, index, false);
    bytes.set(chainCode, 13);
    if (extendedKey.version === PUBLIC_KEY_VERSION) {
        const { publicKey } = extendedKey;
        const compressedPublicKey = (0, _secp256k1.compressPublicKey)(publicKey);
        bytes.set(compressedPublicKey, 45);
    }
    if (extendedKey.version === PRIVATE_KEY_VERSION) {
        const { privateKey } = extendedKey;
        bytes.set(privateKey, 46);
    }
    return (0, _utils1.encodeBase58check)(bytes);
};

//# sourceMappingURL=extended-keys.js.map