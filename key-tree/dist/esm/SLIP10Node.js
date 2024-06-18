function _class_apply_descriptor_get(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
function _class_check_private_static_field_descriptor(descriptor, action) {
    if (descriptor === undefined) {
        throw new TypeError("attempted to " + action + " private static field before its declaration");
    }
}
function _class_static_private_field_spec_get(receiver, classConstructor, descriptor) {
    _class_check_private_static_access(receiver, classConstructor);
    _class_check_private_static_field_descriptor(descriptor, "get");
    return _class_apply_descriptor_get(receiver, descriptor);
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _class_check_private_static_access(receiver, classConstructor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
}
import { assert, bytesToHex } from '@metamask/utils';
import { BYTES_KEY_LENGTH } from './constants';
import { getCurveByName } from './curves';
import { deriveKeyFromPath } from './derivation';
import { publicKeyToEthAddress } from './derivers/bip32';
import { getBytes, getBytesUnsafe, getFingerprint, isValidInteger, validateBIP32Index, validateCurve } from './utils';
export class SLIP10Node {
    /**
   * Wrapper of the {@link fromExtendedKey} function. Refer to that function
   * for documentation.
   *
   * @param json - The JSON representation of a SLIP-10 node.
   */ static async fromJSON(json) {
        return SLIP10Node.fromExtendedKey(json);
    }
    /**
   * Create a new SLIP-10 node from a key and chain code. You must specify
   * either a private key or a public key. When specifying a private key,
   * the public key will be derived from the private key.
   *
   * All parameters are stringently validated, and an error is thrown if
   * validation fails.
   *
   * @param options - The options for the new node.
   * @param options.depth - The depth of the node.
   * @param options.masterFingerprint - The fingerprint of the master node, i.e., the
   * node at depth 0. May be undefined if this node was created from an extended
   * key.
   * @param options.parentFingerprint - The fingerprint of the parent key, or 0 if
   * the node is a master node.
   * @param options.index - The index of the node, or 0 if the node is a master node.
   * @param options.privateKey - The private key for the node.
   * @param options.publicKey - The public key for the node. If a private key is
   * specified, this parameter is ignored.
   * @param options.chainCode - The chain code for the node.
   * @param options.curve - The curve used by the node.
   */ static async fromExtendedKey({ depth, masterFingerprint, parentFingerprint, index, privateKey, publicKey, chainCode, curve }) {
        const chainCodeBytes = getBytes(chainCode, BYTES_KEY_LENGTH);
        validateCurve(curve);
        validateBIP32Depth(depth);
        validateBIP32Index(index);
        validateRootIndex(index, depth);
        validateParentFingerprint(parentFingerprint, depth);
        validateMasterParentFingerprint(masterFingerprint, parentFingerprint, depth);
        const curveObject = getCurveByName(curve);
        if (privateKey) {
            const privateKeyBytes = getBytesUnsafe(privateKey, BYTES_KEY_LENGTH);
            assert(curveObject.isValidPrivateKey(privateKeyBytes), `Invalid private key: Value is not a valid ${curve} private key.`);
            return new SLIP10Node({
                depth,
                masterFingerprint,
                parentFingerprint,
                index,
                chainCode: chainCodeBytes,
                privateKey: privateKeyBytes,
                publicKey: await curveObject.getPublicKey(privateKeyBytes),
                curve
            }, _class_static_private_field_spec_get(this, SLIP10Node, _constructorGuard));
        }
        if (publicKey) {
            const publicKeyBytes = getBytes(publicKey, curveObject.publicKeyLength);
            return new SLIP10Node({
                depth,
                masterFingerprint,
                parentFingerprint,
                index,
                chainCode: chainCodeBytes,
                publicKey: publicKeyBytes,
                curve
            }, _class_static_private_field_spec_get(this, SLIP10Node, _constructorGuard));
        }
        throw new Error('Invalid options: Must provide either a private key or a public key.');
    }
    /**
   * Create a new SLIP-10 node from a derivation path. The derivation path
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
   * @param options - The options for the new node.
   * @param options.derivationPath - The rooted HD tree path that will be used
   * to derive the key of this node.
   * @param options.curve - The curve used by the node.
   * @returns A new SLIP-10 node.
   */ static async fromDerivationPath({ derivationPath, curve }) {
        validateCurve(curve);
        if (!derivationPath) {
            throw new Error('Invalid options: Must provide a derivation path.');
        }
        if (derivationPath.length === 0) {
            throw new Error('Invalid derivation path: May not specify an empty derivation path.');
        }
        return await deriveKeyFromPath({
            path: derivationPath,
            depth: derivationPath.length - 1,
            curve
        });
    }
    get chainCode() {
        return bytesToHex(this.chainCodeBytes);
    }
    get privateKey() {
        if (this.privateKeyBytes) {
            return bytesToHex(this.privateKeyBytes);
        }
        return undefined;
    }
    get publicKey() {
        return bytesToHex(this.publicKeyBytes);
    }
    get compressedPublicKeyBytes() {
        return getCurveByName(this.curve).compressPublicKey(this.publicKeyBytes);
    }
    get compressedPublicKey() {
        return bytesToHex(this.compressedPublicKeyBytes);
    }
    get address() {
        if (this.curve !== 'secp256k1') {
            throw new Error('Unable to get address for this node: Only secp256k1 is supported.');
        }
        return bytesToHex(publicKeyToEthAddress(this.publicKeyBytes));
    }
    get fingerprint() {
        return getFingerprint(this.compressedPublicKeyBytes);
    }
    /**
   * Get a neutered version of this node, i.e. a node without a private key.
   *
   * @returns A neutered version of this node.
   */ neuter() {
        return new SLIP10Node({
            depth: this.depth,
            masterFingerprint: this.masterFingerprint,
            parentFingerprint: this.parentFingerprint,
            index: this.index,
            chainCode: this.chainCodeBytes,
            publicKey: this.publicKeyBytes,
            curve: this.curve
        }, _class_static_private_field_spec_get(SLIP10Node, SLIP10Node, _constructorGuard));
    }
    /**
   * Derives a child of the key contains be this node and returns a new
   * {@link SLIP10Node} containing the child key.
   *
   * The specified path must be a valid HD path from this node, per SLIP-10.
   *
   * @param path - The partial (non-rooted) SLIP-10 HD tree path will be used
   * to derive a child key from the parent key contained within this node.
   * @returns The {@link SLIP10Node} corresponding to the derived child key.
   */ async derive(path) {
        return await deriveChildNode({
            path,
            node: this
        });
    }
    // This is documented in the interface of this class.
    toJSON() {
        return {
            depth: this.depth,
            masterFingerprint: this.masterFingerprint,
            parentFingerprint: this.parentFingerprint,
            index: this.index,
            curve: this.curve,
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            chainCode: this.chainCode
        };
    }
    // eslint-disable-next-line no-restricted-syntax
    constructor({ depth, masterFingerprint, parentFingerprint, index, chainCode, privateKey, publicKey, curve }, constructorGuard){
        _define_property(this, "curve", void 0);
        _define_property(this, "depth", void 0);
        _define_property(this, "masterFingerprint", void 0);
        _define_property(this, "parentFingerprint", void 0);
        _define_property(this, "index", void 0);
        _define_property(this, "chainCodeBytes", void 0);
        _define_property(this, "privateKeyBytes", void 0);
        _define_property(this, "publicKeyBytes", void 0);
        assert(constructorGuard === _class_static_private_field_spec_get(SLIP10Node, SLIP10Node, _constructorGuard), 'SLIP10Node can only be constructed using `SLIP10Node.fromJSON`, `SLIP10Node.fromExtendedKey`, or `SLIP10Node.fromDerivationPath`.');
        this.depth = depth;
        this.masterFingerprint = masterFingerprint;
        this.parentFingerprint = parentFingerprint;
        this.index = index;
        this.chainCodeBytes = chainCode;
        this.privateKeyBytes = privateKey;
        this.publicKeyBytes = publicKey;
        this.curve = curve;
        Object.freeze(this);
    }
}
var _constructorGuard = {
    writable: true,
    value: Symbol('SLIP10Node.constructor')
};
/**
 * Validates a BIP-32 path depth. Effectively, asserts that the depth is an
 * integer `number`. Throws an error if validation fails.
 *
 * @param depth - The depth to validate.
 */ export function validateBIP32Depth(depth) {
    if (!isValidInteger(depth)) {
        throw new Error(`Invalid HD tree path depth: The depth must be a positive integer. Received: "${String(depth)}".`);
    }
}
/**
 * Validates a BIP-32 parent fingerprint. Effectively, asserts that the fingerprint is an
 * integer `number`. Throws an error if validation fails.
 *
 * @param parentFingerprint - The parent fingerprint to validate.
 * @param depth - The depth of the node to validate.
 * @throws If the parent fingerprint is not a positive integer, or invalid for
 * the current depth.
 */ export function validateParentFingerprint(parentFingerprint, depth) {
    if (!isValidInteger(parentFingerprint)) {
        throw new Error(`Invalid parent fingerprint: The fingerprint must be a positive integer. Received: "${String(parentFingerprint)}".`);
    }
    if (depth === 0 && parentFingerprint !== 0) {
        throw new Error(`Invalid parent fingerprint: The fingerprint of the root node must be 0. Received: "${String(parentFingerprint)}".`);
    }
    if (depth > 0 && parentFingerprint === 0) {
        throw new Error(`Invalid parent fingerprint: The fingerprint of a child node must not be 0. Received: "${String(parentFingerprint)}".`);
    }
}
/**
 * Validate that a given combination of master fingerprint and parent
 * fingerprint is valid for the given depth.
 *
 * @param masterFingerprint - The master fingerprint to validate.
 * @param parentFingerprint - The parent fingerprint to validate.
 * @param depth - The depth of the node to validate.
 * @throws If the combination of master fingerprint and parent fingerprint is
 * invalid for the given depth.
 */ export function validateMasterParentFingerprint(masterFingerprint, parentFingerprint, depth) {
    // The master fingerprint is optional.
    if (!masterFingerprint) {
        return;
    }
    if (depth >= 2 && masterFingerprint === parentFingerprint) {
        throw new Error(`Invalid parent fingerprint: The fingerprint of a child node cannot be equal to the master fingerprint. Received: "${String(parentFingerprint)}".`);
    }
}
/**
 * Validate that the index is zero for the root node.
 *
 * @param index - The index to validate.
 * @param depth - The depth of the node to validate.
 * @throws If the index is not zero for the root node.
 */ export function validateRootIndex(index, depth) {
    if (depth === 0 && index !== 0) {
        throw new Error(`Invalid index: The index of the root node must be 0. Received: "${String(index)}".`);
    }
}
/**
 * Derives a child key from the given parent key.
 *
 * @param options - The options to use when deriving the child key.
 * @param options.node - The node to derive from.
 * @param options.path - The path to the child node / key.
 * @returns The derived key and depth.
 */ export async function deriveChildNode({ path, node }) {
    if (path.length === 0) {
        throw new Error('Invalid HD tree derivation path: Deriving a path of length 0 is not defined.');
    }
    // Note that we do not subtract 1 from the length of the path to the child,
    // unlike when we calculate the depth of a rooted path.
    const newDepth = node.depth + path.length;
    validateBIP32Depth(newDepth);
    return await deriveKeyFromPath({
        path,
        node,
        depth: newDepth
    });
}

//# sourceMappingURL=SLIP10Node.js.map