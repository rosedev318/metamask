"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AnnouncementController_instances, _AnnouncementController_addAnnouncements;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementController = void 0;
const base_controller_1 = require("@metamask/base-controller");
const controllerName = 'AnnouncementController';
const defaultState = {
    announcements: {},
};
const metadata = {
    announcements: {
        persist: true,
        anonymous: true,
    },
};
/**
 * Controller for managing in-app announcements.
 */
class AnnouncementController extends base_controller_1.BaseController {
    /**
     * Creates a AnnouncementController instance.
     *
     * @param args - The arguments to this function.
     * @param args.messenger - Messenger used to communicate with BaseV2 controller.
     * @param args.state - Initial state to set on this controller.
     * @param args.allAnnouncements - Announcements to be passed through to #addAnnouncements
     */
    constructor({ messenger, state, allAnnouncements, }) {
        const mergedState = Object.assign(Object.assign({}, defaultState), state);
        super({ messenger, metadata, name: controllerName, state: mergedState });
        _AnnouncementController_instances.add(this);
        __classPrivateFieldGet(this, _AnnouncementController_instances, "m", _AnnouncementController_addAnnouncements).call(this, allAnnouncements);
    }
    /**
     * Updates the status of the status of the specified announcements
     * once it is read by the user.
     *
     * @param viewedIds - The announcement IDs to mark as viewed.
     */
    updateViewed(viewedIds) {
        this.update(({ announcements }) => {
            for (const id of Object.keys(viewedIds).map(Number)) {
                announcements[id].isShown = viewedIds[id];
            }
        });
    }
}
exports.AnnouncementController = AnnouncementController;
_AnnouncementController_instances = new WeakSet(), _AnnouncementController_addAnnouncements = function _AnnouncementController_addAnnouncements(allAnnouncements) {
    this.update((state) => {
        Object.values(allAnnouncements).forEach((announcement) => {
            var _a;
            state.announcements[announcement.id] = (_a = state.announcements[announcement.id]) !== null && _a !== void 0 ? _a : Object.assign(Object.assign({}, announcement), { isShown: false });
        });
    });
};
//# sourceMappingURL=AnnouncementController.js.map