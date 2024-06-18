// src/permitted/createInterface.ts
import { rpcErrors } from "@metamask/rpc-errors";
import { ComponentStruct } from "@metamask/snaps-sdk";
import { StructError, create, object } from "superstruct";
var hookNames = {
  createInterface: true
};
var createInterfaceHandler = {
  methodNames: ["snap_createInterface"],
  implementation: getCreateInterfaceImplementation,
  hookNames
};
var CreateInterfaceParametersStruct = object({
  ui: ComponentStruct
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
    return create(params, CreateInterfaceParametersStruct);
  } catch (error) {
    if (error instanceof StructError) {
      throw rpcErrors.invalidParams({
        message: `Invalid params: ${error.message}.`
      });
    }
    throw rpcErrors.internal();
  }
}

export {
  createInterfaceHandler
};
//# sourceMappingURL=chunk-WLDEPJGG.mjs.map