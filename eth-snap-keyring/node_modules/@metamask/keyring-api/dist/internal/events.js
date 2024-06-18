"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRejectedEventStruct = exports.RequestApprovedEventStruct = exports.AccountDeletedEventStruct = exports.AccountUpdatedEventStruct = exports.AccountCreatedEventStruct = void 0;
const utils_1 = require("@metamask/utils");
const superstruct_1 = require("superstruct");
const api_1 = require("../api");
const events_1 = require("../events");
const utils_2 = require("../utils");
exports.AccountCreatedEventStruct = (0, superstruct_1.object)({
    method: (0, superstruct_1.literal)(`${events_1.KeyringEvent.AccountCreated}`),
    params: (0, superstruct_1.object)({
        /**
         * New account object.
         */
        account: api_1.KeyringAccountStruct,
    }),
});
exports.AccountUpdatedEventStruct = (0, superstruct_1.object)({
    method: (0, superstruct_1.literal)(`${events_1.KeyringEvent.AccountUpdated}`),
    params: (0, superstruct_1.object)({
        /**
         * Updated account object.
         */
        account: api_1.KeyringAccountStruct,
    }),
});
exports.AccountDeletedEventStruct = (0, superstruct_1.object)({
    method: (0, superstruct_1.literal)(`${events_1.KeyringEvent.AccountDeleted}`),
    params: (0, superstruct_1.object)({
        /**
         * Deleted account ID.
         */
        id: utils_2.UuidStruct,
    }),
});
exports.RequestApprovedEventStruct = (0, superstruct_1.object)({
    method: (0, superstruct_1.literal)(`${events_1.KeyringEvent.RequestApproved}`),
    params: (0, superstruct_1.object)({
        /**
         * Request ID.
         */
        id: utils_2.UuidStruct,
        /**
         * Request result.
         */
        result: utils_1.JsonStruct,
    }),
});
exports.RequestRejectedEventStruct = (0, superstruct_1.object)({
    method: (0, superstruct_1.literal)(`${events_1.KeyringEvent.RequestRejected}`),
    params: (0, superstruct_1.object)({
        /**
         * Request ID.
         */
        id: utils_2.UuidStruct,
    }),
});
//# sourceMappingURL=events.js.map