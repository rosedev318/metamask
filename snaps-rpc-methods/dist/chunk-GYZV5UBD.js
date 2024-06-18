"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/restricted/dialog.ts
var _permissioncontroller = require('@metamask/permission-controller');
var _rpcerrors = require('@metamask/rpc-errors');





var _snapssdk = require('@metamask/snaps-sdk');
var _snapsutils = require('@metamask/snaps-utils');
var _utils = require('@metamask/utils');








var _superstruct = require('superstruct');
var methodName = "snap_dialog";
var PlaceholderStruct = _superstruct.optional.call(void 0, _superstruct.size.call(void 0, _superstruct.string.call(void 0, ), 1, 40));
var specificationBuilder = ({
  allowedCaveats = null,
  methodHooks: methodHooks2
}) => {
  return {
    permissionType: _permissioncontroller.PermissionType.RestrictedMethod,
    targetName: methodName,
    allowedCaveats,
    methodImplementation: getDialogImplementation(methodHooks2),
    subjectTypes: [_permissioncontroller.SubjectType.Snap]
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
var BaseParamsStruct = _superstruct.type.call(void 0, {
  type: _superstruct.enums.call(void 0, [_snapssdk.DialogType.Alert, _snapssdk.DialogType.Confirmation, _snapssdk.DialogType.Prompt])
});
var AlertParametersWithContentStruct = _superstruct.object.call(void 0, {
  type: _snapssdk.enumValue.call(void 0, _snapssdk.DialogType.Alert),
  content: _snapssdk.ComponentStruct
});
var AlertParametersWithIdStruct = _superstruct.object.call(void 0, {
  type: _snapssdk.enumValue.call(void 0, _snapssdk.DialogType.Alert),
  id: _superstruct.string.call(void 0, )
});
var AlertParametersStruct = _snapssdk.union.call(void 0, [
  AlertParametersWithContentStruct,
  AlertParametersWithIdStruct
]);
var ConfirmationParametersWithContentStruct = _superstruct.object.call(void 0, {
  type: _snapssdk.enumValue.call(void 0, _snapssdk.DialogType.Confirmation),
  content: _snapssdk.ComponentStruct
});
var ConfirmationParametersWithIdStruct = _superstruct.object.call(void 0, {
  type: _snapssdk.enumValue.call(void 0, _snapssdk.DialogType.Confirmation),
  id: _superstruct.string.call(void 0, )
});
var ConfirmationParametersStruct = _snapssdk.union.call(void 0, [
  ConfirmationParametersWithContentStruct,
  ConfirmationParametersWithIdStruct
]);
var PromptParametersWithContentStruct = _superstruct.object.call(void 0, {
  type: _snapssdk.enumValue.call(void 0, _snapssdk.DialogType.Prompt),
  content: _snapssdk.ComponentStruct,
  placeholder: PlaceholderStruct
});
var PromptParametersWithIdStruct = _superstruct.object.call(void 0, {
  type: _snapssdk.enumValue.call(void 0, _snapssdk.DialogType.Prompt),
  id: _superstruct.string.call(void 0, ),
  placeholder: PlaceholderStruct
});
var PromptParametersStruct = _snapssdk.union.call(void 0, [
  PromptParametersWithContentStruct,
  PromptParametersWithIdStruct
]);
var DialogParametersStruct = _snapssdk.union.call(void 0, [
  AlertParametersStruct,
  ConfirmationParametersStruct,
  PromptParametersStruct
]);
var structs = {
  [_snapssdk.DialogType.Alert]: AlertParametersStruct,
  [_snapssdk.DialogType.Confirmation]: ConfirmationParametersStruct,
  [_snapssdk.DialogType.Prompt]: PromptParametersStruct
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
    const placeholder = validatedParams.type === _snapssdk.DialogType.Prompt ? validatedParams.placeholder : void 0;
    if (_utils.hasProperty.call(void 0, validatedParams, "content")) {
      const id = await createInterface(
        origin,
        validatedParams.content
      );
      return showDialog(origin, validatedType, id, placeholder);
    }
    try {
      getInterface(origin, validatedParams.id);
    } catch (error) {
      throw _rpcerrors.rpcErrors.invalidParams({
        message: `Invalid params: ${error.message}`
      });
    }
    return showDialog(origin, validatedType, validatedParams.id, placeholder);
  };
}
function getValidatedType(params) {
  try {
    return _superstruct.create.call(void 0, params, BaseParamsStruct).type;
  } catch (error) {
    throw _rpcerrors.rpcErrors.invalidParams({
      message: `The "type" property must be one of: ${Object.values(
        _snapssdk.DialogType
      ).join(", ")}.`
    });
  }
}
function getValidatedParams(params, struct) {
  try {
    return _snapsutils.createUnion.call(void 0, params, struct, "type");
  } catch (error) {
    throw _rpcerrors.rpcErrors.invalidParams({
      message: `Invalid params: ${error.message}`
    });
  }
}




exports.dialogBuilder = dialogBuilder; exports.getDialogImplementation = getDialogImplementation;
//# sourceMappingURL=chunk-GYZV5UBD.js.map