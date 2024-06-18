"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkYG7W4CDTjs = require('./chunk-YG7W4CDT.js');

// src/restricted/manageState.ts
var _permissioncontroller = require('@metamask/permission-controller');
var _rpcerrors = require('@metamask/rpc-errors');
var _snapssdk = require('@metamask/snaps-sdk');
var _snapsutils = require('@metamask/snaps-utils');
var _utils = require('@metamask/utils');
var STATE_ENCRYPTION_SALT = "snap_manageState encryption";
var methodName = "snap_manageState";
var specificationBuilder = ({
  allowedCaveats = null,
  methodHooks: methodHooks2
}) => {
  return {
    permissionType: _permissioncontroller.PermissionType.RestrictedMethod,
    targetName: methodName,
    allowedCaveats,
    methodImplementation: getManageStateImplementation(methodHooks2),
    subjectTypes: [_permissioncontroller.SubjectType.Snap]
  };
};
var methodHooks = {
  getMnemonic: true,
  getUnlockPromise: true,
  clearSnapState: true,
  getSnapState: true,
  updateSnapState: true,
  encrypt: true,
  decrypt: true
};
var manageStateBuilder = Object.freeze({
  targetName: methodName,
  specificationBuilder,
  methodHooks
});
var STORAGE_SIZE_LIMIT = 104857600;
async function getEncryptionKey({
  mnemonicPhrase,
  snapId
}) {
  return await _chunkYG7W4CDTjs.deriveEntropy.call(void 0, {
    mnemonicPhrase,
    input: snapId,
    salt: STATE_ENCRYPTION_SALT,
    magic: _snapsutils.STATE_ENCRYPTION_MAGIC_VALUE
  });
}
async function encryptState({
  state,
  encryptFunction,
  ...keyArgs
}) {
  const encryptionKey = await getEncryptionKey(keyArgs);
  return await encryptFunction(encryptionKey, state);
}
async function decryptState({
  state,
  decryptFunction,
  ...keyArgs
}) {
  try {
    const encryptionKey = await getEncryptionKey(keyArgs);
    const decryptedState = await decryptFunction(encryptionKey, state);
    _utils.assert.call(void 0, _utils.isValidJson.call(void 0, decryptedState));
    return decryptedState;
  } catch {
    throw _rpcerrors.rpcErrors.internal({
      message: "Failed to decrypt snap state, the state must be corrupted."
    });
  }
}
function getManageStateImplementation({
  getMnemonic,
  getUnlockPromise,
  clearSnapState,
  getSnapState,
  updateSnapState,
  encrypt,
  decrypt
}) {
  return async function manageState(options) {
    const {
      params = {},
      method,
      context: { origin }
    } = options;
    const validatedParams = getValidatedParams(params, method);
    const shouldEncrypt = validatedParams.encrypted ?? true;
    if (shouldEncrypt && validatedParams.operation !== _snapssdk.ManageStateOperation.ClearState) {
      await getUnlockPromise(true);
    }
    switch (validatedParams.operation) {
      case _snapssdk.ManageStateOperation.ClearState:
        clearSnapState(origin, shouldEncrypt);
        return null;
      case _snapssdk.ManageStateOperation.GetState: {
        const state = getSnapState(origin, shouldEncrypt);
        if (state === null) {
          return state;
        }
        return shouldEncrypt ? await decryptState({
          state,
          decryptFunction: decrypt,
          mnemonicPhrase: await getMnemonic(),
          snapId: origin
        }) : _snapsutils.parseJson.call(void 0, state);
      }
      case _snapssdk.ManageStateOperation.UpdateState: {
        const finalizedState = shouldEncrypt ? await encryptState({
          state: validatedParams.newState,
          encryptFunction: encrypt,
          mnemonicPhrase: await getMnemonic(),
          snapId: origin
        }) : JSON.stringify(validatedParams.newState);
        updateSnapState(origin, finalizedState, shouldEncrypt);
        return null;
      }
      default:
        throw _rpcerrors.rpcErrors.invalidParams(
          `Invalid ${method} operation: "${validatedParams.operation}"`
        );
    }
  };
}
function getValidatedParams(params, method, storageSizeLimit = STORAGE_SIZE_LIMIT) {
  if (!_utils.isObject.call(void 0, params)) {
    throw _rpcerrors.rpcErrors.invalidParams({
      message: "Expected params to be a single object."
    });
  }
  const { operation, newState, encrypted } = params;
  if (!operation || typeof operation !== "string" || !Object.values(_snapssdk.ManageStateOperation).includes(
    operation
  )) {
    throw _rpcerrors.rpcErrors.invalidParams({
      message: 'Must specify a valid manage state "operation".'
    });
  }
  if (encrypted !== void 0 && typeof encrypted !== "boolean") {
    throw _rpcerrors.rpcErrors.invalidParams({
      message: '"encrypted" parameter must be a boolean if specified.'
    });
  }
  if (operation === _snapssdk.ManageStateOperation.UpdateState) {
    if (!_utils.isObject.call(void 0, newState)) {
      throw _rpcerrors.rpcErrors.invalidParams({
        message: `Invalid ${method} "updateState" parameter: The new state must be a plain object.`,
        data: {
          receivedNewState: typeof newState === "undefined" ? "undefined" : newState
        }
      });
    }
    let size;
    try {
      size = _utils.getJsonSize.call(void 0, newState);
    } catch {
      throw _rpcerrors.rpcErrors.invalidParams({
        message: `Invalid ${method} "updateState" parameter: The new state must be JSON serializable.`,
        data: {
          receivedNewState: typeof newState === "undefined" ? "undefined" : newState
        }
      });
    }
    if (size > storageSizeLimit) {
      throw _rpcerrors.rpcErrors.invalidParams({
        message: `Invalid ${method} "updateState" parameter: The new state must not exceed ${storageSizeLimit} bytes in size.`,
        data: {
          receivedNewState: typeof newState === "undefined" ? "undefined" : newState
        }
      });
    }
  }
  return params;
}









exports.STATE_ENCRYPTION_SALT = STATE_ENCRYPTION_SALT; exports.specificationBuilder = specificationBuilder; exports.manageStateBuilder = manageStateBuilder; exports.STORAGE_SIZE_LIMIT = STORAGE_SIZE_LIMIT; exports.getEncryptionKey = getEncryptionKey; exports.getManageStateImplementation = getManageStateImplementation; exports.getValidatedParams = getValidatedParams;
//# sourceMappingURL=chunk-KO4MKRYZ.js.map