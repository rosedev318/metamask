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
var _SnapControllerSender_snapId, _SnapControllerSender_origin, _SnapControllerSender_controller, _SnapControllerSender_handler, _KeyringSnapControllerClient_controller;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyringSnapControllerClient = void 0;
const keyring_api_1 = require("@metamask/keyring-api");
/**
 * Implementation of the `Sender` interface that can be used to send requests
 * to a snap through a `SnapController`.
 */
class SnapControllerSender {
    /**
     * Create a new instance of `SnapControllerSender`.
     *
     * @param controller - The `SnapController` instance to send requests to.
     * @param snapId - The ID of the snap to use.
     * @param origin - The sender's origin.
     * @param handler - The handler type.
     */
    constructor(controller, snapId, origin, handler) {
        _SnapControllerSender_snapId.set(this, void 0);
        _SnapControllerSender_origin.set(this, void 0);
        _SnapControllerSender_controller.set(this, void 0);
        _SnapControllerSender_handler.set(this, void 0);
        __classPrivateFieldSet(this, _SnapControllerSender_controller, controller, "f");
        __classPrivateFieldSet(this, _SnapControllerSender_snapId, snapId, "f");
        __classPrivateFieldSet(this, _SnapControllerSender_origin, origin, "f");
        __classPrivateFieldSet(this, _SnapControllerSender_handler, handler, "f");
    }
    /**
     * Send a request to the snap and return the response.
     *
     * @param request - JSON-RPC request to send to the snap.
     * @returns A promise that resolves to the response of the request.
     */
    async send(request) {
        return __classPrivateFieldGet(this, _SnapControllerSender_controller, "f").handleRequest({
            snapId: __classPrivateFieldGet(this, _SnapControllerSender_snapId, "f"),
            origin: __classPrivateFieldGet(this, _SnapControllerSender_origin, "f"),
            handler: __classPrivateFieldGet(this, _SnapControllerSender_handler, "f"),
            request,
        });
    }
}
_SnapControllerSender_snapId = new WeakMap(), _SnapControllerSender_origin = new WeakMap(), _SnapControllerSender_controller = new WeakMap(), _SnapControllerSender_handler = new WeakMap();
/**
 * A `KeyringClient` that allows the communication with a snap through the
 * `SnapController`.
 */
class KeyringSnapControllerClient extends keyring_api_1.KeyringClient {
    /**
     * Create a new instance of `KeyringSnapControllerClient`.
     *
     * The `handlerType` argument has a hard-coded default `string` value instead
     * of a `HandlerType` value to prevent the `@metamask/snaps-utils` module
     * from being required at runtime.
     *
     * @param args - Constructor arguments.
     * @param args.controller - The `SnapController` instance to use.
     * @param args.snapId - The ID of the snap to use (default: `'undefined'`).
     * @param args.origin - The sender's origin (default: `'metamask'`).
     * @param args.handler - The handler type (default: `'onKeyringRequest'`).
     */
    constructor({ controller, snapId = 'undefined', origin = 'metamask', handler = 'onKeyringRequest', }) {
        super(new SnapControllerSender(controller, snapId, origin, handler));
        _KeyringSnapControllerClient_controller.set(this, void 0);
        __classPrivateFieldSet(this, _KeyringSnapControllerClient_controller, controller, "f");
    }
    /**
     * Create a new instance of `KeyringSnapControllerClient` with the specified
     * `snapId`.
     *
     * @param snapId - The ID of the snap to use in the new instance.
     * @returns A new instance of `KeyringSnapControllerClient` with the
     * specified snap ID.
     */
    withSnapId(snapId) {
        return new KeyringSnapControllerClient({
            controller: __classPrivateFieldGet(this, _KeyringSnapControllerClient_controller, "f"),
            snapId,
        });
    }
    /**
     * Get the `SnapController` instance used by this client.
     *
     * @returns The `SnapController` instance used by this client.
     */
    getController() {
        return __classPrivateFieldGet(this, _KeyringSnapControllerClient_controller, "f");
    }
}
exports.KeyringSnapControllerClient = KeyringSnapControllerClient;
_KeyringSnapControllerClient_controller = new WeakMap();
//# sourceMappingURL=KeyringSnapControllerClient.js.map