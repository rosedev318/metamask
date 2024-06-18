"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePairingKeyFromRawState = exports.addPairingKeyToRawState = exports.clearRawState = exports.setDesktopState = exports.setRawState = exports.getAndUpdateDesktopState = exports.getDesktopState = exports.getRawState = void 0;
const browser_1 = require("../browser");
const getRawState = async () => {
    return (await browser_1.browser.storage.local.get());
};
exports.getRawState = getRawState;
const getDesktopState = async () => {
    const state = await (0, exports.getRawState)();
    return state.data?.DesktopController || {};
};
exports.getDesktopState = getDesktopState;
const getAndUpdateDesktopState = async (desktopState) => {
    const state = await (0, exports.getRawState)();
    const currentDesktopState = state.data.DesktopController;
    state.data.DesktopController = { ...currentDesktopState, ...desktopState };
    return state;
};
exports.getAndUpdateDesktopState = getAndUpdateDesktopState;
const setRawState = async (state) => {
    await browser_1.browser.storage.local.set(state);
};
exports.setRawState = setRawState;
const setDesktopState = async (desktopState) => {
    const state = await (0, exports.getAndUpdateDesktopState)(desktopState);
    await (0, exports.setRawState)(state);
};
exports.setDesktopState = setDesktopState;
const clearRawState = async () => {
    await browser_1.browser.storage.local.clear();
};
exports.clearRawState = clearRawState;
const addPairingKeyToRawState = async (state) => {
    const existingDeskotpState = await (0, exports.getDesktopState)();
    return {
        ...state,
        data: {
            ...state.data,
            DesktopController: {
                ...state.data?.DesktopController,
                pairingKey: existingDeskotpState.pairingKey,
                pairingKeyHash: existingDeskotpState.pairingKeyHash,
            },
        },
    };
};
exports.addPairingKeyToRawState = addPairingKeyToRawState;
const removePairingKeyFromRawState = (state) => {
    return {
        ...state,
        data: {
            ...state.data,
            DesktopController: {
                ...state.data.DesktopController,
                pairingKey: undefined,
                pairingKeyHash: undefined,
            },
        },
    };
};
exports.removePairingKeyFromRawState = removePairingKeyFromRawState;
//# sourceMappingURL=state.js.map