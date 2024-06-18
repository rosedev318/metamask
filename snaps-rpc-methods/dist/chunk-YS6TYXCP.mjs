// src/permitted/updateInterface.ts
import { rpcErrors } from "@metamask/rpc-errors";
import { ComponentStruct } from "@metamask/snaps-sdk";
import { StructError, create, object, string } from "superstruct";
var hookNames = {
  updateInterface: true
};
var updateInterfaceHandler = {
  methodNames: ["snap_updateInterface"],
  implementation: getUpdateInterfaceImplementation,
  hookNames
};
var UpdateInterfaceParametersStruct = object({
  id: string(),
  ui: ComponentStruct
});
async function getUpdateInterfaceImplementation(req, res, _next, end, { updateInterface }) {
  const { params } = req;
  try {
    const validatedParams = getValidatedParams(params);
    const { id, ui } = validatedParams;
    await updateInterface(id, ui);
    res.result = null;
  } catch (error) {
    return end(error);
  }
  return end();
}
function getValidatedParams(params) {
  try {
    return create(params, UpdateInterfaceParametersStruct);
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
  updateInterfaceHandler
};
//# sourceMappingURL=chunk-YS6TYXCP.mjs.map