"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIsError = exports.successfulFetch = exports.handleFetch = exports.graphQL = void 0;
/**
 * Execute a GraphQL query.
 *
 * @param url - GraphQL endpoint URL.
 * @param query - GraphQL query.
 * @param variables - GraphQL variables.
 */
function graphQL(url, query, 
// TODO: Replace `any` with type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
variables) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = JSON.stringify({
            query,
            variables,
        });
        const response = yield handleFetch(url, {
            body,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response === null || response === void 0 ? void 0 : response.data;
    });
}
exports.graphQL = graphQL;
// Below functions are intentionally copied from controller-utils to avoid a package dependency
/**
 * Execute fetch and return object response.
 *
 * @param request - The request information.
 * @param options - The fetch options.
 * @returns The fetch response JSON data.
 */
function handleFetch(request, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield successfulFetch(request, options);
        const object = yield response.json();
        return object;
    });
}
exports.handleFetch = handleFetch;
/**
 * Execute fetch and verify that the response was successful.
 *
 * @param request - Request information.
 * @param options - Fetch options.
 * @returns The fetch response.
 */
function successfulFetch(request, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(request, options);
        if (!response.ok) {
            throw new Error(`Fetch failed with status '${response.status}' for request '${request}'`);
        }
        return response;
    });
}
exports.successfulFetch = successfulFetch;
/**
 * Assert that a value is an error. If it's not an error, throw an
 * error that wraps the given value.
 *
 * TODO: Migrate this to @metamask/utils
 *
 * @param error - The value that we expect to be an error.
 * @throws Throws an error wrapping the given value if it's not an error.
 */
function assertIsError(error) {
    if (error instanceof Error) {
        return;
    }
    throw new Error(`Invalid error of type '${typeof error}'`);
}
exports.assertIsError = assertIsError;
//# sourceMappingURL=util.js.map