import type { ControllerGetStateAction, ControllerStateChangeEvent, RestrictedControllerMessenger } from '@metamask/base-controller';
import { BaseController } from '@metamask/base-controller';
import type { NameProvider } from './types';
import { NameType } from './types';
export declare const FALLBACK_VARIATION = "*";
/**
 * Enumerates the possible origins responsible for setting a petname.
 */
export declare enum NameOrigin {
    ACCOUNT_IDENTITY = "account-identity",
    ADDRESS_BOOK = "address-book",
    API = "api",
    UI = "ui"
}
declare const controllerName = "NameController";
export declare type ProposedNamesEntry = {
    proposedNames: string[];
    lastRequestTime: number | null;
    updateDelay: number | null;
};
export declare type NameEntry = {
    name: string | null;
    sourceId: string | null;
    origin: NameOrigin | null;
    proposedNames: Record<string, ProposedNamesEntry>;
};
export declare type SourceEntry = {
    label: string;
};
export declare type NameControllerState = {
    names: Record<NameType, Record<string, Record<string, NameEntry>>>;
    nameSources: Record<string, SourceEntry>;
};
export declare type GetNameState = ControllerGetStateAction<typeof controllerName, NameControllerState>;
export declare type NameStateChange = ControllerStateChangeEvent<typeof controllerName, NameControllerState>;
export declare type NameControllerActions = GetNameState;
export declare type NameControllerEvents = NameStateChange;
export declare type NameControllerMessenger = RestrictedControllerMessenger<typeof controllerName, NameControllerActions, NameControllerEvents, never, never>;
export declare type NameControllerOptions = {
    messenger: NameControllerMessenger;
    providers: NameProvider[];
    state?: Partial<NameControllerState>;
    updateDelay?: number;
};
export declare type UpdateProposedNamesRequest = {
    value: string;
    type: NameType;
    sourceIds?: string[];
    onlyUpdateAfterDelay?: boolean;
    variation?: string;
};
export declare type UpdateProposedNamesResult = {
    results: Record<string, {
        proposedNames?: string[];
        error?: unknown;
    }>;
};
export declare type SetNameRequest = {
    value: string;
    type: NameType;
    name: string | null;
    sourceId?: string;
    variation?: string;
    origin?: NameOrigin;
};
/**
 * Controller for storing and deriving names for values such as Ethereum addresses.
 */
export declare class NameController extends BaseController<typeof controllerName, NameControllerState, NameControllerMessenger> {
    #private;
    /**
     * Construct a Name controller.
     *
     * @param options - Controller options.
     * @param options.messenger - Restricted controller messenger for the name controller.
     * @param options.providers - Array of name provider instances to propose names.
     * @param options.state - Initial state to set on the controller.
     * @param options.updateDelay - The delay in seconds before a new request to a source should be made.
     */
    constructor({ messenger, providers, state, updateDelay, }: NameControllerOptions);
    /**
     * Set the user specified name for a value.
     *
     * @param request - Request object.
     * @param request.name - Name to set.
     * @param request.sourceId - Optional ID of the source of the proposed name.
     * @param request.type - Type of value to set the name for.
     * @param request.value - Value to set the name for.
     * @param request.variation - Variation of the raw value to set the name for. The chain ID if the type is Ethereum address.
     */
    setName(request: SetNameRequest): void;
    /**
     * Generate the proposed names for a value using the name providers and store them in the state.
     *
     * @param request - Request object.
     * @param request.value - Value to update the proposed names for.
     * @param request.type - Type of value to update the proposed names for.
     * @param request.sourceIds - Optional array of source IDs to limit which sources are used by the providers. If not provided, all sources in all providers will be used.
     * @param request.variation - Variation of the raw value to update proposed names for. The chain ID if the type is Ethereum address.
     * @returns The updated proposed names for the value.
     */
    updateProposedNames(request: UpdateProposedNamesRequest): Promise<UpdateProposedNamesResult>;
}
export {};
//# sourceMappingURL=NameController.d.ts.map