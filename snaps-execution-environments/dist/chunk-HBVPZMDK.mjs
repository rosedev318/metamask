import {
  log
} from "./chunk-5DEV3QQU.mjs";

// src/common/utils.ts
import { rpcErrors } from "@metamask/rpc-errors";
import {
  assert,
  assertStruct,
  getJsonSize,
  getSafeJson,
  isObject,
  JsonStruct
} from "@metamask/utils";
var MAX_RESPONSE_JSON_SIZE = 64e6;
async function withTeardown(originalPromise, teardownRef) {
  const myTeardown = teardownRef.lastTeardown;
  return new Promise((resolve, reject) => {
    originalPromise.then((value) => {
      if (teardownRef.lastTeardown === myTeardown) {
        resolve(value);
      } else {
        log(
          "Late promise received after Snap finished execution. Promise will be dropped."
        );
      }
    }).catch((reason) => {
      if (teardownRef.lastTeardown === myTeardown) {
        reject(reason);
      } else {
        log(
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
  assert(
    String.prototype.startsWith.call(args.method, "wallet_") || String.prototype.startsWith.call(args.method, "snap_"),
    "The global Snap API only allows RPC methods starting with `wallet_*` and `snap_*`.",
    rpcErrors.methodNotSupported
  );
  assert(
    !BLOCKED_RPC_METHODS.includes(args.method),
    rpcErrors.methodNotFound({
      data: {
        method: args.method
      }
    })
  );
  assertStruct(
    args,
    JsonStruct,
    "Provided value is not JSON-RPC compatible",
    rpcErrors.invalidParams
  );
}
function assertEthereumOutboundRequest(args) {
  assert(
    !String.prototype.startsWith.call(args.method, "snap_"),
    rpcErrors.methodNotFound({
      data: {
        method: args.method
      }
    })
  );
  assert(
    !BLOCKED_RPC_METHODS.includes(args.method),
    rpcErrors.methodNotFound({
      data: {
        method: args.method
      }
    })
  );
  assertStruct(
    args,
    JsonStruct,
    "Provided value is not JSON-RPC compatible",
    rpcErrors.invalidParams
  );
}
function sanitizeRequestArguments(value) {
  const json = JSON.parse(JSON.stringify(value));
  return getSafeJson(json);
}
function isValidResponse(response) {
  if (!isObject(response)) {
    return false;
  }
  try {
    const size = getJsonSize(response);
    return size < MAX_RESPONSE_JSON_SIZE;
  } catch {
    return false;
  }
}

export {
  withTeardown,
  proxyStreamProvider,
  BLOCKED_RPC_METHODS,
  assertSnapOutboundRequest,
  assertEthereumOutboundRequest,
  sanitizeRequestArguments,
  isValidResponse
};
//# sourceMappingURL=chunk-HBVPZMDK.mjs.map