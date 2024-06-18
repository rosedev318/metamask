// src/permitted/invokeSnapSugar.ts
import { rpcErrors } from "@metamask/rpc-errors";
import { isObject } from "@metamask/utils";
var invokeSnapSugarHandler = {
  methodNames: ["wallet_invokeSnap"],
  implementation: invokeSnapSugar,
  hookNames: void 0
};
function invokeSnapSugar(req, _res, next, end) {
  let params;
  try {
    params = getValidatedParams(req.params);
  } catch (error) {
    return end(error);
  }
  req.method = "wallet_snap";
  req.params = params;
  return next();
}
function getValidatedParams(params) {
  if (!isObject(params)) {
    throw rpcErrors.invalidParams({
      message: "Expected params to be a single object."
    });
  }
  const { snapId, request } = params;
  if (!snapId || typeof snapId !== "string" || snapId === "") {
    throw rpcErrors.invalidParams({
      message: "Must specify a valid snap ID."
    });
  }
  if (!isObject(request)) {
    throw rpcErrors.invalidParams({
      message: "Expected request to be a single object."
    });
  }
  return params;
}

export {
  invokeSnapSugarHandler,
  invokeSnapSugar,
  getValidatedParams
};
//# sourceMappingURL=chunk-MXCJWR45.mjs.map