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
var _RestrictedControllerMessenger_instances, _RestrictedControllerMessenger_controllerMessenger, _RestrictedControllerMessenger_controllerName, _RestrictedControllerMessenger_allowedActions, _RestrictedControllerMessenger_allowedEvents, _RestrictedControllerMessenger_isAllowedEvent, _RestrictedControllerMessenger_isAllowedAction, _RestrictedControllerMessenger_isInCurrentNamespace;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestrictedControllerMessenger = void 0;
/**
 * A restricted controller messenger.
 *
 * This acts as a wrapper around the controller messenger instance that restricts access to actions
 * and events.
 *
 * @template Namespace - The namespace for this messenger. Typically this is the name of the controller or
 * module that this messenger has been created for. The authority to publish events and register
 * actions under this namespace is granted to this restricted messenger instance.
 * @template Action - A type union of all Action types.
 * @template Event - A type union of all Event types.
 * @template AllowedAction - A type union of the 'type' string for any allowed actions.
 * This must not include internal actions that are in the messenger's namespace.
 * @template AllowedEvent - A type union of the 'type' string for any allowed events.
 * This must not include internal events that are in the messenger's namespace.
 */
class RestrictedControllerMessenger {
    /**
     * Constructs a restricted controller messenger
     *
     * The provided allowlists grant the ability to call the listed actions and subscribe to the
     * listed events. The "name" provided grants ownership of any actions and events under that
     * namespace. Ownership allows registering actions and publishing events, as well as
     * unregistering actions and clearing event subscriptions.
     *
     * @param options - The controller options.
     * @param options.controllerMessenger - The controller messenger instance that is being wrapped.
     * @param options.name - The name of the thing this messenger will be handed to (e.g. the
     * controller name). This grants "ownership" of actions and events under this namespace to the
     * restricted controller messenger returned.
     * @param options.allowedActions - The list of actions that this restricted controller messenger
     * should be alowed to call.
     * @param options.allowedEvents - The list of events that this restricted controller messenger
     * should be allowed to subscribe to.
     */
    constructor({ controllerMessenger, name, allowedActions, allowedEvents, }) {
        _RestrictedControllerMessenger_instances.add(this);
        _RestrictedControllerMessenger_controllerMessenger.set(this, void 0);
        _RestrictedControllerMessenger_controllerName.set(this, void 0);
        _RestrictedControllerMessenger_allowedActions.set(this, void 0);
        _RestrictedControllerMessenger_allowedEvents.set(this, void 0);
        __classPrivateFieldSet(this, _RestrictedControllerMessenger_controllerMessenger, controllerMessenger, "f");
        __classPrivateFieldSet(this, _RestrictedControllerMessenger_controllerName, name, "f");
        __classPrivateFieldSet(this, _RestrictedControllerMessenger_allowedActions, allowedActions !== null && allowedActions !== void 0 ? allowedActions : null, "f");
        __classPrivateFieldSet(this, _RestrictedControllerMessenger_allowedEvents, allowedEvents !== null && allowedEvents !== void 0 ? allowedEvents : null, "f");
    }
    /**
     * Register an action handler.
     *
     * This will make the registered function available to call via the `call` method.
     *
     * The action type this handler is registered under *must* be in the current namespace.
     *
     * @param action - The action type. This is a unqiue identifier for this action.
     * @param handler - The action handler. This function gets called when the `call` method is
     * invoked with the given action type.
     * @throws Will throw if an action handler that is not in the current namespace is being registered.
     * @template ActionType - A type union of Action type strings that are namespaced by Namespace.
     */
    registerActionHandler(action, handler) {
        /* istanbul ignore if */ // Branch unreachable with valid types
        if (!__classPrivateFieldGet(this, _RestrictedControllerMessenger_instances, "m", _RestrictedControllerMessenger_isInCurrentNamespace).call(this, action)) {
            throw new Error(`Only allowed registering action handlers prefixed by '${__classPrivateFieldGet(this, _RestrictedControllerMessenger_controllerName, "f")}:'`);
        }
        __classPrivateFieldGet(this, _RestrictedControllerMessenger_controllerMessenger, "f").registerActionHandler(action, handler);
    }
    /**
     * Unregister an action handler.
     *
     * This will prevent this action from being called.
     *
     * The action type being unregistered *must* be in the current namespace.
     *
     * @param action - The action type. This is a unique identifier for this action.
     * @throws Will throw if an action handler that is not in the current namespace is being unregistered.
     * @template ActionType - A type union of Action type strings that are namespaced by Namespace.
     */
    unregisterActionHandler(action) {
        /* istanbul ignore if */ // Branch unreachable with valid types
        if (!__classPrivateFieldGet(this, _RestrictedControllerMessenger_instances, "m", _RestrictedControllerMessenger_isInCurrentNamespace).call(this, action)) {
            throw new Error(`Only allowed unregistering action handlers prefixed by '${__classPrivateFieldGet(this, _RestrictedControllerMessenger_controllerName, "f")}:'`);
        }
        __classPrivateFieldGet(this, _RestrictedControllerMessenger_controllerMessenger, "f").unregisterActionHandler(action);
    }
    /**
     * Call an action.
     *
     * This function will call the action handler corresponding to the given action type, passing
     * along any parameters given.
     *
     * The action type being called must be on the action allowlist.
     *
     * @param actionType - The action type. This is a unqiue identifier for this action.
     * @param params - The action parameters. These must match the type of the parameters of the
     * registered action handler.
     * @throws Will throw when no handler has been registered for the given type.
     * @template ActionType - A type union of allowed Action type strings.
     * @returns The action return value.
     */
    call(actionType, ...params) {
        if (!__classPrivateFieldGet(this, _RestrictedControllerMessenger_instances, "m", _RestrictedControllerMessenger_isAllowedAction).call(this, actionType)) {
            throw new Error(`Action missing from allow list: ${actionType}`);
        }
        const response = __classPrivateFieldGet(this, _RestrictedControllerMessenger_controllerMessenger, "f").call(actionType, ...params);
        return response;
    }
    /**
     * Register a function for getting the initial payload for an event.
     *
     * This is used for events that represent a state change, where the payload is the state.
     * Registering a function for getting the payload allows event selectors to have a point of
     * comparison the first time state changes.
     *
     * The event type *must* be in the current namespace
     *
     * @param args - The arguments to this function
     * @param args.eventType - The event type to register a payload for.
     * @param args.getPayload - A function for retrieving the event payload.
     */
    registerInitialEventPayload({ eventType, getPayload, }) {
        /* istanbul ignore if */ // Branch unreachable with valid types
        if (!__classPrivateFieldGet(this, _RestrictedControllerMessenger_instances, "m", _RestrictedControllerMessenger_isInCurrentNamespace).call(this, eventType)) {
            throw new Error(`Only allowed publishing events prefixed by '${__classPrivateFieldGet(this, _RestrictedControllerMessenger_controllerName, "f")}:'`);
        }
        __classPrivateFieldGet(this, _RestrictedControllerMessenger_controllerMessenger, "f").registerInitialEventPayload({
            eventType,
            getPayload,
        });
    }
    /**
     * Publish an event.
     *
     * Publishes the given payload to all subscribers of the given event type.
     *
     * The event type being published *must* be in the current namespace.
     *
     * @param event - The event type. This is a unique identifier for this event.
     * @param payload - The event payload. The type of the parameters for each event handler must
     * match the type of this payload.
     * @throws Will throw if an event that is not in the current namespace is being published.
     * @template EventType - A type union of Event type strings that are namespaced by Namespace.
     */
    publish(event, ...payload) {
        /* istanbul ignore if */ // Branch unreachable with valid types
        if (!__classPrivateFieldGet(this, _RestrictedControllerMessenger_instances, "m", _RestrictedControllerMessenger_isInCurrentNamespace).call(this, event)) {
            throw new Error(`Only allowed publishing events prefixed by '${__classPrivateFieldGet(this, _RestrictedControllerMessenger_controllerName, "f")}:'`);
        }
        __classPrivateFieldGet(this, _RestrictedControllerMessenger_controllerMessenger, "f").publish(event, ...payload);
    }
    subscribe(event, handler, selector) {
        if (!__classPrivateFieldGet(this, _RestrictedControllerMessenger_instances, "m", _RestrictedControllerMessenger_isAllowedEvent).call(this, event)) {
            throw new Error(`Event missing from allow list: ${event}`);
        }
        if (selector) {
            return __classPrivateFieldGet(this, _RestrictedControllerMessenger_controllerMessenger, "f").subscribe(event, handler, selector);
        }
        return __classPrivateFieldGet(this, _RestrictedControllerMessenger_controllerMessenger, "f").subscribe(event, handler);
    }
    /**
     * Unsubscribe from an event.
     *
     * Unregisters the given function as an event handler for the given event.
     *
     * The event type being unsubscribed to must be on the event allowlist.
     *
     * @param event - The event type. This is a unique identifier for this event.
     * @param handler - The event handler to unregister.
     * @throws Will throw if the given event is not an allowed event for this controller messenger.
     * @template EventType - A type union of allowed Event type strings.
     */
    unsubscribe(event, handler) {
        if (!__classPrivateFieldGet(this, _RestrictedControllerMessenger_instances, "m", _RestrictedControllerMessenger_isAllowedEvent).call(this, event)) {
            throw new Error(`Event missing from allow list: ${event}`);
        }
        __classPrivateFieldGet(this, _RestrictedControllerMessenger_controllerMessenger, "f").unsubscribe(event, handler);
    }
    /**
     * Clear subscriptions for a specific event.
     *
     * This will remove all subscribed handlers for this event.
     *
     * The event type being cleared *must* be in the current namespace.
     *
     * @param event - The event type. This is a unique identifier for this event.
     * @throws Will throw if a subscription for an event that is not in the current namespace is being cleared.
     * @template EventType - A type union of Event type strings that are namespaced by Namespace.
     */
    clearEventSubscriptions(event) {
        if (!__classPrivateFieldGet(this, _RestrictedControllerMessenger_instances, "m", _RestrictedControllerMessenger_isInCurrentNamespace).call(this, event)) {
            throw new Error(`Only allowed clearing events prefixed by '${__classPrivateFieldGet(this, _RestrictedControllerMessenger_controllerName, "f")}:'`);
        }
        __classPrivateFieldGet(this, _RestrictedControllerMessenger_controllerMessenger, "f").clearEventSubscriptions(event);
    }
}
exports.RestrictedControllerMessenger = RestrictedControllerMessenger;
_RestrictedControllerMessenger_controllerMessenger = new WeakMap(), _RestrictedControllerMessenger_controllerName = new WeakMap(), _RestrictedControllerMessenger_allowedActions = new WeakMap(), _RestrictedControllerMessenger_allowedEvents = new WeakMap(), _RestrictedControllerMessenger_instances = new WeakSet(), _RestrictedControllerMessenger_isAllowedEvent = function _RestrictedControllerMessenger_isAllowedEvent(eventType) {
    // Safely upcast to allow runtime check
    const allowedEvents = __classPrivateFieldGet(this, _RestrictedControllerMessenger_allowedEvents, "f");
    return (__classPrivateFieldGet(this, _RestrictedControllerMessenger_instances, "m", _RestrictedControllerMessenger_isInCurrentNamespace).call(this, eventType) ||
        (allowedEvents !== null && allowedEvents.includes(eventType)));
}, _RestrictedControllerMessenger_isAllowedAction = function _RestrictedControllerMessenger_isAllowedAction(actionType) {
    // Safely upcast to allow runtime check
    const allowedActions = __classPrivateFieldGet(this, _RestrictedControllerMessenger_allowedActions, "f");
    return (__classPrivateFieldGet(this, _RestrictedControllerMessenger_instances, "m", _RestrictedControllerMessenger_isInCurrentNamespace).call(this, actionType) ||
        (allowedActions !== null && allowedActions.includes(actionType)));
}, _RestrictedControllerMessenger_isInCurrentNamespace = function _RestrictedControllerMessenger_isInCurrentNamespace(name) {
    return name.startsWith(`${__classPrivateFieldGet(this, _RestrictedControllerMessenger_controllerName, "f")}:`);
};
//# sourceMappingURL=RestrictedControllerMessenger.js.map