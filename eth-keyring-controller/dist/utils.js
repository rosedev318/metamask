"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = void 0;
/**
 * Throws an error.
 *
 * @param error - Error message or Error object to throw.
 */
function throwError(error) {
    throw typeof error === 'string' ? new Error(error) : error;
}
exports.throwError = throwError;
//# sourceMappingURL=utils.js.map