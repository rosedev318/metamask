"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthUint256Struct = exports.EthAddressStruct = exports.EthBytesStruct = void 0;
const superstruct_1 = require("../superstruct");
exports.EthBytesStruct = (0, superstruct_1.definePattern)('EthBytes', /^0x[0-9a-f]*$/iu);
exports.EthAddressStruct = (0, superstruct_1.definePattern)('EthAddress', /^0x[0-9a-f]{40}$/iu);
exports.EthUint256Struct = (0, superstruct_1.definePattern)('EthUint256', /^0x([1-9a-f][0-9a-f]*|0)$/iu);
//# sourceMappingURL=types.js.map