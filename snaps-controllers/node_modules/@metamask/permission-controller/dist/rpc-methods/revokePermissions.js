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
exports.revokePermissionsHandler = void 0;
const utils_1 = require("@metamask/utils");
const errors_1 = require("../errors");
const utils_2 = require("../utils");
exports.revokePermissionsHandler = {
    methodNames: [utils_2.MethodNames.revokePermissions],
    implementation: revokePermissionsImplementation,
    hookNames: {
        revokePermissionsForOrigin: true,
    },
};
/**
 * Revoke Permissions implementation to be used in JsonRpcEngine middleware.
 *
 * @param req - The JsonRpcEngine request
 * @param res - The JsonRpcEngine result object
 * @param _next - JsonRpcEngine next() callback - unused
 * @param end - JsonRpcEngine end() callback
 * @param options - Method hooks passed to the method implementation
 * @param options.revokePermissionsForOrigin - A hook that revokes given permission keys for an origin
 * @returns A promise that resolves to nothing
 */
function revokePermissionsImplementation(req, res, _next, end, { revokePermissionsForOrigin }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { params } = req;
        const param = params === null || params === void 0 ? void 0 : params[0];
        if (!param) {
            return end((0, errors_1.invalidParams)({ data: { request: req } }));
        }
        // For now, this API revokes the entire permission key
        // even if caveats are specified.
        const permissionKeys = Object.keys(param);
        if (!(0, utils_1.isNonEmptyArray)(permissionKeys)) {
            return end((0, errors_1.invalidParams)({ data: { request: req } }));
        }
        revokePermissionsForOrigin(permissionKeys);
        res.result = null;
        return end();
    });
}
//# sourceMappingURL=revokePermissions.js.map