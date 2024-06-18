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
    curve: function() {
        return _ed25519.CURVE;
    },
    name: function() {
        return name;
    },
    secret: function() {
        return secret;
    },
    isValidPrivateKey: function() {
        return isValidPrivateKey;
    },
    deriveUnhardenedKeys: function() {
        return deriveUnhardenedKeys;
    },
    publicKeyLength: function() {
        return publicKeyLength;
    },
    getPublicKey: function() {
        return getPublicKey;
    },
    publicAdd: function() {
        return publicAdd;
    },
    compressPublicKey: function() {
        return compressPublicKey;
    },
    decompressPublicKey: function() {
        return decompressPublicKey;
    }
});
const _utils = require("@metamask/utils");
const _ed25519 = require("@noble/ed25519");
const name = 'ed25519';
const secret = (0, _utils.stringToBytes)('ed25519 seed');
const isValidPrivateKey = (_privateKey)=>true;
const deriveUnhardenedKeys = false;
const publicKeyLength = 33;
const getPublicKey = async (privateKey, _compressed)=>{
    const publicKey = await (0, _ed25519.getPublicKey)(privateKey);
    return (0, _utils.concatBytes)([
        new Uint8Array([
            0
        ]),
        publicKey
    ]);
};
const publicAdd = (_publicKey, _tweak)=>{
    throw new Error('Ed25519 does not support public key derivation.');
};
const compressPublicKey = (publicKey)=>{
    // Ed25519 public keys don't have a compressed form.
    return publicKey;
};
const decompressPublicKey = (publicKey)=>{
    // Ed25519 public keys don't have a compressed form.
    return publicKey;
};

//# sourceMappingURL=ed25519.js.map