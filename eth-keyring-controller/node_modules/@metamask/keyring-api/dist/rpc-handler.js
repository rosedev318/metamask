"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleKeyringRequest = exports.MethodNotSupportedError = void 0;
const superstruct_1 = require("superstruct");
const api_1 = require("./internal/api");
const rpc_1 = require("./internal/rpc");
const JsonRpcRequest_1 = require("./JsonRpcRequest");
/**
 * Error thrown when a keyring JSON-RPC method is not supported.
 */
class MethodNotSupportedError extends Error {
    constructor(method) {
        super(`Method not supported: ${method}`);
    }
}
exports.MethodNotSupportedError = MethodNotSupportedError;
/**
 * Handles a keyring JSON-RPC request.
 *
 * @param keyring - Keyring instance.
 * @param request - Keyring JSON-RPC request.
 * @returns A promise that resolves to the keyring response.
 */
async function handleKeyringRequest(keyring, request) {
    // We first have to make sure that the request is a valid JSON-RPC request so
    // we can check its method name.
    (0, superstruct_1.assert)(request, JsonRpcRequest_1.JsonRpcRequestStruct);
    switch (request.method) {
        case rpc_1.KeyringRpcMethod.ListAccounts: {
            (0, superstruct_1.assert)(request, api_1.ListAccountsRequestStruct);
            return keyring.listAccounts();
        }
        case rpc_1.KeyringRpcMethod.GetAccount: {
            (0, superstruct_1.assert)(request, api_1.GetAccountRequestStruct);
            return keyring.getAccount(request.params.id);
        }
        case rpc_1.KeyringRpcMethod.CreateAccount: {
            (0, superstruct_1.assert)(request, api_1.CreateAccountRequestStruct);
            return keyring.createAccount(request.params.options);
        }
        case rpc_1.KeyringRpcMethod.FilterAccountChains: {
            (0, superstruct_1.assert)(request, api_1.FilterAccountChainsStruct);
            return keyring.filterAccountChains(request.params.id, request.params.chains);
        }
        case rpc_1.KeyringRpcMethod.UpdateAccount: {
            (0, superstruct_1.assert)(request, api_1.UpdateAccountRequestStruct);
            return keyring.updateAccount(request.params.account);
        }
        case rpc_1.KeyringRpcMethod.DeleteAccount: {
            (0, superstruct_1.assert)(request, api_1.DeleteAccountRequestStruct);
            return keyring.deleteAccount(request.params.id);
        }
        case rpc_1.KeyringRpcMethod.ExportAccount: {
            if (keyring.exportAccount === undefined) {
                throw new MethodNotSupportedError(request.method);
            }
            (0, superstruct_1.assert)(request, api_1.ExportAccountRequestStruct);
            return keyring.exportAccount(request.params.id);
        }
        case rpc_1.KeyringRpcMethod.ListRequests: {
            if (keyring.listRequests === undefined) {
                throw new MethodNotSupportedError(request.method);
            }
            (0, superstruct_1.assert)(request, api_1.ListRequestsRequestStruct);
            return keyring.listRequests();
        }
        case rpc_1.KeyringRpcMethod.GetRequest: {
            if (keyring.getRequest === undefined) {
                throw new MethodNotSupportedError(request.method);
            }
            (0, superstruct_1.assert)(request, api_1.GetRequestRequestStruct);
            return keyring.getRequest(request.params.id);
        }
        case rpc_1.KeyringRpcMethod.SubmitRequest: {
            (0, superstruct_1.assert)(request, api_1.SubmitRequestRequestStruct);
            return keyring.submitRequest(request.params);
        }
        case rpc_1.KeyringRpcMethod.ApproveRequest: {
            if (keyring.approveRequest === undefined) {
                throw new MethodNotSupportedError(request.method);
            }
            (0, superstruct_1.assert)(request, api_1.ApproveRequestRequestStruct);
            return keyring.approveRequest(request.params.id, request.params.data);
        }
        case rpc_1.KeyringRpcMethod.RejectRequest: {
            if (keyring.rejectRequest === undefined) {
                throw new MethodNotSupportedError(request.method);
            }
            (0, superstruct_1.assert)(request, api_1.RejectRequestRequestStruct);
            return keyring.rejectRequest(request.params.id);
        }
        default: {
            throw new MethodNotSupportedError(request.method);
        }
    }
}
exports.handleKeyringRequest = handleKeyringRequest;
//# sourceMappingURL=rpc-handler.js.map