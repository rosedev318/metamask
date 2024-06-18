"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlers = void 0;
const getPermissions_1 = require("./getPermissions");
const requestPermissions_1 = require("./requestPermissions");
const revokePermissions_1 = require("./revokePermissions");
exports.handlers = [
    requestPermissions_1.requestPermissionsHandler,
    getPermissions_1.getPermissionsHandler,
    revokePermissions_1.revokePermissionsHandler,
];
//# sourceMappingURL=index.js.map