"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/permitted/createInterface.ts
var _rpcerrors = require('@metamask/rpc-errors');
var _snapssdk = require('@metamask/snaps-sdk');
var _superstruct = require('superstruct');
var hookNames = {
  createInterface: true
};
var createInterfaceHandler = {
  methodNames: ["snap_createInterface"],
  implementation: getCreateInterfaceImplementation,
  hookNames
};
var CreateInterfaceParametersStruct = _superstruct.object.call(void 0, {
  ui: _snapssdk.ComponentStruct
});
async function getCreateInterfaceImplementation(req, res, _next, end, { createInterface }) {
  const { params } = req;
  try {
    const validatedParams = getValidatedParams(params);
    const { ui } = validatedParams;
    res.result = await createInterface(ui);
  } catch (error) {
    return end(error);
  }
  return end();
}
function getValidatedParams(params) {
  try {
    return _superstruct.create.call(void 0, params, CreateInterfaceParametersStruct);
  } catch (error) {
    if (error instanceof _superstruct.StructError) {
      throw _rpcerrors.rpcErrors.invalidParams({
        message: `Invalid params: ${error.message}.`
      });
    }
    throw _rpcerrors.rpcErrors.internal();
  }
}



exports.createInterfaceHandler = createInterfaceHandler;
//# sourceMappingURL=chunk-3LPBU737.js.map