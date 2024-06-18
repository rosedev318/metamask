import type { RestrictedControllerMessenger } from '@metamask/base-controller';
import { BaseController } from '@metamask/base-controller';
import type { BlockTrackerProxy, NetworkClientId, NetworkControllerGetNetworkClientByIdAction, NetworkControllerGetStateAction, NetworkControllerStateChangeEvent, ProviderProxy } from '@metamask/network-controller';
import type { PermissionControllerStateChange, GetSubjects as PermissionControllerGetSubjectsAction, HasPermissions as PermissionControllerHasPermissions } from '@metamask/permission-controller';
import type { Patch } from 'immer';
export declare const controllerName = "SelectedNetworkController";
declare type Domain = string;
export declare const METAMASK_DOMAIN: "metamask";
export declare const SelectedNetworkControllerActionTypes: {
    getState: "SelectedNetworkController:getState";
    getNetworkClientIdForDomain: "SelectedNetworkController:getNetworkClientIdForDomain";
    setNetworkClientIdForDomain: "SelectedNetworkController:setNetworkClientIdForDomain";
};
export declare const SelectedNetworkControllerEventTypes: {
    stateChange: "SelectedNetworkController:stateChange";
};
export declare type SelectedNetworkControllerState = {
    domains: Record<Domain, NetworkClientId>;
};
export declare type SelectedNetworkControllerStateChangeEvent = {
    type: typeof SelectedNetworkControllerEventTypes.stateChange;
    payload: [SelectedNetworkControllerState, Patch[]];
};
export declare type SelectedNetworkControllerGetSelectedNetworkStateAction = {
    type: typeof SelectedNetworkControllerActionTypes.getState;
    handler: () => SelectedNetworkControllerState;
};
export declare type SelectedNetworkControllerGetNetworkClientIdForDomainAction = {
    type: typeof SelectedNetworkControllerActionTypes.getNetworkClientIdForDomain;
    handler: SelectedNetworkController['getNetworkClientIdForDomain'];
};
export declare type SelectedNetworkControllerSetNetworkClientIdForDomainAction = {
    type: typeof SelectedNetworkControllerActionTypes.setNetworkClientIdForDomain;
    handler: SelectedNetworkController['setNetworkClientIdForDomain'];
};
export declare type SelectedNetworkControllerActions = SelectedNetworkControllerGetSelectedNetworkStateAction | SelectedNetworkControllerGetNetworkClientIdForDomainAction | SelectedNetworkControllerSetNetworkClientIdForDomainAction;
export declare type AllowedActions = NetworkControllerGetNetworkClientByIdAction | NetworkControllerGetStateAction | PermissionControllerHasPermissions | PermissionControllerGetSubjectsAction;
export declare type SelectedNetworkControllerEvents = SelectedNetworkControllerStateChangeEvent;
export declare type AllowedEvents = NetworkControllerStateChangeEvent | PermissionControllerStateChange;
export declare type SelectedNetworkControllerMessenger = RestrictedControllerMessenger<typeof controllerName, SelectedNetworkControllerActions | AllowedActions, SelectedNetworkControllerEvents | AllowedEvents, AllowedActions['type'], AllowedEvents['type']>;
export declare type GetUseRequestQueue = () => boolean;
export declare type SelectedNetworkControllerOptions = {
    state?: SelectedNetworkControllerState;
    messenger: SelectedNetworkControllerMessenger;
    getUseRequestQueue: GetUseRequestQueue;
};
export declare type NetworkProxy = {
    provider: ProviderProxy;
    blockTracker: BlockTrackerProxy;
};
/**
 * Controller for getting and setting the network for a particular domain.
 */
export declare class SelectedNetworkController extends BaseController<typeof controllerName, SelectedNetworkControllerState, SelectedNetworkControllerMessenger> {
    #private;
    /**
     * Construct a SelectedNetworkController controller.
     *
     * @param options - The controller options.
     * @param options.messenger - The restricted controller messenger for the EncryptionPublicKey controller.
     * @param options.state - The controllers initial state.
     * @param options.getUseRequestQueue - feature flag for perDappNetwork & request queueing features
     */
    constructor({ messenger, state, getUseRequestQueue, }: SelectedNetworkControllerOptions);
    setNetworkClientIdForDomain(domain: Domain, networkClientId: NetworkClientId): void;
    getNetworkClientIdForDomain(domain: Domain): NetworkClientId;
    /**
     * Accesses the provider and block tracker for the currently selected network.
     *
     * @param domain - the domain for the provider
     * @returns The proxy and block tracker proxies.
     */
    getProviderAndBlockTracker(domain: Domain): NetworkProxy;
}
export {};
//# sourceMappingURL=SelectedNetworkController.d.ts.map