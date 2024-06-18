"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionDesktopController = void 0;
const desktop_manager_1 = __importDefault(require("../desktop-manager"));
const pairing_1 = require("../pairing");
const desktop_base_1 = require("./desktop-base");
class ExtensionDesktopController extends desktop_base_1.DesktopController {
    generateOtp() {
        return pairing_1.Pairing.generateOTP();
    }
    async testDesktopConnection() {
        return await desktop_manager_1.default.testConnection();
    }
}
exports.ExtensionDesktopController = ExtensionDesktopController;
//# sourceMappingURL=desktop-extension.js.map