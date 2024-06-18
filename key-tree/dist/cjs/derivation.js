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
    deriveKeyFromPath: function() {
        return deriveKeyFromPath;
    },
    validatePathSegment: function() {
        return validatePathSegment;
    }
});
const _utils = require("@metamask/utils");
const _BIP44CoinTypeNode = require("./BIP44CoinTypeNode");
const _BIP44Node = require("./BIP44Node");
const _constants = require("./constants");
const _curves = require("./curves");
const _derivers = require("./derivers");
const _SLIP10Node = require("./SLIP10Node");
async function deriveKeyFromPath(args) {
    const { path, depth = path.length } = args;
    const node = 'node' in args ? args.node : undefined;
    const curve = 'curve' in args ? args.curve : node?.curve;
    if (node && !(node instanceof _SLIP10Node.SLIP10Node) && !(node instanceof _BIP44Node.BIP44Node) && !(node instanceof _BIP44CoinTypeNode.BIP44CoinTypeNode)) {
        throw new Error('Invalid arguments: Node must be a SLIP-10 node or a BIP-44 node when provided.');
    }
    if (!curve) {
        throw new Error('Invalid arguments: Must specify either a parent node or curve.');
    }
    validatePathSegment(path, Boolean(node?.privateKey) || Boolean(node?.publicKey), depth);
    // Derive through each part of path. `pathSegment` needs to be cast because
    // `HDPathTuple.reduce()` doesn't work. Note that the first element of the
    // path can be a Uint8Array.
    return await path.reduce(async (promise, pathNode, index)=>{
        const derivedNode = await promise;
        if (typeof pathNode === 'string') {
            const [pathType, pathPart] = pathNode.split(':');
            (0, _utils.assert)(pathType);
            (0, _utils.assert)(pathPart);
            (0, _utils.assert)(hasDeriver(pathType), `Unknown derivation type: "${pathType}".`);
            const deriver = _derivers.derivers[pathType];
            return await deriver.deriveChildKey({
                path: pathPart,
                node: derivedNode,
                curve: (0, _curves.getCurveByName)(curve)
            });
        }
        // Only the first path segment can be a Uint8Array.
        (0, _utils.assert)(index === 0, getMalformedError());
        return await _derivers.derivers.bip39.deriveChildKey({
            path: pathNode,
            node: derivedNode,
            curve: (0, _curves.getCurveByName)(curve)
        });
    }, Promise.resolve(node));
}
/**
 * Check if the given path type is a valid deriver.
 *
 * @param pathType - The path type to check.
 * @returns Whether the path type is a valid deriver.
 */ function hasDeriver(pathType) {
    return pathType in _derivers.derivers;
}
function validatePathSegment(path, hasKey, depth) {
    if (path.length === 0) {
        throw new Error(`Invalid HD path segment: The segment must not be empty.`);
    }
    let startsWithBip39 = false;
    path.forEach((node, index)=>{
        if (index === 0) {
            startsWithBip39 = node instanceof Uint8Array || _constants.BIP_39_PATH_REGEX.test(node);
            if (// TypeScript is unable to infer that `node` is a string here, so we
            // need to explicitly check it again.
            !(node instanceof Uint8Array) && !startsWithBip39 && !_constants.BIP_32_PATH_REGEX.test(node) && !_constants.SLIP_10_PATH_REGEX.test(node)) {
                throw getMalformedError();
            }
        } else if (node instanceof Uint8Array || !_constants.BIP_32_PATH_REGEX.test(node) && !_constants.SLIP_10_PATH_REGEX.test(node)) {
            throw getMalformedError();
        }
    });
    if (depth === _constants.MIN_BIP_44_DEPTH && (!startsWithBip39 || path.length !== 1)) {
        throw new Error(`Invalid HD path segment: The segment must consist of a single BIP-39 node for depths of ${_constants.MIN_BIP_44_DEPTH}. Received: "${String(path)}".`);
    }
    if (!hasKey && !startsWithBip39) {
        throw new Error('Invalid derivation parameters: Must specify parent key if the first node of the path segment is not a BIP-39 node.');
    }
    if (hasKey && startsWithBip39) {
        throw new Error('Invalid derivation parameters: May not specify parent key if the path segment starts with a BIP-39 node.');
    }
    const pathWithoutKey = startsWithBip39 ? path.slice(1) : path;
    if (pathWithoutKey.length > 0) {
        const firstSegmentType = pathWithoutKey[0]?.split(':')[0];
        (0, _utils.assert)(firstSegmentType);
        (0, _utils.assert)(pathWithoutKey.every((segment)=>segment.startsWith(`${firstSegmentType}:`)), `Invalid HD path segment: Cannot mix 'bip32' and 'slip10' path segments.`);
    }
}
/**
 * Get the error for a malformed path segment.
 *
 * @returns The error.
 */ function getMalformedError() {
    return new Error('Invalid HD path segment: The path segment is malformed.');
}

//# sourceMappingURL=derivation.js.map