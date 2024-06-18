"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PermissionLogController_instances, _PermissionLogController_restrictedMethods, _PermissionLogController_getAccountToTimeMap, _PermissionLogController_logRequest, _PermissionLogController_logResponse, _PermissionLogController_logPermissionsHistory, _PermissionLogController_commitNewHistory, _PermissionLogController_getRequestedMethods, _PermissionLogController_getAccountsFromPermission;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionLogController = void 0;
const base_controller_1 = require("@metamask/base-controller");
const utils_1 = require("@metamask/utils");
const enums_1 = require("./enums");
const defaultState = {
    permissionHistory: {},
    permissionActivityLog: [],
};
const name = 'PermissionLogController';
/**
 * Controller with middleware for logging requests and responses to restricted
 * and permissions-related methods.
 */
class PermissionLogController extends base_controller_1.BaseController {
    constructor({ messenger, restrictedMethods, state, }) {
        super({
            messenger,
            name,
            metadata: {
                permissionHistory: {
                    persist: true,
                    anonymous: false,
                },
                permissionActivityLog: {
                    persist: true,
                    anonymous: false,
                },
            },
            state: Object.assign(Object.assign({}, defaultState), state),
        });
        _PermissionLogController_instances.add(this);
        _PermissionLogController_restrictedMethods.set(this, void 0);
        __classPrivateFieldSet(this, _PermissionLogController_restrictedMethods, restrictedMethods, "f");
    }
    /**
     * Updates the exposed account history for the given origin.
     * Sets the 'last seen' time to Date.now() for the given accounts.
     * Does **not** update the 'lastApproved' time for the permission itself.
     * Returns if the accounts array is empty.
     *
     * @param origin - The origin that the accounts are exposed to.
     * @param accounts - The accounts.
     */
    updateAccountsHistory(origin, accounts) {
        if (accounts.length === 0) {
            return;
        }
        const newEntries = {
            eth_accounts: {
                accounts: __classPrivateFieldGet(this, _PermissionLogController_instances, "m", _PermissionLogController_getAccountToTimeMap).call(this, accounts, Date.now()),
            },
        };
        __classPrivateFieldGet(this, _PermissionLogController_instances, "m", _PermissionLogController_commitNewHistory).call(this, origin, newEntries);
    }
    /**
     * Create a permissions log middleware. Records permissions activity and history:
     *
     * Activity: requests and responses for restricted and most wallet_ methods.
     *
     * History: for each origin, the last time a permission was granted, including
     * which accounts were exposed, if any.
     *
     * @returns The permissions log middleware.
     */
    createMiddleware() {
        return (req, res, next) => {
            const { origin, method } = req;
            const isInternal = method.startsWith(enums_1.WALLET_PREFIX);
            const isEthRequestAccounts = method === 'eth_requestAccounts';
            // Determine if the method should be logged
            if ((!enums_1.LOG_IGNORE_METHODS.includes(method) &&
                (isInternal || __classPrivateFieldGet(this, _PermissionLogController_restrictedMethods, "f").has(method))) ||
                isEthRequestAccounts) {
                const activityEntry = __classPrivateFieldGet(this, _PermissionLogController_instances, "m", _PermissionLogController_logRequest).call(this, req, isInternal);
                const requestedMethods = __classPrivateFieldGet(this, _PermissionLogController_instances, "m", _PermissionLogController_getRequestedMethods).call(this, req);
                // Call next with a return handler for capturing the response
                next((cb) => {
                    const time = Date.now();
                    __classPrivateFieldGet(this, _PermissionLogController_instances, "m", _PermissionLogController_logResponse).call(this, activityEntry, res, time);
                    if (requestedMethods && !res.error && res.result && origin) {
                        __classPrivateFieldGet(this, _PermissionLogController_instances, "m", _PermissionLogController_logPermissionsHistory).call(this, requestedMethods, origin, res.result, time, isEthRequestAccounts);
                    }
                    cb();
                });
                return;
            }
            next();
        };
    }
}
exports.PermissionLogController = PermissionLogController;
_PermissionLogController_restrictedMethods = new WeakMap(), _PermissionLogController_instances = new WeakSet(), _PermissionLogController_getAccountToTimeMap = function _PermissionLogController_getAccountToTimeMap(accounts, time) {
    return accounts.reduce((acc, account) => (Object.assign(Object.assign({}, acc), { [account]: time })), {});
}, _PermissionLogController_logRequest = function _PermissionLogController_logRequest(request, isInternal) {
    const activityEntry = {
        id: request.id,
        method: request.method,
        methodType: isInternal
            ? enums_1.LOG_METHOD_TYPES.internal
            : enums_1.LOG_METHOD_TYPES.restricted,
        origin: request.origin,
        requestTime: Date.now(),
        responseTime: null,
        success: null,
    };
    this.update((state) => {
        const newLogs = [...state.permissionActivityLog, activityEntry];
        state.permissionActivityLog =
            // remove oldest log if exceeding size limit
            newLogs.length > enums_1.LOG_LIMIT ? newLogs.slice(1) : newLogs;
    });
    return activityEntry;
}, _PermissionLogController_logResponse = function _PermissionLogController_logResponse(entry, response, time) {
    if (!entry || !response) {
        return;
    }
    // The JSON-RPC 2.0 specification defines "success" by the presence of
    // either the "result" or "error" property. The specification forbids
    // both properties from being present simultaneously, and our JSON-RPC
    // stack is spec-compliant at the time of writing.
    this.update((state) => {
        state.permissionActivityLog = state.permissionActivityLog.map((log) => {
            // Update the log entry that matches the given entry id
            if (log.id === entry.id) {
                return Object.assign(Object.assign({}, log), { success: (0, utils_1.hasProperty)(response, 'result'), responseTime: time });
            }
            return log;
        });
    });
}, _PermissionLogController_logPermissionsHistory = function _PermissionLogController_logPermissionsHistory(requestedMethods, origin, result, time, isEthRequestAccounts) {
    let newEntries;
    if (isEthRequestAccounts) {
        // Type assertion: We are assuming that the response data contains
        // a set of accounts if the RPC method is "eth_requestAccounts".
        const accounts = result;
        newEntries = {
            eth_accounts: {
                accounts: __classPrivateFieldGet(this, _PermissionLogController_instances, "m", _PermissionLogController_getAccountToTimeMap).call(this, accounts, time),
                lastApproved: time,
            },
        };
    }
    else {
        // Records new "lastApproved" times for the granted permissions, if any.
        // Special handling for eth_accounts, in order to record the time the
        // accounts were last seen or approved by the origin.
        // Type assertion: We are assuming that the response data contains
        // a set of permissions if the RPC method is "eth_requestPermissions".
        const permissions = result;
        newEntries = permissions.reduce((acc, permission) => {
            const method = permission.parentCapability;
            if (!requestedMethods.includes(method)) {
                return acc;
            }
            if (method === 'eth_accounts') {
                const accounts = __classPrivateFieldGet(this, _PermissionLogController_instances, "m", _PermissionLogController_getAccountsFromPermission).call(this, permission);
                return Object.assign(Object.assign({}, acc), { [method]: {
                        lastApproved: time,
                        accounts: __classPrivateFieldGet(this, _PermissionLogController_instances, "m", _PermissionLogController_getAccountToTimeMap).call(this, accounts, time),
                    } });
            }
            return Object.assign(Object.assign({}, acc), { [method]: {
                    lastApproved: time,
                } });
        }, {});
    }
    if (Object.keys(newEntries).length > 0) {
        __classPrivateFieldGet(this, _PermissionLogController_instances, "m", _PermissionLogController_commitNewHistory).call(this, origin, newEntries);
    }
}, _PermissionLogController_commitNewHistory = function _PermissionLogController_commitNewHistory(origin, newEntries) {
    var _a, _b;
    const { permissionHistory } = this.state;
    // a simple merge updates most permissions
    const oldOriginHistory = (_a = permissionHistory[origin]) !== null && _a !== void 0 ? _a : {};
    const newOriginHistory = Object.assign(Object.assign({}, oldOriginHistory), newEntries);
    // eth_accounts requires special handling, because of information
    // we store about the accounts
    const existingEthAccountsEntry = oldOriginHistory.eth_accounts;
    const newEthAccountsEntry = newEntries.eth_accounts;
    if (existingEthAccountsEntry && newEthAccountsEntry) {
        // we may intend to update just the accounts, not the permission
        // itself
        const lastApproved = (_b = newEthAccountsEntry.lastApproved) !== null && _b !== void 0 ? _b : existingEthAccountsEntry.lastApproved;
        // merge old and new eth_accounts history entries
        newOriginHistory.eth_accounts = {
            lastApproved,
            accounts: Object.assign(Object.assign({}, existingEthAccountsEntry.accounts), newEthAccountsEntry.accounts),
        };
    }
    this.update((state) => {
        state.permissionHistory = Object.assign(Object.assign({}, permissionHistory), { [origin]: newOriginHistory });
    });
}, _PermissionLogController_getRequestedMethods = function _PermissionLogController_getRequestedMethods(request) {
    const { method, params } = request;
    if (method === 'eth_requestAccounts') {
        return ['eth_accounts'];
    }
    else if (method === `${enums_1.WALLET_PREFIX}requestPermissions` &&
        params &&
        Array.isArray(params) &&
        params[0] &&
        typeof params[0] === 'object' &&
        !Array.isArray(params[0])) {
        return Object.keys(params[0]);
    }
    return null;
}, _PermissionLogController_getAccountsFromPermission = function _PermissionLogController_getAccountsFromPermission(permission) {
    if (permission.parentCapability !== 'eth_accounts' || !permission.caveats) {
        return [];
    }
    const accounts = new Set();
    for (const caveat of permission.caveats) {
        if (caveat.type === enums_1.CAVEAT_TYPES.restrictReturnedAccounts &&
            Array.isArray(caveat.value)) {
            for (const value of caveat.value) {
                accounts.add(value);
            }
        }
    }
    return [...accounts];
};
//# sourceMappingURL=PermissionLogController.js.map