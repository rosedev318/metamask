import type { Component, Input, InterfaceState } from '@metamask/snaps-sdk';
/**
 * Construct the state for a stray input (not enclosed in a form).
 *
 * @param state - The interface state.
 * @param component - The Input component.
 * @returns The input state.
 */
export declare const constructInputState: (state: InterfaceState, component: Input) => string | Record<string, string | null> | null;
/**
 * Construct the state for a form input.
 *
 * Sets the state to either the specified component value, the previous value from the old state or null.
 *
 * @param state - The interface state.
 * @param component - The Input component.
 * @param form - The parent form name of the input.
 * @returns The input state.
 */
export declare const constructFormInputState: (state: InterfaceState, component: Input, form: string) => string | null;
/**
 * Assert that the component name is unique in state.
 *
 * @param state - The interface state to verify against.
 * @param name - The component name to verify.
 */
export declare const assertNameIsUnique: (state: InterfaceState, name: string) => void;
/**
 * Construct the interface state for a given component tree while preserving values for matching stateful components in the old state.
 *
 * @param oldState - The previous state.
 * @param component - The UI component to construct state from.
 * @param newState - The state that is being constructed.
 * @returns The interface state of the passed component.
 */
export declare const constructState: (oldState: InterfaceState, component: Component, newState?: InterfaceState) => InterfaceState;
