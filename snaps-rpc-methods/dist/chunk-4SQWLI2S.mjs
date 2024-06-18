// src/restricted/dialog.ts
import { PermissionType, SubjectType } from "@metamask/permission-controller";
import { rpcErrors } from "@metamask/rpc-errors";
import {
  DialogType,
  ComponentStruct,
  enumValue,
  union
} from "@metamask/snaps-sdk";
import { createUnion } from "@metamask/snaps-utils";
import { hasProperty } from "@metamask/utils";
import {
  create,
  enums,
  object,
  optional,
  size,
  string,
  type
} from "superstruct";
var methodName = "snap_dialog";
var PlaceholderStruct = optional(size(string(), 1, 40));
var specificationBuilder = ({
  allowedCaveats = null,
  methodHooks: methodHooks2
}) => {
  return {
    permissionType: PermissionType.RestrictedMethod,
    targetName: methodName,
    allowedCaveats,
    methodImplementation: getDialogImplementation(methodHooks2),
    subjectTypes: [SubjectType.Snap]
  };
};
var methodHooks = {
  showDialog: true,
  createInterface: true,
  getInterface: true
};
var dialogBuilder = Object.freeze({
  targetName: methodName,
  specificationBuilder,
  methodHooks
});
var BaseParamsStruct = type({
  type: enums([DialogType.Alert, DialogType.Confirmation, DialogType.Prompt])
});
var AlertParametersWithContentStruct = object({
  type: enumValue(DialogType.Alert),
  content: ComponentStruct
});
var AlertParametersWithIdStruct = object({
  type: enumValue(DialogType.Alert),
  id: string()
});
var AlertParametersStruct = union([
  AlertParametersWithContentStruct,
  AlertParametersWithIdStruct
]);
var ConfirmationParametersWithContentStruct = object({
  type: enumValue(DialogType.Confirmation),
  content: ComponentStruct
});
var ConfirmationParametersWithIdStruct = object({
  type: enumValue(DialogType.Confirmation),
  id: string()
});
var ConfirmationParametersStruct = union([
  ConfirmationParametersWithContentStruct,
  ConfirmationParametersWithIdStruct
]);
var PromptParametersWithContentStruct = object({
  type: enumValue(DialogType.Prompt),
  content: ComponentStruct,
  placeholder: PlaceholderStruct
});
var PromptParametersWithIdStruct = object({
  type: enumValue(DialogType.Prompt),
  id: string(),
  placeholder: PlaceholderStruct
});
var PromptParametersStruct = union([
  PromptParametersWithContentStruct,
  PromptParametersWithIdStruct
]);
var DialogParametersStruct = union([
  AlertParametersStruct,
  ConfirmationParametersStruct,
  PromptParametersStruct
]);
var structs = {
  [DialogType.Alert]: AlertParametersStruct,
  [DialogType.Confirmation]: ConfirmationParametersStruct,
  [DialogType.Prompt]: PromptParametersStruct
};
function getDialogImplementation({
  showDialog,
  createInterface,
  getInterface
}) {
  return async function dialogImplementation(args) {
    const {
      params,
      context: { origin }
    } = args;
    const validatedType = getValidatedType(params);
    const validatedParams = getValidatedParams(params, structs[validatedType]);
    const placeholder = validatedParams.type === DialogType.Prompt ? validatedParams.placeholder : void 0;
    if (hasProperty(validatedParams, "content")) {
      const id = await createInterface(
        origin,
        validatedParams.content
      );
      return showDialog(origin, validatedType, id, placeholder);
    }
    try {
      getInterface(origin, validatedParams.id);
    } catch (error) {
      throw rpcErrors.invalidParams({
        message: `Invalid params: ${error.message}`
      });
    }
    return showDialog(origin, validatedType, validatedParams.id, placeholder);
  };
}
function getValidatedType(params) {
  try {
    return create(params, BaseParamsStruct).type;
  } catch (error) {
    throw rpcErrors.invalidParams({
      message: `The "type" property must be one of: ${Object.values(
        DialogType
      ).join(", ")}.`
    });
  }
}
function getValidatedParams(params, struct) {
  try {
    return createUnion(params, struct, "type");
  } catch (error) {
    throw rpcErrors.invalidParams({
      message: `Invalid params: ${error.message}`
    });
  }
}

export {
  dialogBuilder,
  getDialogImplementation
};
//# sourceMappingURL=chunk-4SQWLI2S.mjs.map