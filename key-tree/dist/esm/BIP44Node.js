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
import { assert } from '@metamask/utils';
import { BIP44PurposeNodeToken, BIP_32_PATH_REGEX, BIP_39_PATH_REGEX, MAX_BIP_44_DEPTH, MIN_BIP_44_DEPTH } from './constants';
import { decodeExtendedKey, encodeExtendedKey, PRIVATE_KEY_VERSION, PUBLIC_KEY_VERSION } from './extended-keys';
import { SLIP10Node, validateBIP32Depth } from './SLIP10Node';
import { isHardened } from './utils';
var _node = /*#__PURE__*/ new WeakMap();
/**
 * A wrapper for BIP-44 Hierarchical Deterministic (HD) tree nodes, i.e.
 * cryptographic keys used to generate keypairs and addresses for cryptocurrency
 * protocols.
 *
 * This class contains methods and fields that may not serialize well. Use
 * {@link BIP44Node.toJSON} to get a JSON-compatible representation.
 */ export class BIP44Node {
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
            const extendedKey = decodeExtendedKey(options);
            const { chainCode, depth, parentFingerprint, index } = extendedKey;
            if (extendedKey.version === PRIVATE_KEY_VERSION) {
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
        const node = await SLIP10Node.fromExtendedKey({
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
        validateBIP44DerivationPath(derivationPath, MIN_BIP_44_DEPTH);
        const node = await SLIP10Node.fromDerivationPath({
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
            return encodeExtendedKey({
                ...data,
                version: PRIVATE_KEY_VERSION,
                privateKey: this.privateKeyBytes
            });
        }
        return encodeExtendedKey({
            ...data,
            version: PUBLIC_KEY_VERSION,
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
        if (this.depth === MAX_BIP_44_DEPTH) {
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
/**
 * Validates a BIP-44 path depth. Effectively, asserts that the depth is an
 * integer `number` N such that 0 <= N <= 5. Throws an error if validation
 * fails.
 *
 * @param depth - The depth to validate.
 */ export function validateBIP44Depth(depth) {
    validateBIP32Depth(depth);
    if (depth < MIN_BIP_44_DEPTH || depth > MAX_BIP_44_DEPTH) {
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
        if (currentDepth === MIN_BIP_44_DEPTH) {
            if (!(nodeToken instanceof Uint8Array) && !BIP_39_PATH_REGEX.test(nodeToken)) {
                throw new Error('Invalid derivation path: The "m" / seed node (depth 0) must be a BIP-39 node.');
            }
            return;
        }
        assert(typeof nodeToken === 'string');
        // eslint-disable-next-line default-case
        switch(currentDepth){
            case 1:
                if (nodeToken !== BIP44PurposeNodeToken) {
                    throw new Error(`Invalid derivation path: The "purpose" node (depth 1) must be the string "${BIP44PurposeNodeToken}".`);
                }
                break;
            case 2:
                if (!BIP_32_PATH_REGEX.test(nodeToken) || !isHardened(nodeToken)) {
                    throw new Error('Invalid derivation path: The "coin_type" node (depth 2) must be a hardened BIP-32 node.');
                }
                break;
            case 3:
                if (!BIP_32_PATH_REGEX.test(nodeToken) || !isHardened(nodeToken)) {
                    throw new Error('Invalid derivation path: The "account" node (depth 3) must be a hardened BIP-32 node.');
                }
                break;
            case 4:
                if (!BIP_32_PATH_REGEX.test(nodeToken)) {
                    throw new Error('Invalid derivation path: The "change" node (depth 4) must be a BIP-32 node.');
                }
                break;
            case MAX_BIP_44_DEPTH:
                if (!BIP_32_PATH_REGEX.test(nodeToken)) {
                    throw new Error('Invalid derivation path: The "address_index" node (depth 5) must be a BIP-32 node.');
                }
                break;
        }
    });
}

//# sourceMappingURL=BIP44Node.js.map