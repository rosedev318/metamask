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
    BIP44Node: function() {
        return _BIP44Node.BIP44Node;
    },
    SLIP10Node: function() {
        return _SLIP10Node.SLIP10Node;
    },
    secp256k1: function() {
        return _curves.secp256k1;
    },
    ed25519: function() {
        return _curves.ed25519;
    },
    BIP44CoinTypeNode: function() {
        return _BIP44CoinTypeNode.BIP44CoinTypeNode;
    },
    BIP_44_COIN_TYPE_DEPTH: function() {
        return _BIP44CoinTypeNode.BIP_44_COIN_TYPE_DEPTH;
    },
    deriveBIP44AddressKey: function() {
        return _BIP44CoinTypeNode.deriveBIP44AddressKey;
    },
    getBIP44AddressKeyDeriver: function() {
        return _BIP44CoinTypeNode.getBIP44AddressKeyDeriver;
    },
    isValidBIP32PathSegment: function() {
        return _utils.isValidBIP32PathSegment;
    },
    mnemonicPhraseToBytes: function() {
        return _utils.mnemonicPhraseToBytes;
    },
    createBip39KeyFromSeed: function() {
        return _derivers.createBip39KeyFromSeed;
    }
});
const _BIP44Node = require("./BIP44Node");
const _SLIP10Node = require("./SLIP10Node");
const _curves = require("./curves");
const _BIP44CoinTypeNode = require("./BIP44CoinTypeNode");
_export_star(require("./constants"), exports);
const _utils = require("./utils");
const _derivers = require("./derivers");
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}

//# sourceMappingURL=index.js.map