// src/common/endowments/timeout.ts
import { rpcErrors } from "@metamask/rpc-errors";
var MINIMUM_TIMEOUT = 10;
var createTimeout = () => {
  const registeredHandles = /* @__PURE__ */ new Map();
  const _setTimeout = (handler, timeout) => {
    if (typeof handler !== "function") {
      throw rpcErrors.internal(
        `The timeout handler must be a function. Received: ${typeof handler}.`
      );
    }
    harden(handler);
    const handle = Object.freeze(/* @__PURE__ */ Object.create(null));
    const platformHandle = setTimeout(() => {
      registeredHandles.delete(handle);
      handler();
    }, Math.max(MINIMUM_TIMEOUT, timeout ?? 0));
    registeredHandles.set(handle, platformHandle);
    return handle;
  };
  const _clearTimeout = (handle) => {
    const platformHandle = registeredHandles.get(handle);
    if (platformHandle !== void 0) {
      clearTimeout(platformHandle);
      registeredHandles.delete(handle);
    }
  };
  const teardownFunction = () => {
    for (const handle of registeredHandles.keys()) {
      _clearTimeout(handle);
    }
  };
  return {
    setTimeout: harden(_setTimeout),
    clearTimeout: harden(_clearTimeout),
    teardownFunction
  };
};
var endowmentModule = {
  names: ["setTimeout", "clearTimeout"],
  factory: createTimeout
};
var timeout_default = endowmentModule;

export {
  timeout_default
};
//# sourceMappingURL=chunk-CWCVTRNZ.mjs.map