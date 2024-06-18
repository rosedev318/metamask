"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesktopController = void 0;
const obs_store_1 = require("@metamask/obs-store");
class DesktopController {
    constructor({ initState }) {
        this.store = new obs_store_1.ObservableStore({
            desktopEnabled: false,
            pairingKey: undefined,
            pairingKeyHash: undefined,
            ...initState,
        });
    }
    getDesktopEnabled() {
        return this.store.getState().desktopEnabled === true;
    }
    setDesktopEnabled(desktopEnabled) {
        this.store.updateState({
            desktopEnabled,
        });
    }
    setPairingKey(pairingKey) {
        this.store.updateState({
            pairingKey,
        });
    }
    generateOtp() {
        throw Error('No implementation provided');
    }
    async testDesktopConnection() {
        throw Error('No implementation provided');
    }
    async disableDesktop() {
        throw Error('No implementation provided');
    }
}
exports.DesktopController = DesktopController;
//# sourceMappingURL=desktop-base.js.map