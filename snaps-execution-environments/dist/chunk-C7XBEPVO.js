"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkZ7BOREC4js = require('./chunk-Z7BOREC4.js');

// src/common/utils.ts
var _rpcerrors = require('@metamask/rpc-errors');







var _utils = require('@metamask/utils');
var MAX_RESPONSE_JSON_SIZE = 64e6;
async function withTeardown(originalPromise, teardownRef) {
  const myTeardown = teardownRef.lastTeardown;
  return new Promise((resolve, reject) => {
    originalPromise.then((value) => {
      if (teardownRef.lastTeardown === myTeardown) {
        resolve(value);
      } else {
        _chunkZ7BOREC4js.log.call(void 0, 
          "Late promise received after Snap finished execution. Promise will be dropped."
        );
      }
    }).catch((reason) => {
      if (teardownRef.lastTeardown === myTeardown) {
        reject(reason);
      } else {
        _chunkZ7BOREC4js.log.call(void 0, 
          "Late promise received after Snap finished execution. Promise will be dropped."
        );
      }
    });
  });
}
function proxyStreamProvider(provider, request) {
  const proxy = new Proxy(
    {},
    {
      has(_target, prop) {
        return typeof prop === "string" && ["request", "on", "removeListener"].includes(prop);
      },
      get(_target, prop) {
        if (prop === "request") {
          return request;
        } else if (["on", "removeListener"].includes(prop)) {
          return provider[prop];
        }
        return void 0;
      }
    }
  );
  return proxy;
}
var BLOCKED_RPC_METHODS = Object.freeze([
  "wallet_requestSnaps",
  "wallet_requestPermissions",
  "wallet_revokePermissions",
  // We disallow all of these confirmations for now, since the screens are not ready for Snaps.
  "eth_sendRawTransaction",
  "eth_sendTransaction",
  "eth_sign",
  "eth_signTypedData",
  "eth_signTypedData_v1",
  "eth_signTypedData_v3",
  "eth_signTypedData_v4",
  "eth_decrypt",
  "eth_getEncryptionPublicKey",
  "wallet_addEthereumChain",
  "wallet_switchEthereumChain",
  "wallet_watchAsset",
  "wallet_registerOnboarding",
  "wallet_scanQRCode"
]);
function assertSnapOutboundRequest(args) {
  _utils.assert.call(void 0, 
    String.prototype.startsWith.call(args.method, "wallet_") || String.prototype.startsWith.call(args.method, "snap_"),
    "The global Snap API only allows RPC methods starting with `wallet_*` and `snap_*`.",
    _rpcerrors.rpcErrors.methodNotSupported
  );
  _utils.assert.call(void 0, 
    !BLOCKED_RPC_METHODS.includes(args.method),
    _rpcerrors.rpcErrors.methodNotFound({
      data: {
        method: args.method
      }
    })
  );
  _utils.assertStruct.call(void 0, 
    args,
    _utils.JsonStruct,
    "Provided value is not JSON-RPC compatible",
    _rpcerrors.rpcErrors.invalidParams
  );
}
function assertEthereumOutboundRequest(args) {
  _utils.assert.call(void 0, 
    !String.prototype.startsWith.call(args.method, "snap_"),
    _rpcerrors.rpcErrors.methodNotFound({
      data: {
        method: args.method
      }
    })
  );
  _utils.assert.call(void 0, 
    !BLOCKED_RPC_METHODS.includes(args.method),
    _rpcerrors.rpcErrors.methodNotFound({
      data: {
        method: args.method
      }
    })
  );
  _utils.assertStruct.call(void 0, 
    args,
    _utils.JsonStruct,
    "Provided value is not JSON-RPC compatible",
    _rpcerrors.rpcErrors.invalidParams
  );
}
function sanitizeRequestArguments(value) {
  const json = JSON.parse(JSON.stringify(value));
  return _utils.getSafeJson.call(void 0, json);
}
function isValidResponse(response) {
  if (!_utils.isObject.call(void 0, response)) {
    return false;
  }
  try {
    const size = _utils.getJsonSize.call(void 0, response);
    return size < MAX_RESPONSE_JSON_SIZE;
  } catch {
    return false;
  }
}









exports.withTeardown = withTeardown; exports.proxyStreamProvider = proxyStreamProvider; exports.BLOCKED_RPC_METHODS = BLOCKED_RPC_METHODS; exports.assertSnapOutboundRequest = assertSnapOutboundRequest; exports.assertEthereumOutboundRequest = assertEthereumOutboundRequest; exports.sanitizeRequestArguments = sanitizeRequestArguments; exports.isValidResponse = isValidResponse;
//# sourceMappingURL=chunk-C7XBEPVO.js.map