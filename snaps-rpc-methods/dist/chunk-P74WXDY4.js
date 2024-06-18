"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/restricted/manageAccounts.ts
var _permissioncontroller = require('@metamask/permission-controller');
var _utils = require('@metamask/utils');
var _superstruct = require('superstruct');
var SnapMessageStruct = _superstruct.union.call(void 0, [
  _superstruct.object.call(void 0, {
    method: _superstruct.string.call(void 0, )
  }),
  _superstruct.object.call(void 0, {
    method: _superstruct.string.call(void 0, ),
    params: _superstruct.union.call(void 0, [_superstruct.array.call(void 0, _utils.JsonStruct), _superstruct.record.call(void 0, _superstruct.string.call(void 0, ), _utils.JsonStruct)])
  })
]);
var methodName = "snap_manageAccounts";
var specificationBuilder = ({
  allowedCaveats = null,
  methodHooks
}) => {
  return {
    permissionType: _permissioncontroller.PermissionType.RestrictedMethod,
    targetName: methodName,
    allowedCaveats,
    methodImplementation: manageAccountsImplementation(methodHooks),
    subjectTypes: [_permissioncontroller.SubjectType.Snap]
  };
};
function manageAccountsImplementation({
  getSnapKeyring
}) {
  return async function manageAccounts(options) {
    const {
      context: { origin },
      params
    } = options;
    _superstruct.assert.call(void 0, params, SnapMessageStruct);
    const keyring = await getSnapKeyring(origin);
    return await keyring.handleKeyringSnapMessage(origin, params);
  };
}
var manageAccountsBuilder = Object.freeze({
  targetName: methodName,
  specificationBuilder,
  methodHooks: {
    getSnapKeyring: true
  }
});






exports.methodName = methodName; exports.specificationBuilder = specificationBuilder; exports.manageAccountsImplementation = manageAccountsImplementation; exports.manageAccountsBuilder = manageAccountsBuilder;
//# sourceMappingURL=chunk-P74WXDY4.js.map