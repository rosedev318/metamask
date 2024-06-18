"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cfg = exports.envBool = exports.envInt = exports.envStringMatch = void 0;
const envStringMatch = (value, expected) => {
    if (!value) {
        return false;
    }
    return value.toLowerCase
        ? value.toLowerCase() === expected.toLowerCase()
        : false;
};
exports.envStringMatch = envStringMatch;
function envInt(value, defaultValue) {
    if (!value) {
        return defaultValue;
    }
    return parseInt(value, 10);
}
exports.envInt = envInt;
const envBool = (value, defaultValue = false) => {
    if (value === undefined || value === null) {
        return defaultValue;
    }
    if (value === true || value === false) {
        return value;
    }
    return (0, exports.envStringMatch)(value, 'true');
};
exports.envBool = envBool;
const loadConfig = () => {
    // Cannot use dynamic references to envs as build system does find and replace
    const port = envInt(process.env.WEB_SOCKET_PORT, 7071);
    return {
        isDebug: (0, exports.envBool)(process.env.METAMASK_DEBUG),
        isExtensionTest: (0, exports.envBool)(process.env.IN_TEST),
        skipOtpPairingFlow: (0, exports.envBool)(process.env.SKIP_OTP_PAIRING_FLOW),
        compatibilityVersion: {
            extension: envInt(process.env.COMPATIBILITY_VERSION_EXTENSION, 1),
        },
        webSocket: {
            disableEncryption: (0, exports.envBool)(process.env.DISABLE_WEB_SOCKET_ENCRYPTION),
            port,
            url: `ws://localhost:${port}`,
        },
    };
};
let configObject;
const cfg = () => {
    if (!configObject) {
        configObject = loadConfig();
    }
    return configObject;
};
exports.cfg = cfg;
//# sourceMappingURL=config.js.map