"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapMessageStruct = void 0;
const utils_1 = require("@metamask/utils");
const superstruct_1 = require("superstruct");
exports.SnapMessageStruct = (0, superstruct_1.object)({
    method: (0, superstruct_1.string)(),
    params: (0, superstruct_1.optional)((0, superstruct_1.union)([(0, superstruct_1.array)(utils_1.JsonStruct), (0, superstruct_1.record)((0, superstruct_1.string)(), utils_1.JsonStruct)])),
});
//# sourceMappingURL=types.js.map