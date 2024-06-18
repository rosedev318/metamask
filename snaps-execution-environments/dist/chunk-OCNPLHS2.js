"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/common/lockdown/lockdown-more.ts
var _snapsutils = require('@metamask/snaps-utils');
function executeLockdownMore() {
  try {
    const namedIntrinsics = Reflect.ownKeys(new Compartment().globalThis);
    const shouldHardenManually = /* @__PURE__ */ new Set(["eval", "Function"]);
    const globalProperties = /* @__PURE__ */ new Set([
      // universalPropertyNames is a constant added by lockdown to global scope
      // at the time of writing, it is initialized in 'ses/src/whitelist'.
      // These properties tend to be non-enumerable.
      ...namedIntrinsics
      // TODO: Also include the named platform globals
      // This grabs every enumerable property on globalThis.
      // ...Object.keys(globalThis),
    ]);
    globalProperties.forEach((propertyName) => {
      const descriptor = Reflect.getOwnPropertyDescriptor(
        globalThis,
        propertyName
      );
      if (descriptor) {
        if (descriptor.configurable) {
          if (hasAccessor(descriptor)) {
            Object.defineProperty(globalThis, propertyName, {
              configurable: false
            });
          } else {
            Object.defineProperty(globalThis, propertyName, {
              configurable: false,
              writable: false
            });
          }
        }
        if (shouldHardenManually.has(propertyName)) {
          harden(globalThis[propertyName]);
        }
      }
    });
  } catch (error) {
    _snapsutils.logError.call(void 0, "Protecting intrinsics failed:", error);
    throw error;
  }
}
function hasAccessor(descriptor) {
  return "set" in descriptor || "get" in descriptor;
}



exports.executeLockdownMore = executeLockdownMore;
//# sourceMappingURL=chunk-OCNPLHS2.js.map