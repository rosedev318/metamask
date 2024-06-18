"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equalsIgnoreCase = exports.throwError = exports.ensureDefined = exports.toJson = exports.unique = exports.strictMask = void 0;
const superstruct_1 = require("superstruct");
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
/**
 * Remove duplicate entries from an array.
 *
 * @param array - Array to remove duplicates from.
 * @returns Array with duplicates removed.
 */
function unique(array) {
    return [...new Set(array)];
}
exports.unique = unique;
/**
 * Convert a value to a valid JSON object.
 *
 * The function chains JSON.stringify and JSON.parse to ensure that the result
 * is a valid JSON object. In objects, undefined values are removed, and in
 * arrays, they are replaced with null.
 *
 * @param value - Value to convert to JSON.
 * @returns JSON representation of the value.
 */
function toJson(value) {
    return JSON.parse(JSON.stringify(value));
}
exports.toJson = toJson;
/**
 * Asserts that the given value is defined.
 *
 * @param value - Value to check.
 */
function ensureDefined(value) {
    if (value === undefined) {
        throw new Error('Argument is undefined');
    }
}
exports.ensureDefined = ensureDefined;
/**
 * Helper function that throws an error.
 *
 * @param message - Error message to throw.
 */
function throwError(message) {
    throw new Error(message);
}
exports.throwError = throwError;
/**
 * Compares two strings for equality, ignoring case.
 *
 * @param a - The first string to compare.
 * @param b - The second string to compare.
 * @returns `true` if the strings are equal, ignoring case. `false` otherwise.
 */
function equalsIgnoreCase(a, b) {
    return a.toLowerCase() === b.toLowerCase();
}
exports.equalsIgnoreCase = equalsIgnoreCase;
//# sourceMappingURL=util.js.map