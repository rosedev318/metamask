"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesktopController = exports.initDesktopController = void 0;
// eslint-disable-next-line import/no-mutable-exports
let controllerType;
exports.DesktopController = controllerType;
const initDesktopController = (newControllerType) => {
    if (controllerType) {
        return;
    }
    exports.DesktopController = controllerType = newControllerType;
};
exports.initDesktopController = initDesktopController;
if (!global.isDesktopApp) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    exports.DesktopController = controllerType = require('./desktop-extension').ExtensionDesktopController;
}
//# sourceMappingURL=desktop.js.map