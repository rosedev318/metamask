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
var _SelectedNetworkController_instances, _SelectedNetworkController_proxies, _SelectedNetworkController_getUseRequestQueue, _SelectedNetworkController_registerMessageHandlers, _SelectedNetworkController_setNetworkClientIdForDomain, _SelectedNetworkController_domainHasPermissions;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectedNetworkController = exports.SelectedNetworkControllerEventTypes = exports.SelectedNetworkControllerActionTypes = exports.METAMASK_DOMAIN = exports.controllerName = void 0;
const base_controller_1 = require("@metamask/base-controller");
const swappable_obj_proxy_1 = require("@metamask/swappable-obj-proxy");
exports.controllerName = 'SelectedNetworkController';
const stateMetadata = {
    domains: { persist: true, anonymous: false },
};
const getDefaultState = () => ({ domains: {} });
exports.METAMASK_DOMAIN = 'metamask';
exports.SelectedNetworkControllerActionTypes = {
    getState: `${exports.controllerName}:getState`,
    getNetworkClientIdForDomain: `${exports.controllerName}:getNetworkClientIdForDomain`,
    setNetworkClientIdForDomain: `${exports.controllerName}:setNetworkClientIdForDomain`,
};
exports.SelectedNetworkControllerEventTypes = {
    stateChange: `${exports.controllerName}:stateChange`,
};
/**
 * Controller for getting and setting the network for a particular domain.
 */
class SelectedNetworkController extends base_controller_1.BaseController {
    /**
     * Construct a SelectedNetworkController controller.
     *
     * @param options - The controller options.
     * @param options.messenger - The restricted controller messenger for the EncryptionPublicKey controller.
     * @param options.state - The controllers initial state.
     * @param options.getUseRequestQueue - feature flag for perDappNetwork & request queueing features
     */
    constructor({ messenger, state = getDefaultState(), getUseRequestQueue, }) {
        super({
            name: exports.controllerName,
            metadata: stateMetadata,
            messenger,
            state,
        });
        _SelectedNetworkController_instances.add(this);
        _SelectedNetworkController_proxies.set(this, new Map());
        _SelectedNetworkController_getUseRequestQueue.set(this, void 0);
        __classPrivateFieldSet(this, _SelectedNetworkController_getUseRequestQueue, getUseRequestQueue, "f");
        __classPrivateFieldGet(this, _SelectedNetworkController_instances, "m", _SelectedNetworkController_registerMessageHandlers).call(this);
        // this is fetching all the dapp permissions from the PermissionsController and looking for any domains that are not in domains state in this controller. Then we take any missing domains and add them to state here, setting it with the globally selected networkClientId (fetched from the NetworkController)
        this.messagingSystem
            .call('PermissionController:getSubjectNames')
            .filter((domain) => this.state.domains[domain] === undefined)
            .forEach((domain) => this.setNetworkClientIdForDomain(domain, this.messagingSystem.call('NetworkController:getState')
            .selectedNetworkClientId));
        this.messagingSystem.subscribe('PermissionController:stateChange', (_, patches) => {
            patches.forEach(({ op, path }) => {
                const isChangingSubject = path[0] === 'subjects' && path[1] !== undefined;
                if (isChangingSubject && typeof path[1] === 'string') {
                    const domain = path[1];
                    if (op === 'add' && this.state.domains[domain] === undefined) {
                        this.setNetworkClientIdForDomain(domain, this.messagingSystem.call('NetworkController:getState')
                            .selectedNetworkClientId);
                    }
                    else if (op === 'remove' &&
                        this.state.domains[domain] !== undefined) {
                        this.update(({ domains }) => {
                            delete domains[domain];
                        });
                    }
                }
            });
        });
        this.messagingSystem.subscribe('NetworkController:stateChange', ({ selectedNetworkClientId }, patches) => {
            patches.forEach(({ op, path }) => {
                // if a network is removed, update the networkClientId for all domains that were using it to the selected network
                if (op === 'remove' && path[0] === 'networkConfigurations') {
                    const removedNetworkClientId = path[1];
                    Object.entries(this.state.domains).forEach(([domain, networkClientIdForDomain]) => {
                        if (networkClientIdForDomain === removedNetworkClientId) {
                            this.setNetworkClientIdForDomain(domain, selectedNetworkClientId);
                        }
                    });
                }
            });
        });
    }
    setNetworkClientIdForDomain(domain, networkClientId) {
        if (domain === exports.METAMASK_DOMAIN) {
            throw new Error(`NetworkClientId for domain "${exports.METAMASK_DOMAIN}" cannot be set on the SelectedNetworkController`);
        }
        if (!__classPrivateFieldGet(this, _SelectedNetworkController_instances, "m", _SelectedNetworkController_domainHasPermissions).call(this, domain)) {
            throw new Error('NetworkClientId for domain cannot be called with a domain that has not yet been granted permissions');
        }
        __classPrivateFieldGet(this, _SelectedNetworkController_instances, "m", _SelectedNetworkController_setNetworkClientIdForDomain).call(this, domain, networkClientId);
    }
    getNetworkClientIdForDomain(domain) {
        var _a;
        const { selectedNetworkClientId: metamaskSelectedNetworkClientId } = this.messagingSystem.call('NetworkController:getState');
        if (!__classPrivateFieldGet(this, _SelectedNetworkController_getUseRequestQueue, "f").call(this)) {
            return metamaskSelectedNetworkClientId;
        }
        return (_a = this.state.domains[domain]) !== null && _a !== void 0 ? _a : metamaskSelectedNetworkClientId;
    }
    /**
     * Accesses the provider and block tracker for the currently selected network.
     *
     * @param domain - the domain for the provider
     * @returns The proxy and block tracker proxies.
     */
    getProviderAndBlockTracker(domain) {
        if (!__classPrivateFieldGet(this, _SelectedNetworkController_getUseRequestQueue, "f").call(this)) {
            throw new Error('Provider and BlockTracker should be fetched from NetworkController when useRequestQueue is false');
        }
        const networkClientId = this.state.domains[domain];
        if (!networkClientId) {
            throw new Error('NetworkClientId has not been set for the requested domain');
        }
        let networkProxy = __classPrivateFieldGet(this, _SelectedNetworkController_proxies, "f").get(domain);
        if (networkProxy === undefined) {
            const networkClient = this.messagingSystem.call('NetworkController:getNetworkClientById', networkClientId);
            networkProxy = {
                provider: (0, swappable_obj_proxy_1.createEventEmitterProxy)(networkClient.provider),
                blockTracker: (0, swappable_obj_proxy_1.createEventEmitterProxy)(networkClient.blockTracker, {
                    eventFilter: 'skipInternal',
                }),
            };
            __classPrivateFieldGet(this, _SelectedNetworkController_proxies, "f").set(domain, networkProxy);
        }
        return networkProxy;
    }
}
exports.SelectedNetworkController = SelectedNetworkController;
_SelectedNetworkController_proxies = new WeakMap(), _SelectedNetworkController_getUseRequestQueue = new WeakMap(), _SelectedNetworkController_instances = new WeakSet(), _SelectedNetworkController_registerMessageHandlers = function _SelectedNetworkController_registerMessageHandlers() {
    this.messagingSystem.registerActionHandler(exports.SelectedNetworkControllerActionTypes.getNetworkClientIdForDomain, this.getNetworkClientIdForDomain.bind(this));
    this.messagingSystem.registerActionHandler(exports.SelectedNetworkControllerActionTypes.setNetworkClientIdForDomain, this.setNetworkClientIdForDomain.bind(this));
}, _SelectedNetworkController_setNetworkClientIdForDomain = function _SelectedNetworkController_setNetworkClientIdForDomain(domain, networkClientId) {
    const networkClient = this.messagingSystem.call('NetworkController:getNetworkClientById', networkClientId);
    const networkProxy = __classPrivateFieldGet(this, _SelectedNetworkController_proxies, "f").get(domain);
    if (networkProxy === undefined) {
        __classPrivateFieldGet(this, _SelectedNetworkController_proxies, "f").set(domain, {
            provider: (0, swappable_obj_proxy_1.createEventEmitterProxy)(networkClient.provider),
            blockTracker: (0, swappable_obj_proxy_1.createEventEmitterProxy)(networkClient.blockTracker, {
                eventFilter: 'skipInternal',
            }),
        });
    }
    else {
        networkProxy.provider.setTarget(networkClient.provider);
        networkProxy.blockTracker.setTarget(networkClient.blockTracker);
    }
    this.update((state) => {
        state.domains[domain] = networkClientId;
    });
}, _SelectedNetworkController_domainHasPermissions = function _SelectedNetworkController_domainHasPermissions(domain) {
    return this.messagingSystem.call('PermissionController:hasPermissions', domain);
};
//# sourceMappingURL=SelectedNetworkController.js.map