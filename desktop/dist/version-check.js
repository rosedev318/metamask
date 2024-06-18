"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionCheck = void 0;
const log_1 = __importDefault(require("./utils/log"));
const config_1 = require("./utils/config");
const stream_1 = require("./utils/stream");
class VersionCheck {
    constructor(stream, extensionVersion) {
        this.stream = stream;
        this.extensionVersion = extensionVersion;
    }
    async check() {
        log_1.default.debug('Checking versions');
        const extensionVersionData = {
            version: this.extensionVersion,
            compatibilityVersion: (0, config_1.cfg)().compatibilityVersion.extension,
        };
        const checkVersionRequest = {
            extensionVersionData,
        };
        this.stream.write(checkVersionRequest);
        const response = await (0, stream_1.waitForMessage)(this.stream);
        const isExtensionVersionValid = response.isExtensionSupported;
        const isDesktopVersionValid = this.isDesktopVersionSupported(response.desktopVersionData, extensionVersionData);
        const extensionVersion = extensionVersionData.version;
        const desktopVersion = response.desktopVersionData.version;
        const result = {
            extensionVersion,
            desktopVersion,
            isExtensionVersionValid,
            isDesktopVersionValid,
        };
        log_1.default.debug('Completed version check', result);
        return result;
    }
    isDesktopVersionSupported(desktopVersionData, extensionVersionData) {
        return (desktopVersionData.compatibilityVersion >=
            extensionVersionData.compatibilityVersion);
    }
}
exports.VersionCheck = VersionCheck;
//# sourceMappingURL=version-check.js.map