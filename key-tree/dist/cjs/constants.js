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
    BYTES_KEY_LENGTH: function() {
        return BYTES_KEY_LENGTH;
    },
    MIN_BIP_44_DEPTH: function() {
        return MIN_BIP_44_DEPTH;
    },
    MAX_BIP_44_DEPTH: function() {
        return MAX_BIP_44_DEPTH;
    },
    MAX_UNHARDENED_BIP_32_INDEX: function() {
        return MAX_UNHARDENED_BIP_32_INDEX;
    },
    MAX_BIP_32_INDEX: function() {
        return MAX_BIP_32_INDEX;
    },
    BIP44PurposeNodeToken: function() {
        return BIP44PurposeNodeToken;
    },
    UNPREFIXED_PATH_REGEX: function() {
        return UNPREFIXED_PATH_REGEX;
    },
    UNPREFIXED_BIP_32_PATH_REGEX: function() {
        return UNPREFIXED_BIP_32_PATH_REGEX;
    },
    BIP_32_PATH_REGEX: function() {
        return BIP_32_PATH_REGEX;
    },
    SLIP_10_PATH_REGEX: function() {
        return SLIP_10_PATH_REGEX;
    },
    BIP_39_PATH_REGEX: function() {
        return BIP_39_PATH_REGEX;
    },
    BIP_32_HARDENED_OFFSET: function() {
        return BIP_32_HARDENED_OFFSET;
    }
});
const BYTES_KEY_LENGTH = 32;
const MIN_BIP_44_DEPTH = 0;
const MAX_BIP_44_DEPTH = 5;
const MAX_UNHARDENED_BIP_32_INDEX = 0x7fffffff; // 2^31 - 1
const MAX_BIP_32_INDEX = 0xffffffff; // 2^32 - 1
const BIP44PurposeNodeToken = `bip32:44'`;
const UNPREFIXED_PATH_REGEX = /^\d+$/u;
const UNPREFIXED_BIP_32_PATH_REGEX = RegExp("^(?<index>\\d+)'?$", "u");
const BIP_32_PATH_REGEX = /^bip32:\d+'?$/u;
const SLIP_10_PATH_REGEX = /^slip10:\d+'?$/u;
const BIP_39_PATH_REGEX = /^bip39:([a-z]+){1}( [a-z]+){11,23}$/u;
const BIP_32_HARDENED_OFFSET = 0x80000000;

//# sourceMappingURL=constants.js.map