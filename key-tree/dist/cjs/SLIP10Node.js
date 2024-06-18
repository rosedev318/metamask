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
    SLIP10Node: function() {
        return SLIP10Node;
    },
    validateBIP32Depth: function() {
        return validateBIP32Depth;
    },
    validateParentFingerprint: function() {
        return validateParentFingerprint;
    },
    validateMasterParentFingerprint: function() {
        return validateMasterParentFingerprint;
    },
    validateRootIndex: function() {
        return validateRootIndex;
    },
    deriveChildNode: function() {
        return deriveChildNode;
    }
});
const _utils = require("@metamask/utils");
const _constants = require("./constants");
const _curves = require("./curves");
const _derivation = require("./derivation");
const _bip32 = require("./derivers/bip32");
const _utils1 = require("./utils");
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
class SLIP10Node {
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
        const chainCodeBytes = (0, _utils1.getBytes)(chainCode, _constants.BYTES_KEY_LENGTH);
        (0, _utils1.validateCurve)(curve);
        validateBIP32Depth(depth);
        (0, _utils1.validateBIP32Index)(index);
        validateRootIndex(index, depth);
        validateParentFingerprint(parentFingerprint, depth);
        validateMasterParentFingerprint(masterFingerprint, parentFingerprint, depth);
        const curveObject = (0, _curves.getCurveByName)(curve);
        if (privateKey) {
            const privateKeyBytes = (0, _utils1.getBytesUnsafe)(privateKey, _constants.BYTES_KEY_LENGTH);
            (0, _utils.assert)(curveObject.isValidPrivateKey(privateKeyBytes), `Invalid private key: Value is not a valid ${curve} private key.`);
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
            const publicKeyBytes = (0, _utils1.getBytes)(publicKey, curveObject.publicKeyLength);
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
        (0, _utils1.validateCurve)(curve);
        if (!derivationPath) {
            throw new Error('Invalid options: Must provide a derivation path.');
        }
        if (derivationPath.length === 0) {
            throw new Error('Invalid derivation path: May not specify an empty derivation path.');
        }
        return await (0, _derivation.deriveKeyFromPath)({
            path: derivationPath,
            depth: derivationPath.length - 1,
            curve
        });
    }
    get chainCode() {
        return (0, _utils.bytesToHex)(this.chainCodeBytes);
    }
    get privateKey() {
        if (this.privateKeyBytes) {
            return (0, _utils.bytesToHex)(this.privateKeyBytes);
        }
        return undefined;
    }
    get publicKey() {
        return (0, _utils.bytesToHex)(this.publicKeyBytes);
    }
    get compressedPublicKeyBytes() {
        return (0, _curves.getCurveByName)(this.curve).compressPublicKey(this.publicKeyBytes);
    }
    get compressedPublicKey() {
        return (0, _utils.bytesToHex)(this.compressedPublicKeyBytes);
    }
    get address() {
        if (this.curve !== 'secp256k1') {
            throw new Error('Unable to get address for this node: Only secp256k1 is supported.');
        }
        return (0, _utils.bytesToHex)((0, _bip32.publicKeyToEthAddress)(this.publicKeyBytes));
    }
    get fingerprint() {
        return (0, _utils1.getFingerprint)(this.compressedPublicKeyBytes);
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
        (0, _utils.assert)(constructorGuard === _class_static_private_field_spec_get(SLIP10Node, SLIP10Node, _constructorGuard), 'SLIP10Node can only be constructed using `SLIP10Node.fromJSON`, `SLIP10Node.fromExtendedKey`, or `SLIP10Node.fromDerivationPath`.');
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
function validateBIP32Depth(depth) {
    if (!(0, _utils1.isValidInteger)(depth)) {
        throw new Error(`Invalid HD tree path depth: The depth must be a positive integer. Received: "${String(depth)}".`);
    }
}
function validateParentFingerprint(parentFingerprint, depth) {
    if (!(0, _utils1.isValidInteger)(parentFingerprint)) {
        throw new Error(`Invalid parent fingerprint: The fingerprint must be a positive integer. Received: "${String(parentFingerprint)}".`);
    }
    if (depth === 0 && parentFingerprint !== 0) {
        throw new Error(`Invalid parent fingerprint: The fingerprint of the root node must be 0. Received: "${String(parentFingerprint)}".`);
    }
    if (depth > 0 && parentFingerprint === 0) {
        throw new Error(`Invalid parent fingerprint: The fingerprint of a child node must not be 0. Received: "${String(parentFingerprint)}".`);
    }
}
function validateMasterParentFingerprint(masterFingerprint, parentFingerprint, depth) {
    // The master fingerprint is optional.
    if (!masterFingerprint) {
        return;
    }
    if (depth >= 2 && masterFingerprint === parentFingerprint) {
        throw new Error(`Invalid parent fingerprint: The fingerprint of a child node cannot be equal to the master fingerprint. Received: "${String(parentFingerprint)}".`);
    }
}
function validateRootIndex(index, depth) {
    if (depth === 0 && index !== 0) {
        throw new Error(`Invalid index: The index of the root node must be 0. Received: "${String(index)}".`);
    }
}
async function deriveChildNode({ path, node }) {
    if (path.length === 0) {
        throw new Error('Invalid HD tree derivation path: Deriving a path of length 0 is not defined.');
    }
    // Note that we do not subtract 1 from the length of the path to the child,
    // unlike when we calculate the depth of a rooted path.
    const newDepth = node.depth + path.length;
    validateBIP32Depth(newDepth);
    return await (0, _derivation.deriveKeyFromPath)({
        path,
        node,
        depth: newDepth
    });
}

//# sourceMappingURL=SLIP10Node.js.map