"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalAccountStruct = void 0;
const superstruct_1 = require("superstruct");
const api_1 = require("../api");
const superstruct_2 = require("../superstruct");
exports.InternalAccountStruct = (0, superstruct_2.object)({
    ...api_1.KeyringAccountStruct.schema,
    metadata: (0, superstruct_2.object)({
        name: (0, superstruct_1.string)(),
        snap: (0, superstruct_2.exactOptional)((0, superstruct_2.object)({
            id: (0, superstruct_1.string)(),
            enabled: (0, superstruct_1.boolean)(),
            name: (0, superstruct_1.string)(),
        })),
        lastSelected: (0, superstruct_2.exactOptional)((0, superstruct_1.number)()),
        keyring: (0, superstruct_2.object)({
            type: (0, superstruct_1.string)(),
        }),
    }),
});
//# sourceMappingURL=types.js.map