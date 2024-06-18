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
    getBIP44CoinTypePathString: function() {
        return getBIP44CoinTypePathString;
    },
    getBIP44ChangePathString: function() {
        return getBIP44ChangePathString;
    },
    getBIP44CoinTypeToAddressPathTuple: function() {
        return getBIP44CoinTypeToAddressPathTuple;
    },
    getHardenedBIP32NodeToken: function() {
        return getHardenedBIP32NodeToken;
    },
    getUnhardenedBIP32NodeToken: function() {
        return getUnhardenedBIP32NodeToken;
    },
    getBIP32NodeToken: function() {
        return getBIP32NodeToken;
    },
    validateBIP32Index: function() {
        return validateBIP32Index;
    },
    isValidBIP32Index: function() {
        return isValidBIP32Index;
    },
    isValidBIP32PathSegment: function() {
        return isValidBIP32PathSegment;
    },
    isHardened: function() {
        return isHardened;
    },
    hexStringToBytes: function() {
        return hexStringToBytes;
    },
    nullableHexStringToBytes: function() {
        return nullableHexStringToBytes;
    },
    isValidBytesKey: function() {
        return isValidBytesKey;
    },
    isValidInteger: function() {
        return isValidInteger;
    },
    getBytes: function() {
        return getBytes;
    },
    getBytesUnsafe: function() {
        return getBytesUnsafe;
    },
    decodeBase58check: function() {
        return decodeBase58check;
    },
    encodeBase58check: function() {
        return encodeBase58check;
    },
    getFingerprint: function() {
        return getFingerprint;
    },
    mnemonicPhraseToBytes: function() {
        return mnemonicPhraseToBytes;
    },
    validateCurve: function() {
        return validateCurve;
    },
    numberToUint32: function() {
        return numberToUint32;
    }
});
const _english = require("@metamask/scure-bip39/dist/wordlists/english");
const _utils = require("@metamask/utils");
const _ripemd160 = require("@noble/hashes/ripemd160");
const _sha256 = require("@noble/hashes/sha256");
const _base = require("@scure/base");
const _constants = require("./constants");
const _curves = require("./curves");
function getBIP44CoinTypePathString(coin_type) {
    return `m / ${_constants.BIP44PurposeNodeToken} / ${getHardenedBIP32NodeToken(coin_type)}`;
}
function getBIP44ChangePathString(coinTypePath, indices) {
    return `${coinTypePath} / ${getHardenedBIP32NodeToken(indices.account ?? 0)} / ${getBIP32NodeToken(indices.change ?? 0)}`;
}
function getBIP44CoinTypeToAddressPathTuple({ account = 0, change = 0, address_index }) {
    return [
        getHardenedBIP32NodeToken(account),
        getBIP32NodeToken(change),
        getBIP32NodeToken(address_index)
    ];
}
function getHardenedBIP32NodeToken(index) {
    validateBIP32Index(index);
    return `${getUnhardenedBIP32NodeToken(index)}'`;
}
function getUnhardenedBIP32NodeToken(index) {
    validateBIP32Index(index);
    return `bip32:${index}`;
}
function getBIP32NodeToken(index) {
    if (typeof index === 'number') {
        return getUnhardenedBIP32NodeToken(index);
    }
    if (!index || !Number.isInteger(index.index) || typeof index.hardened !== 'boolean') {
        throw new Error('Invalid BIP-32 index: Must be an object containing the index and whether it is hardened.');
    }
    if (index.hardened) {
        return getHardenedBIP32NodeToken(index.index);
    }
    return getUnhardenedBIP32NodeToken(index.index);
}
function validateBIP32Index(addressIndex) {
    if (!isValidBIP32Index(addressIndex)) {
        throw new Error(`Invalid BIP-32 index: Must be a non-negative integer.`);
    }
}
function isValidBIP32Index(index) {
    return isValidInteger(index) && index <= _constants.MAX_BIP_32_INDEX;
}
function isValidBIP32PathSegment(segment) {
    if (typeof segment !== 'string') {
        return false;
    }
    const match = segment.match(_constants.UNPREFIXED_BIP_32_PATH_REGEX);
    if (typeof match?.groups?.index === 'undefined') {
        return false;
    }
    const index = parseInt(match.groups.index, 10);
    return isValidInteger(index) && index <= _constants.MAX_UNHARDENED_BIP_32_INDEX;
}
function isHardened(bip32Token) {
    return bip32Token.endsWith(`'`);
}
function hexStringToBytes(hexString) {
    if (hexString instanceof Uint8Array) {
        return hexString;
    }
    return (0, _utils.hexToBytes)(hexString);
}
function nullableHexStringToBytes(hexString) {
    if (hexString !== undefined) {
        return hexStringToBytes(hexString);
    }
    return undefined;
}
function isValidBytesKey(bytes, expectedLength) {
    if (bytes.length !== expectedLength) {
        return false;
    }
    for (const byte of bytes){
        if (byte !== 0) {
            return true;
        }
    }
    return false;
}
function isValidInteger(value) {
    return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}
function getBytes(value, length) {
    if (value instanceof Uint8Array) {
        validateBytes(value, length);
        return value;
    }
    if (typeof value === 'string') {
        const bytes = (0, _utils.hexToBytes)(value);
        validateBytes(bytes, length);
        return bytes;
    }
    throw new Error(`Invalid value: Expected an instance of Uint8Array or hexadecimal string.`);
}
function getBytesUnsafe(value, length) {
    if (value instanceof Uint8Array) {
        (0, _utils.assert)(value.length === length, `Invalid value: Must be a ${length}-byte byte array.`);
        return value;
    }
    if (typeof value === 'string') {
        return getBytesUnsafe((0, _utils.hexToBytes)(value), length);
    }
    throw new Error(`Invalid value: Expected an instance of Uint8Array or hexadecimal string.`);
}
/**
 * Validate that the specified `Uint8Array` is not empty and has the specified
 * length.
 *
 * @param bytes - The `Uint8Array` to validate.
 * @param length - The length to validate the `Uint8Array` against.
 * @throws An error if the `Uint8Array` is empty or has the wrong length.
 */ function validateBytes(bytes, length) {
    if (!isValidBytesKey(bytes, length)) {
        throw new Error(`Invalid value: Must be a non-zero ${length}-byte byte array.`);
    }
}
const decodeBase58check = (value)=>{
    const base58Check = (0, _base.base58check)(_sha256.sha256);
    try {
        return base58Check.decode(value);
    } catch  {
        throw new Error(`Invalid extended key: Value is not base58-encoded, or the checksum is invalid.`);
    }
};
const encodeBase58check = (value)=>{
    const base58Check = (0, _base.base58check)(_sha256.sha256);
    return base58Check.encode(value);
};
const getFingerprint = (publicKey)=>{
    if (!isValidBytesKey(publicKey, 33)) {
        throw new Error(`Invalid public key: The key must be a 33-byte, non-zero byte array.`);
    }
    const bytes = (0, _ripemd160.ripemd160)((0, _sha256.sha256)(publicKey));
    const view = (0, _utils.createDataView)(bytes);
    return view.getUint32(0, false);
};
function mnemonicPhraseToBytes(mnemonicPhrase) {
    const words = mnemonicPhrase.split(' ');
    const indices = words.map((word)=>{
        const index = _english.wordlist.indexOf(word);
        (0, _utils.assert)(index !== -1, `Invalid mnemonic phrase: Unknown word "${word}".`);
        return index;
    });
    return new Uint8Array(new Uint16Array(indices).buffer);
}
function validateCurve(curveName) {
    if (!curveName || typeof curveName !== 'string') {
        throw new Error('Invalid curve: Must specify a curve.');
    }
    if (!Object.keys(_curves.curves).includes(curveName)) {
        throw new Error(`Invalid curve: Only the following curves are supported: ${Object.keys(_curves.curves).join(', ')}.`);
    }
}
function numberToUint32(value) {
    const bytes = new Uint8Array(4);
    const view = (0, _utils.createDataView)(bytes);
    view.setUint32(0, value, false);
    return bytes;
}

//# sourceMappingURL=utils.js.map