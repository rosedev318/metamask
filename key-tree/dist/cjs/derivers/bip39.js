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
    bip39MnemonicToMultipath: function() {
        return bip39MnemonicToMultipath;
    },
    deriveChildKey: function() {
        return deriveChildKey;
    },
    createBip39KeyFromSeed: function() {
        return createBip39KeyFromSeed;
    }
});
const _scurebip39 = require("@metamask/scure-bip39");
const _english = require("@metamask/scure-bip39/dist/wordlists/english");
const _utils = require("@metamask/utils");
const _hmac = require("@noble/hashes/hmac");
const _sha512 = require("@noble/hashes/sha512");
const _constants = require("../constants");
const _SLIP10Node = require("../SLIP10Node");
const _utils1 = require("../utils");
function bip39MnemonicToMultipath(mnemonic) {
    return `bip39:${mnemonic.toLowerCase().trim()}`;
}
async function deriveChildKey({ path, curve }) {
    return createBip39KeyFromSeed(await (0, _scurebip39.mnemonicToSeed)(path, _english.wordlist), curve);
}
async function createBip39KeyFromSeed(seed, curve) {
    (0, _utils.assert)(seed.length >= 16 && seed.length <= 64, 'Invalid seed: The seed must be between 16 and 64 bytes long.');
    const key = (0, _hmac.hmac)(_sha512.sha512, curve.secret, seed);
    const privateKey = key.slice(0, _constants.BYTES_KEY_LENGTH);
    const chainCode = key.slice(_constants.BYTES_KEY_LENGTH);
    (0, _utils.assert)(curve.isValidPrivateKey(privateKey), 'Invalid private key: The private key must greater than 0 and less than the curve order.');
    const masterFingerprint = (0, _utils1.getFingerprint)(await curve.getPublicKey(privateKey, true));
    return _SLIP10Node.SLIP10Node.fromExtendedKey({
        privateKey,
        chainCode,
        masterFingerprint,
        depth: 0,
        parentFingerprint: 0,
        index: 0,
        curve: curve.name
    });
}

//# sourceMappingURL=bip39.js.map