"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/permitted/invokeSnapSugar.ts
var _rpcerrors = require('@metamask/rpc-errors');
var _utils = require('@metamask/utils');
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
  if (!_utils.isObject.call(void 0, params)) {
    throw _rpcerrors.rpcErrors.invalidParams({
      message: "Expected params to be a single object."
    });
  }
  const { snapId, request } = params;
  if (!snapId || typeof snapId !== "string" || snapId === "") {
    throw _rpcerrors.rpcErrors.invalidParams({
      message: "Must specify a valid snap ID."
    });
  }
  if (!_utils.isObject.call(void 0, request)) {
    throw _rpcerrors.rpcErrors.invalidParams({
      message: "Expected request to be a single object."
    });
  }
  return params;
}





exports.invokeSnapSugarHandler = invokeSnapSugarHandler; exports.invokeSnapSugar = invokeSnapSugar; exports.getValidatedParams = getValidatedParams;
//# sourceMappingURL=chunk-IDZGMGIB.js.map