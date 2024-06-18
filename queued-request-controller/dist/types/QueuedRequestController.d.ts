import type { ControllerGetStateAction, ControllerStateChangeEvent, RestrictedControllerMessenger } from '@metamask/base-controller';
import { BaseController } from '@metamask/base-controller';
import type { NetworkControllerGetStateAction, NetworkControllerSetActiveNetworkAction } from '@metamask/network-controller';
import type { SelectedNetworkControllerGetNetworkClientIdForDomainAction } from '@metamask/selected-network-controller';
import type { QueuedRequestMiddlewareJsonRpcRequest } from './types';
export declare const controllerName = "QueuedRequestController";
export declare type QueuedRequestControllerState = {
    queuedRequestCount: number;
};
export declare const QueuedRequestControllerActionTypes: {
    enqueueRequest: "QueuedRequestController:enqueueRequest";
    getState: "QueuedRequestController:getState";
};
export declare type QueuedRequestControllerGetStateAction = ControllerGetStateAction<typeof controllerName, QueuedRequestControllerState>;
export declare type QueuedRequestControllerEnqueueRequestAction = {
    type: typeof QueuedRequestControllerActionTypes.enqueueRequest;
    handler: QueuedRequestController['enqueueRequest'];
};
export declare const QueuedRequestControllerEventTypes: {
    networkSwitched: "QueuedRequestController:networkSwitched";
    stateChange: "QueuedRequestController:stateChange";
};
export declare type QueuedRequestControllerStateChangeEvent = ControllerStateChangeEvent<typeof controllerName, QueuedRequestControllerState>;
export declare type QueuedRequestControllerNetworkSwitched = {
    type: typeof QueuedRequestControllerEventTypes.networkSwitched;
    payload: [string];
};
export declare type QueuedRequestControllerEvents = QueuedRequestControllerStateChangeEvent | QueuedRequestControllerNetworkSwitched;
export declare type QueuedRequestControllerActions = QueuedRequestControllerGetStateAction | QueuedRequestControllerEnqueueRequestAction;
export declare type AllowedActions = NetworkControllerGetStateAction | NetworkControllerSetActiveNetworkAction | SelectedNetworkControllerGetNetworkClientIdForDomainAction;
export declare type QueuedRequestControllerMessenger = RestrictedControllerMessenger<typeof controllerName, QueuedRequestControllerActions | AllowedActions, QueuedRequestControllerEvents, AllowedActions['type'], never>;
export declare type QueuedRequestControllerOptions = {
    messenger: QueuedRequestControllerMessenger;
};
/**
 * Queue requests for processing in batches, by request origin.
 *
 * Processing requests in batches allows us to completely separate sets of requests that originate
 * from different origins. This ensures that our UI will not display those requests as a set, which
 * could mislead users into thinking they are related.
 *
 * Queuing requests in batches also allows us to ensure the globally selected network matches the
 * dapp-selected network, before the confirmation UI is rendered. This is important because the
 * data shown on some confirmation screens is only collected for the globally selected network.
 *
 * Requests get processed in order of insertion, even across batches. All requests get processed
 * even in the event of preceding requests failing.
 */
export declare class QueuedRequestController extends BaseController<typeof controllerName, QueuedRequestControllerState, QueuedRequestControllerMessenger> {
    #private;
    /**
     * Construct a QueuedRequestController.
     *
     * @param options - Controller options.
     * @param options.messenger - The restricted controller messenger that facilitates communication with other controllers.
     */
    constructor({ messenger }: QueuedRequestControllerOptions);
    /**
     * Enqueue a request to be processed in a batch with other requests from the same origin.
     *
     * We process requests one origin at a time, so that requests from different origins do not get
     * interwoven, and so that we can ensure that the globally selected network matches the dapp-
     * selected network.
     *
     * Requests get processed in order of insertion, even across origins/batches. All requests get
     * processed even in the event of preceding requests failing.
     *
     * @param request - The JSON-RPC request to process.
     * @param requestNext - A function representing the next steps for processing this request.
     * @returns A promise that resolves when the given request has been fully processed.
     */
    enqueueRequest(request: QueuedRequestMiddlewareJsonRpcRequest, requestNext: () => Promise<void>): Promise<void>;
}
//# sourceMappingURL=QueuedRequestController.d.ts.map