"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkYG7W4CDTjs = require('./chunk-YG7W4CDT.js');

// src/restricted/getEntropy.ts
var _permissioncontroller = require('@metamask/permission-controller');
var _rpcerrors = require('@metamask/rpc-errors');
var _snapsutils = require('@metamask/snaps-utils');
var _utils = require('@metamask/utils');
var _superstruct = require('superstruct');
var targetName = "snap_getEntropy";
var GetEntropyArgsStruct = _superstruct.object.call(void 0, {
  version: _superstruct.literal.call(void 0, 1),
  salt: _superstruct.optional.call(void 0, _superstruct.string.call(void 0, ))
});
var specificationBuilder = ({
  allowedCaveats = null,
  methodHooks: methodHooks2
}) => {
  return {
    permissionType: _permissioncontroller.PermissionType.RestrictedMethod,
    targetName,
    allowedCaveats,
    methodImplementation: getEntropyImplementation(methodHooks2),
    subjectTypes: [_permissioncontroller.SubjectType.Snap]
  };
};
var methodHooks = {
  getMnemonic: true,
  getUnlockPromise: true
};
var getEntropyBuilder = Object.freeze({
  targetName,
  specificationBuilder,
  methodHooks
});
function getEntropyImplementation({
  getMnemonic,
  getUnlockPromise
}) {
  return async function getEntropy(options) {
    const {
      params,
      context: { origin }
    } = options;
    _utils.assertStruct.call(void 0, 
      params,
      GetEntropyArgsStruct,
      'Invalid "snap_getEntropy" parameters',
      _rpcerrors.rpcErrors.invalidParams
    );
    await getUnlockPromise(true);
    const mnemonicPhrase = await getMnemonic();
    return _chunkYG7W4CDTjs.deriveEntropy.call(void 0, {
      input: origin,
      salt: params.salt,
      mnemonicPhrase,
      magic: _snapsutils.SIP_6_MAGIC_VALUE
    });
  };
}




exports.GetEntropyArgsStruct = GetEntropyArgsStruct; exports.getEntropyBuilder = getEntropyBuilder;
//# sourceMappingURL=chunk-Q5W3YGEB.js.map