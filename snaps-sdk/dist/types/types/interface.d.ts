import type { Infer } from 'superstruct';
/**
 * To avoid typing problems with the interface state when manipulating it we have to differentiate the state of
 * a form (that will be contained inside the root state) and the root state since a key in the root stat can contain
 * either the value of an input or a sub-state of a form.
 */
export declare const FormStateStruct: import("superstruct").Struct<Record<string, string | null>, null>;
export declare const InterfaceStateStruct: import("superstruct").Struct<Record<string, string | Record<string, string | null> | null>, null>;
export declare type FormState = Infer<typeof FormStateStruct>;
export declare type InterfaceState = Infer<typeof InterfaceStateStruct>;
