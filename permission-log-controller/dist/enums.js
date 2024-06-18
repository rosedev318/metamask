"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG_LIMIT = exports.LOG_METHOD_TYPES = exports.LOG_IGNORE_METHODS = exports.CAVEAT_TYPES = exports.WALLET_PREFIX = void 0;
exports.WALLET_PREFIX = 'wallet_';
exports.CAVEAT_TYPES = Object.freeze({
    restrictReturnedAccounts: 'restrictReturnedAccounts',
});
exports.LOG_IGNORE_METHODS = [
    'wallet_registerOnboarding',
    'wallet_watchAsset',
];
var LOG_METHOD_TYPES;
(function (LOG_METHOD_TYPES) {
    LOG_METHOD_TYPES["restricted"] = "restricted";
    LOG_METHOD_TYPES["internal"] = "internal";
})(LOG_METHOD_TYPES = exports.LOG_METHOD_TYPES || (exports.LOG_METHOD_TYPES = {}));
/**
 * The permission activity log size limit.
 */
exports.LOG_LIMIT = 100;
//# sourceMappingURL=enums.js.map