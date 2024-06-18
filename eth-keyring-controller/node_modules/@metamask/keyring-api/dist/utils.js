"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictMask = exports.UuidStruct = void 0;
const superstruct_1 = require("superstruct");
const superstruct_2 = require("./superstruct");
/**
 * UUIDv4 struct.
 */
exports.UuidStruct = (0, superstruct_2.definePattern)('UuidV4', /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu);
/**
 * Assert that a value is valid according to a struct.
 *
 * It is similar to superstruct's mask function, but it does not ignore extra
 * properties.
 *
 * @param value - Value to check.
 * @param struct - Struct to validate the value against.
 * @param message - Error message to throw if the value is not valid.
 * @returns The value if it is valid.
 */
function strictMask(value, struct, message) {
    (0, superstruct_1.assert)(value, struct, message);
    return value;
}
exports.strictMask = strictMask;
//# sourceMappingURL=utils.js.map