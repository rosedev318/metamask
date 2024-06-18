"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectRequestResponseStruct = exports.RejectRequestRequestStruct = exports.ApproveRequestResponseStruct = exports.ApproveRequestRequestStruct = exports.SubmitRequestResponseStruct = exports.SubmitRequestRequestStruct = exports.GetRequestResponseStruct = exports.GetRequestRequestStruct = exports.ListRequestsResponseStruct = exports.ListRequestsRequestStruct = exports.ExportAccountResponseStruct = exports.ExportAccountRequestStruct = exports.DeleteAccountResponseStruct = exports.DeleteAccountRequestStruct = exports.UpdateAccountResponseStruct = exports.UpdateAccountRequestStruct = exports.FilterAccountChainsResponseStruct = exports.FilterAccountChainsStruct = exports.CreateAccountResponseStruct = exports.CreateAccountRequestStruct = exports.GetAccountResponseStruct = exports.GetAccountRequestStruct = exports.ListAccountsResponseStruct = exports.ListAccountsRequestStruct = void 0;
const utils_1 = require("@metamask/utils");
const superstruct_1 = require("superstruct");
const api_1 = require("../api");
const utils_2 = require("../utils");
const CommonHeader = {
    jsonrpc: (0, superstruct_1.literal)('2.0'),
    id: (0, superstruct_1.union)([(0, superstruct_1.string)(), (0, superstruct_1.number)(), (0, superstruct_1.literal)(null)]),
};
// ----------------------------------------------------------------------------
// List accounts
exports.ListAccountsRequestStruct = (0, superstruct_1.object)({
    ...CommonHeader,
    method: (0, superstruct_1.literal)('keyring_listAccounts'),
});
exports.ListAccountsResponseStruct = (0, superstruct_1.array)(api_1.KeyringAccountStruct);
// ----------------------------------------------------------------------------
// Get account
exports.GetAccountRequestStruct = (0, superstruct_1.object)({
    ...CommonHeader,
    method: (0, superstruct_1.literal)('keyring_getAccount'),
    params: (0, superstruct_1.object)({
        id: utils_2.UuidStruct,
    }),
});
exports.GetAccountResponseStruct = api_1.KeyringAccountStruct;
// ----------------------------------------------------------------------------
// Create account
exports.CreateAccountRequestStruct = (0, superstruct_1.object)({
    ...CommonHeader,
    method: (0, superstruct_1.literal)('keyring_createAccount'),
    params: (0, superstruct_1.object)({
        options: (0, superstruct_1.record)((0, superstruct_1.string)(), utils_1.JsonStruct),
    }),
});
exports.CreateAccountResponseStruct = api_1.KeyringAccountStruct;
// ----------------------------------------------------------------------------
// Filter account chains
exports.FilterAccountChainsStruct = (0, superstruct_1.object)({
    ...CommonHeader,
    method: (0, superstruct_1.literal)('keyring_filterAccountChains'),
    params: (0, superstruct_1.object)({
        id: utils_2.UuidStruct,
        chains: (0, superstruct_1.array)((0, superstruct_1.string)()),
    }),
});
exports.FilterAccountChainsResponseStruct = (0, superstruct_1.array)((0, superstruct_1.string)());
// ----------------------------------------------------------------------------
// Update account
exports.UpdateAccountRequestStruct = (0, superstruct_1.object)({
    ...CommonHeader,
    method: (0, superstruct_1.literal)('keyring_updateAccount'),
    params: (0, superstruct_1.object)({
        account: api_1.KeyringAccountStruct,
    }),
});
exports.UpdateAccountResponseStruct = (0, superstruct_1.literal)(null);
// ----------------------------------------------------------------------------
// Delete account
exports.DeleteAccountRequestStruct = (0, superstruct_1.object)({
    ...CommonHeader,
    method: (0, superstruct_1.literal)('keyring_deleteAccount'),
    params: (0, superstruct_1.object)({
        id: utils_2.UuidStruct,
    }),
});
exports.DeleteAccountResponseStruct = (0, superstruct_1.literal)(null);
// ----------------------------------------------------------------------------
// Export account
exports.ExportAccountRequestStruct = (0, superstruct_1.object)({
    ...CommonHeader,
    method: (0, superstruct_1.literal)('keyring_exportAccount'),
    params: (0, superstruct_1.object)({
        id: utils_2.UuidStruct,
    }),
});
exports.ExportAccountResponseStruct = api_1.KeyringAccountDataStruct;
// ----------------------------------------------------------------------------
// List requests
exports.ListRequestsRequestStruct = (0, superstruct_1.object)({
    ...CommonHeader,
    method: (0, superstruct_1.literal)('keyring_listRequests'),
});
exports.ListRequestsResponseStruct = (0, superstruct_1.array)(api_1.KeyringRequestStruct);
// ----------------------------------------------------------------------------
// Get request
exports.GetRequestRequestStruct = (0, superstruct_1.object)({
    ...CommonHeader,
    method: (0, superstruct_1.literal)('keyring_getRequest'),
    params: (0, superstruct_1.object)({
        id: utils_2.UuidStruct,
    }),
});
exports.GetRequestResponseStruct = api_1.KeyringRequestStruct;
// ----------------------------------------------------------------------------
// Submit request
exports.SubmitRequestRequestStruct = (0, superstruct_1.object)({
    ...CommonHeader,
    method: (0, superstruct_1.literal)('keyring_submitRequest'),
    params: api_1.KeyringRequestStruct,
});
exports.SubmitRequestResponseStruct = api_1.KeyringResponseStruct;
// ----------------------------------------------------------------------------
// Approve request
exports.ApproveRequestRequestStruct = (0, superstruct_1.object)({
    ...CommonHeader,
    method: (0, superstruct_1.literal)('keyring_approveRequest'),
    params: (0, superstruct_1.object)({
        id: utils_2.UuidStruct,
        data: (0, superstruct_1.record)((0, superstruct_1.string)(), utils_1.JsonStruct),
    }),
});
exports.ApproveRequestResponseStruct = (0, superstruct_1.literal)(null);
// ----------------------------------------------------------------------------
// Reject request
exports.RejectRequestRequestStruct = (0, superstruct_1.object)({
    ...CommonHeader,
    method: (0, superstruct_1.literal)('keyring_rejectRequest'),
    params: (0, superstruct_1.object)({
        id: utils_2.UuidStruct,
    }),
});
exports.RejectRequestResponseStruct = (0, superstruct_1.literal)(null);
//# sourceMappingURL=api.js.map