import {
  rootRealmGlobal
} from "./chunk-IX5S3V47.mjs";

// src/common/globalEvents.ts
import { rpcErrors } from "@metamask/rpc-errors";
function addEventListener(event, listener) {
  if ("addEventListener" in rootRealmGlobal && typeof rootRealmGlobal.addEventListener === "function") {
    return rootRealmGlobal.addEventListener(event.toLowerCase(), listener);
  }
  if (rootRealmGlobal.process && "on" in rootRealmGlobal.process && typeof rootRealmGlobal.process.on === "function") {
    return rootRealmGlobal.process.on(event, listener);
  }
  throw rpcErrors.internal("Platform agnostic addEventListener failed.");
}
function removeEventListener(event, listener) {
  if ("removeEventListener" in rootRealmGlobal && typeof rootRealmGlobal.removeEventListener === "function") {
    return rootRealmGlobal.removeEventListener(event.toLowerCase(), listener);
  }
  if (rootRealmGlobal.process && "removeListener" in rootRealmGlobal.process && typeof rootRealmGlobal.process.removeListener === "function") {
    return rootRealmGlobal.process.removeListener(event, listener);
  }
  throw new Error("Platform agnostic removeEventListener failed");
}

export {
  addEventListener,
  removeEventListener
};
//# sourceMappingURL=chunk-ZNTCZK7J.mjs.map