"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/common/endowments/interval.ts
var _rpcerrors = require('@metamask/rpc-errors');
var MINIMUM_INTERVAL = 10;
var createInterval = () => {
  const registeredHandles = /* @__PURE__ */ new Map();
  const _setInterval = (handler, timeout) => {
    if (typeof handler !== "function") {
      throw _rpcerrors.rpcErrors.invalidInput(
        `The interval handler must be a function. Received: ${typeof handler}.`
      );
    }
    harden(handler);
    const handle = Object.freeze(/* @__PURE__ */ Object.create(null));
    const platformHandle = setInterval(
      handler,
      Math.max(MINIMUM_INTERVAL, timeout ?? 0)
    );
    registeredHandles.set(handle, platformHandle);
    return handle;
  };
  const _clearInterval = (handle) => {
    harden(handle);
    const platformHandle = registeredHandles.get(handle);
    if (platformHandle !== void 0) {
      clearInterval(platformHandle);
      registeredHandles.delete(handle);
    }
  };
  const teardownFunction = () => {
    for (const handle of registeredHandles.keys()) {
      _clearInterval(handle);
    }
  };
  return {
    setInterval: harden(_setInterval),
    clearInterval: harden(_clearInterval),
    teardownFunction
  };
};
var endowmentModule = {
  names: ["setInterval", "clearInterval"],
  factory: createInterval
};
var interval_default = endowmentModule;



exports.interval_default = interval_default;
//# sourceMappingURL=chunk-HKHW6TTX.js.map