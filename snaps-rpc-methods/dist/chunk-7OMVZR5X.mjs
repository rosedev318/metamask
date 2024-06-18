import {
  methodHandlers
} from "./chunk-JQ456NCC.mjs";
import {
  selectHooks
} from "./chunk-SGQXD5K7.mjs";

// src/permitted/middleware.ts
import { rpcErrors } from "@metamask/rpc-errors";
import { logError } from "@metamask/snaps-utils";
function createSnapsMethodMiddleware(isSnap, hooks) {
  return async function methodMiddleware(request, response, next, end) {
    const handler = methodHandlers[request.method];
    if (handler) {
      if (String.prototype.startsWith.call(request.method, "snap_") && !isSnap) {
        return end(rpcErrors.methodNotFound());
      }
      const { implementation, hookNames } = handler;
      try {
        return await implementation(
          request,
          response,
          next,
          end,
          selectHooks(hooks, hookNames)
        );
      } catch (error) {
        logError(error);
        return end(error);
      }
    }
    return next();
  };
}

export {
  createSnapsMethodMiddleware
};
//# sourceMappingURL=chunk-7OMVZR5X.mjs.map