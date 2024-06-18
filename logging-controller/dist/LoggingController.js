"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LoggingController_instances, _LoggingController_generateId;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingController = void 0;
const base_controller_1 = require("@metamask/base-controller");
const uuid_1 = require("uuid");
const name = 'LoggingController';
const metadata = {
    logs: { persist: true, anonymous: false },
};
const defaultState = {
    logs: {},
};
/**
 * Controller that manages a list of logs for signature requests.
 */
class LoggingController extends base_controller_1.BaseController {
    /**
     * Creates a LoggingController instance.
     *
     * @param options - Constructor options
     * @param options.messenger - An instance of the ControllerMessenger
     * @param options.state - Initial state to set on this controller.
     */
    constructor({ messenger, state, }) {
        super({
            name,
            metadata,
            messenger,
            state: Object.assign(Object.assign({}, defaultState), state),
        });
        _LoggingController_instances.add(this);
        this.messagingSystem.registerActionHandler(`${name}:add`, (log) => this.add(log));
    }
    /**
     * Add log to the state.
     *
     * @param log - Log to add to the controller
     */
    add(log) {
        const newLog = {
            id: __classPrivateFieldGet(this, _LoggingController_instances, "m", _LoggingController_generateId).call(this),
            timestamp: Date.now(),
            log,
        };
        this.update((state) => {
            state.logs[newLog.id] = newLog;
        });
    }
    /**
     * Removes all log entries.
     */
    clear() {
        this.update((state) => {
            state.logs = {};
        });
    }
}
exports.LoggingController = LoggingController;
_LoggingController_instances = new WeakSet(), _LoggingController_generateId = function _LoggingController_generateId() {
    let id = (0, uuid_1.v1)();
    while (id in this.state.logs) {
        id = (0, uuid_1.v1)();
    }
    return id;
};
//# sourceMappingURL=LoggingController.js.map