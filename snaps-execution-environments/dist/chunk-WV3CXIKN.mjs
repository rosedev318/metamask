// src/common/validation.ts
import { rpcErrors } from "@metamask/rpc-errors";
import { UserInputEventStruct } from "@metamask/snaps-sdk";
import { ChainIdStruct, HandlerType } from "@metamask/snaps-utils";
import {
  assertStruct,
  JsonRpcIdStruct,
  JsonRpcParamsStruct,
  JsonRpcSuccessStruct,
  JsonRpcVersionStruct,
  JsonStruct
} from "@metamask/utils";
import {
  array,
  assign,
  enums,
  is,
  literal,
  nullable,
  object,
  optional,
  record,
  string,
  tuple,
  union
} from "superstruct";
var JsonRpcRequestWithoutIdStruct = object({
  jsonrpc: optional(JsonRpcVersionStruct),
  id: optional(JsonRpcIdStruct),
  method: string(),
  params: optional(JsonRpcParamsStruct)
});
var EndowmentStruct = string();
function isEndowment(value) {
  return is(value, EndowmentStruct);
}
function isEndowmentsArray(value) {
  return Array.isArray(value) && value.every(isEndowment);
}
var OkStruct = literal("OK");
var PingRequestArgumentsStruct = optional(
  union([literal(void 0), array()])
);
var TerminateRequestArgumentsStruct = union([
  literal(void 0),
  array()
]);
var ExecuteSnapRequestArgumentsStruct = tuple([
  string(),
  string(),
  array(EndowmentStruct)
]);
var SnapRpcRequestArgumentsStruct = tuple([
  string(),
  enums(Object.values(HandlerType)),
  string(),
  assign(
    JsonRpcRequestWithoutIdStruct,
    object({
      params: optional(record(string(), JsonStruct))
    })
  )
]);
var OnTransactionRequestArgumentsStruct = object({
  // TODO: Improve `transaction` type.
  transaction: record(string(), JsonStruct),
  chainId: ChainIdStruct,
  transactionOrigin: nullable(string())
});
function assertIsOnTransactionRequestArguments(value) {
  assertStruct(
    value,
    OnTransactionRequestArgumentsStruct,
    "Invalid request params",
    rpcErrors.invalidParams
  );
}
var OnSignatureRequestArgumentsStruct = object({
  signature: record(string(), JsonStruct),
  signatureOrigin: nullable(string())
});
function assertIsOnSignatureRequestArguments(value) {
  assertStruct(
    value,
    OnSignatureRequestArgumentsStruct,
    "Invalid request params",
    rpcErrors.invalidParams
  );
}
var baseNameLookupArgs = { chainId: ChainIdStruct };
var domainRequestStruct = object({
  ...baseNameLookupArgs,
  address: string()
});
var addressRequestStruct = object({
  ...baseNameLookupArgs,
  domain: string()
});
var OnNameLookupRequestArgumentsStruct = union([
  domainRequestStruct,
  addressRequestStruct
]);
function assertIsOnNameLookupRequestArguments(value) {
  assertStruct(
    value,
    OnNameLookupRequestArgumentsStruct,
    "Invalid request params",
    rpcErrors.invalidParams
  );
}
var OnUserInputArgumentsStruct = object({
  id: string(),
  event: UserInputEventStruct
});
function assertIsOnUserInputRequestArguments(value) {
  assertStruct(
    value,
    OnUserInputArgumentsStruct,
    "Invalid request params",
    rpcErrors.invalidParams
  );
}
var OkResponseStruct = object({
  id: JsonRpcIdStruct,
  jsonrpc: JsonRpcVersionStruct,
  result: OkStruct
});

export {
  JsonRpcRequestWithoutIdStruct,
  EndowmentStruct,
  isEndowment,
  isEndowmentsArray,
  PingRequestArgumentsStruct,
  TerminateRequestArgumentsStruct,
  ExecuteSnapRequestArgumentsStruct,
  SnapRpcRequestArgumentsStruct,
  OnTransactionRequestArgumentsStruct,
  assertIsOnTransactionRequestArguments,
  OnSignatureRequestArgumentsStruct,
  assertIsOnSignatureRequestArguments,
  OnNameLookupRequestArgumentsStruct,
  assertIsOnNameLookupRequestArguments,
  OnUserInputArgumentsStruct,
  assertIsOnUserInputRequestArguments
};
//# sourceMappingURL=chunk-WV3CXIKN.mjs.map