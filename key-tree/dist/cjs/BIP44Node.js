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
        return BIP44Node;
    },
    validateBIP44Depth: function() {
        return validateBIP44Depth;
    }
});
const _utils = require("@metamask/utils");
const _constants = require("./constants");
const _extendedkeys = require("./extended-keys");
const _SLIP10Node = require("./SLIP10Node");
const _utils1 = require("./utils");
function _check_private_redeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _class_apply_descriptor_get(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
function _class_apply_descriptor_set(receiver, descriptor, value) {
    if (descriptor.set) {
        descriptor.set.call(receiver, value);
    } else {
        if (!descriptor.writable) {
            throw new TypeError("attempted to set read only private field");
        }
        descriptor.value = value;
    }
}
function _class_extract_field_descriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
}
function _class_private_field_get(receiver, privateMap) {
    var descriptor = _class_extract_field_descriptor(receiver, privateMap, "get");
    return _class_apply_descriptor_get(receiver, descriptor);
}
function _class_private_field_init(obj, privateMap, value) {
    _check_private_redeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _class_private_field_set(receiver, privateMap, value) {
    var descriptor = _class_extract_field_descriptor(receiver, privateMap, "set");
    _class_apply_descriptor_set(receiver, descriptor, value);
    return value;
}
var _node = /*#__PURE__*/ new WeakMap();
class BIP44Node {
    /**
   * Wrapper of the {@link fromExtendedKey} function. Refer to that function
   * for documentation.
   *
   * @param json - The JSON representation of a SLIP-10 node.
   */ static async fromJSON(json) {
        return BIP44Node.fromExtendedKey(json);
    }
    /**
   * Create a new BIP-44 node from a key and chain code. You must specify
   * either a private key or a public key. When specifying a private key,
   * the public key will be derived from the private key.
   *
   * All parameters are stringently validated, and an error is thrown if
   * validation fails.
   *
   * @param options - An object containing the extended key, or an extended
   * public (xpub) or private (xprv) key.
   * @param options.depth - The depth of the node.
   * @param options.privateKey - The private key for the node.
   * @param options.publicKey - The public key for the node. If a private key is
   * specified, this parameter is ignored.
   * @param options.chainCode - The chain code for the node.
   */ static async fromExtendedKey(options) {
        if (typeof options === 'string') {
            const extendedKey = (0, _extendedkeys.decodeExtendedKey)(options);
            const { chainCode, depth, parentFingerprint, index } = extendedKey;
            if (extendedKey.version === _extendedkeys.PRIVATE_KEY_VERSION) {
                const { privateKey } = extendedKey;
                return BIP44Node.fromExtendedKey({
                    depth,
                    parentFingerprint,
                    index,
                    privateKey,
                    chainCode
                });
            }
            const { publicKey } = extendedKey;
            return BIP44Node.fromExtendedKey({
                depth,
                parentFingerprint,
                index,
                publicKey,
                chainCode
            });
        }
        const { privateKey, publicKey, chainCode, depth, parentFingerprint, index } = options;
        validateBIP44Depth(depth);
        const node = await _SLIP10Node.SLIP10Node.fromExtendedKey({
            privateKey,
            publicKey,
            chainCode,
            depth,
            parentFingerprint,
            index,
            curve: 'secp256k1'
        });
        return new BIP44Node(node);
    }
    /**
   * Create a new BIP-44 node from a derivation path. The derivation path
   * must be rooted, i.e. it must begin with a BIP-39 node, given as a string of
   * the form `bip39:MNEMONIC`, where `MNEMONIC` is a space-separated list of
   * BIP-39 seed phrase words.
   *
   * All parameters are stringently validated, and an error is thrown if
   * validation fails.
   *
   * Recall that a BIP-44 HD tree path consists of the following nodes:
   *
   * `m / 44' / coin_type' / account' / change / address_index`
   *
   * With the following depths:
   *
   * `0 / 1 / 2 / 3 / 4 / 5`
   *
   * @param options - An object containing the derivation path.
   * @param options.derivationPath - The rooted HD tree path that will be used
   * to derive the key of this node.
   */ static async fromDerivationPath({ derivationPath }) {
        validateBIP44Depth(derivationPath.length - 1);
        validateBIP44DerivationPath(derivationPath, _constants.MIN_BIP_44_DEPTH);
        const node = await _SLIP10Node.SLIP10Node.fromDerivationPath({
            derivationPath,
            curve: 'secp256k1'
        });
        return new BIP44Node(node);
    }
    get depth() {
        return _class_private_field_get(this, _node).depth;
    }
    get privateKeyBytes() {
        return _class_private_field_get(this, _node).privateKeyBytes;
    }
    get publicKeyBytes() {
        return _class_private_field_get(this, _node).publicKeyBytes;
    }
    get chainCodeBytes() {
        return _class_private_field_get(this, _node).chainCodeBytes;
    }
    get privateKey() {
        return _class_private_field_get(this, _node).privateKey;
    }
    get publicKey() {
        return _class_private_field_get(this, _node).publicKey;
    }
    get compressedPublicKey() {
        return _class_private_field_get(this, _node).compressedPublicKey;
    }
    get compressedPublicKeyBytes() {
        return _class_private_field_get(this, _node).compressedPublicKeyBytes;
    }
    get chainCode() {
        return _class_private_field_get(this, _node).chainCode;
    }
    get address() {
        return _class_private_field_get(this, _node).address;
    }
    get masterFingerprint() {
        return _class_private_field_get(this, _node).masterFingerprint;
    }
    get parentFingerprint() {
        return _class_private_field_get(this, _node).parentFingerprint;
    }
    get fingerprint() {
        return _class_private_field_get(this, _node).fingerprint;
    }
    get index() {
        return _class_private_field_get(this, _node).index;
    }
    get extendedKey() {
        const data = {
            depth: this.depth,
            parentFingerprint: this.parentFingerprint,
            index: this.index,
            chainCode: this.chainCodeBytes
        };
        if (this.privateKeyBytes) {
            return (0, _extendedkeys.encodeExtendedKey)({
                ...data,
                version: _extendedkeys.PRIVATE_KEY_VERSION,
                privateKey: this.privateKeyBytes
            });
        }
        return (0, _extendedkeys.encodeExtendedKey)({
            ...data,
            version: _extendedkeys.PUBLIC_KEY_VERSION,
            publicKey: this.publicKeyBytes
        });
    }
    get curve() {
        return _class_private_field_get(this, _node).curve;
    }
    /**
   * Get a neutered version of this node, i.e. a node without a private key.
   *
   * @returns A neutered version of this node.
   */ neuter() {
        const node = _class_private_field_get(this, _node).neuter();
        return new BIP44Node(node);
    }
    /**
   * Derives a child of the key contains be this node and returns a new
   * {@link BIP44Node} containing the child key.
   *
   * The specified path must be a valid HD path from this node, per BIP-44.
   * At present, this means that the path must consist of no more than 5 BIP-32
   * nodes, depending on the depth of this node.
   *
   * Recall that a BIP-44 HD tree path consists of the following nodes:
   *
   * `m / 44' / coin_type' / account' / change / address_index`
   *
   * With the following depths:
   *
   * `0 / 1 / 2 / 3 / 4 / 5`
   *
   * @param path - The partial (non-rooted) BIP-44 HD tree path will be used
   * to derive a child key from the parent key contained within this node.
   * @returns The {@link BIP44Node} corresponding to the derived child key.
   */ async derive(path) {
        if (this.depth === _constants.MAX_BIP_44_DEPTH) {
            throw new Error('Illegal operation: This HD tree node is already a leaf node.');
        }
        const newDepth = this.depth + path.length;
        validateBIP44Depth(newDepth);
        validateBIP44DerivationPath(path, this.depth + 1);
        const node = await _class_private_field_get(this, _node).derive(path);
        return new BIP44Node(node);
    }
    // This is documented in the interface of this class.
    toJSON() {
        return {
            depth: this.depth,
            masterFingerprint: this.masterFingerprint,
            parentFingerprint: this.parentFingerprint,
            index: this.index,
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            chainCode: this.chainCode
        };
    }
    constructor(node){
        _class_private_field_init(this, _node, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _node, node);
        Object.freeze(this);
    }
}
function validateBIP44Depth(depth) {
    (0, _SLIP10Node.validateBIP32Depth)(depth);
    if (depth < _constants.MIN_BIP_44_DEPTH || depth > _constants.MAX_BIP_44_DEPTH) {
        throw new Error(`Invalid HD tree path depth: The depth must be a positive integer N such that 0 <= N <= 5. Received: "${depth}"`);
    }
}
/**
 * Ensures that the given derivation is valid by BIP-44.
 *
 * Recall that a BIP-44 HD tree path consists of the following nodes:
 *
 * `m / 44' / coin_type' / account' / change / address_index`
 *
 * With the following depths:
 *
 * `0 / 1 / 2 / 3 / 4 / 5`
 *
 * @param path - The path to validate.
 * @param startingDepth - The depth of the first node of the derivation path.
 */ function validateBIP44DerivationPath(path, startingDepth) {
    path.forEach((nodeToken, index)=>{
        const currentDepth = startingDepth + index;
        if (currentDepth === _constants.MIN_BIP_44_DEPTH) {
            if (!(nodeToken instanceof Uint8Array) && !_constants.BIP_39_PATH_REGEX.test(nodeToken)) {
                throw new Error('Invalid derivation path: The "m" / seed node (depth 0) must be a BIP-39 node.');
            }
            return;
        }
        (0, _utils.assert)(typeof nodeToken === 'string');
        // eslint-disable-next-line default-case
        switch(currentDepth){
            case 1:
                if (nodeToken !== _constants.BIP44PurposeNodeToken) {
                    throw new Error(`Invalid derivation path: The "purpose" node (depth 1) must be the string "${_constants.BIP44PurposeNodeToken}".`);
                }
                break;
            case 2:
                if (!_constants.BIP_32_PATH_REGEX.test(nodeToken) || !(0, _utils1.isHardened)(nodeToken)) {
                    throw new Error('Invalid derivation path: The "coin_type" node (depth 2) must be a hardened BIP-32 node.');
                }
                break;
            case 3:
                if (!_constants.BIP_32_PATH_REGEX.test(nodeToken) || !(0, _utils1.isHardened)(nodeToken)) {
                    throw new Error('Invalid derivation path: The "account" node (depth 3) must be a hardened BIP-32 node.');
                }
                break;
            case 4:
                if (!_constants.BIP_32_PATH_REGEX.test(nodeToken)) {
                    throw new Error('Invalid derivation path: The "change" node (depth 4) must be a BIP-32 node.');
                }
                break;
            case _constants.MAX_BIP_44_DEPTH:
                if (!_constants.BIP_32_PATH_REGEX.test(nodeToken)) {
                    throw new Error('Invalid derivation path: The "address_index" node (depth 5) must be a BIP-32 node.');
                }
                break;
        }
    });
}

//# sourceMappingURL=BIP44Node.js.map