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
    BIP_44_COIN_TYPE_DEPTH: function() {
        return BIP_44_COIN_TYPE_DEPTH;
    },
    BIP44CoinTypeNode: function() {
        return BIP44CoinTypeNode;
    },
    deriveBIP44AddressKey: function() {
        return deriveBIP44AddressKey;
    },
    getBIP44AddressKeyDeriver: function() {
        return getBIP44AddressKeyDeriver;
    }
});
const _utils = require("@metamask/utils");
const _BIP44Node = require("./BIP44Node");
const _constants = require("./constants");
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
const BIP_44_COIN_TYPE_DEPTH = 2;
var _node = /*#__PURE__*/ new WeakMap();
class BIP44CoinTypeNode {
    /**
   * Constructs a BIP-44 `coin_type` node. `coin_type` is the index
   * specifying the protocol for which deeper keys are intended. For the
   * authoritative list of coin types, please see
   * [SLIP-44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md).
   *
   * Recall that a BIP-44 HD tree path consists of the following nodes:
   *
   * `m / 44' / coin_type' / account' / change / address_index`
   *
   * With the following depths:
   *
   * `0 / 1 / 2 / 3 / 4 / 5`
   *
   * @param json - The {@link JsonBIP44Node} for the key of this node.
   * @param coin_type - The coin_type index of this node. Must be a non-negative
   * integer.
   */ static async fromJSON(json, coin_type) {
        validateCoinType(coin_type);
        validateCoinTypeNodeDepth(json.depth);
        const node = await _BIP44Node.BIP44Node.fromExtendedKey({
            depth: json.depth,
            index: json.index,
            parentFingerprint: json.parentFingerprint,
            chainCode: (0, _utils1.hexStringToBytes)(json.chainCode),
            privateKey: (0, _utils1.nullableHexStringToBytes)(json.privateKey),
            publicKey: (0, _utils1.hexStringToBytes)(json.publicKey)
        });
        return new BIP44CoinTypeNode(node, coin_type);
    }
    /**
   * Constructs a BIP-44 `coin_type` node. `coin_type` is the index
   * specifying the protocol for which deeper keys are intended. For the
   * authoritative list of coin types, please see
   * [SLIP-44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md).
   *
   * Recall that a BIP-44 HD tree path consists of the following nodes:
   *
   * `m / 44' / coin_type' / account' / change / address_index`
   *
   * With the following depths:
   *
   * `0 / 1 / 2 / 3 / 4 / 5`
   *
   * @param derivationPath - The derivation path for the key of this node.
   */ static async fromDerivationPath(derivationPath) {
        validateCoinTypeNodeDepth(derivationPath.length - 1);
        const node = await _BIP44Node.BIP44Node.fromDerivationPath({
            derivationPath
        });
        // Split the bip32 string token and extract the coin_type index.
        const pathPart = derivationPath[BIP_44_COIN_TYPE_DEPTH].split(':')[1]?.replace(`'`, '');
        (0, _utils.assert)(pathPart, 'Invalid derivation path.');
        const coinType = Number.parseInt(pathPart, 10);
        return new BIP44CoinTypeNode(node, coinType);
    }
    /**
   * Constructs a BIP-44 `coin_type` node. `coin_type` is the index
   * specifying the protocol for which deeper keys are intended. For the
   * authoritative list of coin types, please see
   * [SLIP-44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md).
   *
   * Recall that a BIP-44 HD tree path consists of the following nodes:
   *
   * `m / 44' / coin_type' / account' / change / address_index`
   *
   * With the following depths:
   *
   * `0 / 1 / 2 / 3 / 4 / 5`
   *
   * @param node - The {@link BIP44Node} for the key of this node.
   * @param coin_type - The coin_type index of this node. Must be a non-negative
   * integer.
   */ static async fromNode(node, coin_type) {
        if (!(node instanceof _BIP44Node.BIP44Node)) {
            throw new Error('Invalid node: Expected an instance of BIP44Node.');
        }
        validateCoinType(coin_type);
        validateCoinTypeNodeDepth(node.depth);
        // TODO: Make this function not async in a future version.
        return Promise.resolve(new BIP44CoinTypeNode(node, coin_type));
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
    get curve() {
        return _class_private_field_get(this, _node).curve;
    }
    get extendedKey() {
        return _class_private_field_get(this, _node).extendedKey;
    }
    /**
   * Derives a BIP-44 `address_index` key corresponding to the path of this
   * node and the specified `account`, `change`, and `address_index` values.
   * `address_index` keys are normally the keys used to generate user account
   * addresses.
   *
   * Recall that a BIP-44 HD tree path consists of the following nodes:
   *
   * `m / 44' / coin_type' / account' / change / address_index`
   *
   * With the following depths:
   *
   * `0 / 1 / 2 / 3 / 4 / 5`
   *
   * @param indices - The BIP-44 index values to use in key derivation.
   * @param indices.account - The `account` index. Default: `0`
   * @param indices.change - The `change` index. Default: `0`
   * @param indices.address_index - The `address_index` index.
   * @returns The derived BIP-44 `address_index` node.
   */ async deriveBIP44AddressKey({ account = 0, change = 0, address_index }) {
        return await _class_private_field_get(this, _node).derive((0, _utils1.getBIP44CoinTypeToAddressPathTuple)({
            account,
            change,
            address_index
        }));
    }
    toJSON() {
        return {
            ..._class_private_field_get(this, _node).toJSON(),
            coin_type: this.coin_type,
            path: this.path
        };
    }
    // Constructors cannot use hash names.
    // eslint-disable-next-line no-restricted-syntax
    constructor(node, coin_type){
        _class_private_field_init(this, _node, {
            writable: true,
            value: void 0
        });
        _define_property(this, "path", void 0);
        _define_property(this, "coin_type", void 0);
        _class_private_field_set(this, _node, node);
        this.coin_type = coin_type;
        this.path = (0, _utils1.getBIP44CoinTypePathString)(coin_type);
        Object.freeze(this);
    }
}
/**
 * Validates the depth of a `coin_type` node. Simply, ensures that it is the
 * number `2`. An error is thrown if validation fails.
 *
 * @param depth - The depth to validate.
 */ function validateCoinTypeNodeDepth(depth) {
    if (depth !== BIP_44_COIN_TYPE_DEPTH) {
        throw new Error(`Invalid depth: Coin type nodes must be of depth ${BIP_44_COIN_TYPE_DEPTH}. Received: "${depth}"`);
    }
}
/**
 * Validates that the coin type is a non-negative integer number. An error is
 * thrown if validation fails.
 *
 * @param coin_type - The coin type to validate.
 */ function validateCoinType(coin_type) {
    if (typeof coin_type !== 'number' || !Number.isInteger(coin_type) || coin_type < 0) {
        throw new Error('Invalid coin type: The specified coin type must be a non-negative integer number.');
    }
}
async function deriveBIP44AddressKey(parentKeyOrNode, { account = 0, change = 0, address_index }) {
    const path = (0, _utils1.getBIP44CoinTypeToAddressPathTuple)({
        account,
        change,
        address_index
    });
    const node = await getNode(parentKeyOrNode);
    const childNode = await (0, _SLIP10Node.deriveChildNode)({
        path,
        node
    });
    return new _BIP44Node.BIP44Node(childNode);
}
async function getBIP44AddressKeyDeriver(node, accountAndChangeIndices) {
    const { account = 0, change = 0 } = accountAndChangeIndices ?? {};
    const actualNode = await getNode(node);
    const accountNode = (0, _utils1.getHardenedBIP32NodeToken)(account);
    const changeNode = (0, _utils1.getBIP32NodeToken)(change);
    const bip44AddressKeyDeriver = async (address_index, isHardened = false)=>{
        const slip10Node = await (0, _SLIP10Node.deriveChildNode)({
            path: [
                accountNode,
                changeNode,
                isHardened ? (0, _utils1.getHardenedBIP32NodeToken)(address_index) : (0, _utils1.getUnhardenedBIP32NodeToken)(address_index)
            ],
            node: actualNode
        });
        return new _BIP44Node.BIP44Node(slip10Node);
    };
    bip44AddressKeyDeriver.coin_type = actualNode.coin_type;
    bip44AddressKeyDeriver.path = (0, _utils1.getBIP44ChangePathString)(actualNode.path, {
        account,
        change
    });
    Object.freeze(bip44AddressKeyDeriver);
    return bip44AddressKeyDeriver;
}
/**
 * Get a BIP-44 coin type node from a JSON node or extended key string. If an existing coin type
 * node is provided, the same node is returned.
 *
 * The depth of the node is validated to be a valid coin type node.
 *
 * @param node - A BIP-44 coin type node, JSON node or extended key.
 */ async function getNode(node) {
    if (node instanceof BIP44CoinTypeNode) {
        validateCoinTypeNodeDepth(node.depth);
        return node;
    }
    if (typeof node === 'string') {
        const bip44Node = await _BIP44Node.BIP44Node.fromExtendedKey(node);
        const coinTypeNode = await BIP44CoinTypeNode.fromNode(bip44Node, bip44Node.index - _constants.BIP_32_HARDENED_OFFSET);
        validateCoinTypeNodeDepth(coinTypeNode.depth);
        return coinTypeNode;
    }
    return BIP44CoinTypeNode.fromJSON(node, node.coin_type);
}

//# sourceMappingURL=BIP44CoinTypeNode.js.map