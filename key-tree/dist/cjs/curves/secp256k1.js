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
        return _secp256k1.CURVE;
    },
    name: function() {
        return name;
    },
    secret: function() {
        return secret;
    },
    deriveUnhardenedKeys: function() {
        return deriveUnhardenedKeys;
    },
    publicKeyLength: function() {
        return publicKeyLength;
    },
    isValidPrivateKey: function() {
        return isValidPrivateKey;
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
const _secp256k1 = require("@noble/secp256k1");
const _utils1 = require("../utils");
const name = 'secp256k1';
const secret = (0, _utils.stringToBytes)('Bitcoin seed');
const deriveUnhardenedKeys = true;
const publicKeyLength = 65;
const isValidPrivateKey = (privateKey)=>{
    return _secp256k1.utils.isValidPrivateKey(privateKey);
};
const getPublicKey = (privateKey, compressed)=>(0, _secp256k1.getPublicKey)(privateKey, compressed);
const publicAdd = (publicKey, tweak)=>{
    (0, _utils.assert)((0, _utils1.isValidBytesKey)(tweak, 32), 'Invalid tweak: Tweak must be a non-zero 32-byte Uint8Array.');
    const point = _secp256k1.Point.fromHex(publicKey);
    // The returned child key Ki is point(parse256(IL)) + Kpar.
    // This multiplies the tweak with the base point of the curve (Gx, Gy).
    // https://github.com/bitcoin/bips/blob/274fa400d630ba757bec0c03b35ebe2345197108/bip-0032.mediawiki#public-parent-key--public-child-key
    const newPoint = point.add(_secp256k1.Point.fromPrivateKey(tweak));
    newPoint.assertValidity();
    return newPoint.toRawBytes(false);
};
const compressPublicKey = (publicKey)=>{
    const point = _secp256k1.Point.fromHex(publicKey);
    return point.toRawBytes(true);
};
const decompressPublicKey = (publicKey)=>{
    // This calculates a point on the elliptic curve from a compressed public key. We can then use
    // this to get the uncompressed version of the public key.
    const point = _secp256k1.Point.fromHex(publicKey);
    return point.toRawBytes(false);
};

//# sourceMappingURL=secp256k1.js.map