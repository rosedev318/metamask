"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/common/validation.ts
var _rpcerrors = require('@metamask/rpc-errors');
var _snapssdk = require('@metamask/snaps-sdk');
var _snapsutils = require('@metamask/snaps-utils');







var _utils = require('@metamask/utils');













var _superstruct = require('superstruct');
var JsonRpcRequestWithoutIdStruct = _superstruct.object.call(void 0, {
  jsonrpc: _superstruct.optional.call(void 0, _utils.JsonRpcVersionStruct),
  id: _superstruct.optional.call(void 0, _utils.JsonRpcIdStruct),
  method: _superstruct.string.call(void 0, ),
  params: _superstruct.optional.call(void 0, _utils.JsonRpcParamsStruct)
});
var EndowmentStruct = _superstruct.string.call(void 0, );
function isEndowment(value) {
  return _superstruct.is.call(void 0, value, EndowmentStruct);
}
function isEndowmentsArray(value) {
  return Array.isArray(value) && value.every(isEndowment);
}
var OkStruct = _superstruct.literal.call(void 0, "OK");
var PingRequestArgumentsStruct = _superstruct.optional.call(void 0, 
  _superstruct.union.call(void 0, [_superstruct.literal.call(void 0, void 0), _superstruct.array.call(void 0, )])
);
var TerminateRequestArgumentsStruct = _superstruct.union.call(void 0, [
  _superstruct.literal.call(void 0, void 0),
  _superstruct.array.call(void 0, )
]);
var ExecuteSnapRequestArgumentsStruct = _superstruct.tuple.call(void 0, [
  _superstruct.string.call(void 0, ),
  _superstruct.string.call(void 0, ),
  _superstruct.array.call(void 0, EndowmentStruct)
]);
var SnapRpcRequestArgumentsStruct = _superstruct.tuple.call(void 0, [
  _superstruct.string.call(void 0, ),
  _superstruct.enums.call(void 0, Object.values(_snapsutils.HandlerType)),
  _superstruct.string.call(void 0, ),
  _superstruct.assign.call(void 0, 
    JsonRpcRequestWithoutIdStruct,
    _superstruct.object.call(void 0, {
      params: _superstruct.optional.call(void 0, _superstruct.record.call(void 0, _superstruct.string.call(void 0, ), _utils.JsonStruct))
    })
  )
]);
var OnTransactionRequestArgumentsStruct = _superstruct.object.call(void 0, {
  // TODO: Improve `transaction` type.
  transaction: _superstruct.record.call(void 0, _superstruct.string.call(void 0, ), _utils.JsonStruct),
  chainId: _snapsutils.ChainIdStruct,
  transactionOrigin: _superstruct.nullable.call(void 0, _superstruct.string.call(void 0, ))
});
function assertIsOnTransactionRequestArguments(value) {
  _utils.assertStruct.call(void 0, 
    value,
    OnTransactionRequestArgumentsStruct,
    "Invalid request params",
    _rpcerrors.rpcErrors.invalidParams
  );
}
var OnSignatureRequestArgumentsStruct = _superstruct.object.call(void 0, {
  signature: _superstruct.record.call(void 0, _superstruct.string.call(void 0, ), _utils.JsonStruct),
  signatureOrigin: _superstruct.nullable.call(void 0, _superstruct.string.call(void 0, ))
});
function assertIsOnSignatureRequestArguments(value) {
  _utils.assertStruct.call(void 0, 
    value,
    OnSignatureRequestArgumentsStruct,
    "Invalid request params",
    _rpcerrors.rpcErrors.invalidParams
  );
}
var baseNameLookupArgs = { chainId: _snapsutils.ChainIdStruct };
var domainRequestStruct = _superstruct.object.call(void 0, {
  ...baseNameLookupArgs,
  address: _superstruct.string.call(void 0, )
});
var addressRequestStruct = _superstruct.object.call(void 0, {
  ...baseNameLookupArgs,
  domain: _superstruct.string.call(void 0, )
});
var OnNameLookupRequestArgumentsStruct = _superstruct.union.call(void 0, [
  domainRequestStruct,
  addressRequestStruct
]);
function assertIsOnNameLookupRequestArguments(value) {
  _utils.assertStruct.call(void 0, 
    value,
    OnNameLookupRequestArgumentsStruct,
    "Invalid request params",
    _rpcerrors.rpcErrors.invalidParams
  );
}
var OnUserInputArgumentsStruct = _superstruct.object.call(void 0, {
  id: _superstruct.string.call(void 0, ),
  event: _snapssdk.UserInputEventStruct
});
function assertIsOnUserInputRequestArguments(value) {
  _utils.assertStruct.call(void 0, 
    value,
    OnUserInputArgumentsStruct,
    "Invalid request params",
    _rpcerrors.rpcErrors.invalidParams
  );
}
var OkResponseStruct = _superstruct.object.call(void 0, {
  id: _utils.JsonRpcIdStruct,
  jsonrpc: _utils.JsonRpcVersionStruct,
  result: OkStruct
});


















exports.JsonRpcRequestWithoutIdStruct = JsonRpcRequestWithoutIdStruct; exports.EndowmentStruct = EndowmentStruct; exports.isEndowment = isEndowment; exports.isEndowmentsArray = isEndowmentsArray; exports.PingRequestArgumentsStruct = PingRequestArgumentsStruct; exports.TerminateRequestArgumentsStruct = TerminateRequestArgumentsStruct; exports.ExecuteSnapRequestArgumentsStruct = ExecuteSnapRequestArgumentsStruct; exports.SnapRpcRequestArgumentsStruct = SnapRpcRequestArgumentsStruct; exports.OnTransactionRequestArgumentsStruct = OnTransactionRequestArgumentsStruct; exports.assertIsOnTransactionRequestArguments = assertIsOnTransactionRequestArguments; exports.OnSignatureRequestArgumentsStruct = OnSignatureRequestArgumentsStruct; exports.assertIsOnSignatureRequestArguments = assertIsOnSignatureRequestArguments; exports.OnNameLookupRequestArgumentsStruct = OnNameLookupRequestArgumentsStruct; exports.assertIsOnNameLookupRequestArguments = assertIsOnNameLookupRequestArguments; exports.OnUserInputArgumentsStruct = OnUserInputArgumentsStruct; exports.assertIsOnUserInputRequestArguments = assertIsOnUserInputRequestArguments;
//# sourceMappingURL=chunk-DFPM46ZF.js.map