import type { Struct } from 'superstruct';
/**
 * UUIDv4 struct.
 */
export declare const UuidStruct: Struct<string, null>;
/**
 * Omit keys from a union type.
 *
 * The normal `Omit` type does not distribute over unions. So we use this
 * workaround that applies `Omit` to each member of the union.
 *
 * See: <https://github.com/microsoft/TypeScript/issues/31501#issuecomment-1280579305>
 */
export declare type OmitUnion<Type, Key extends keyof any> = Type extends any ? Omit<Type, Key> : never;
/**
 * Assert that a value is valid according to a struct.
 *
 * It is similar to superstruct's mask function, but it does not ignore extra
 * properties.
 *
 * @param value - Value to check.
 * @param struct - Struct to validate the value against.
 * @param message - Error message to throw if the value is not valid.
 * @returns The value if it is valid.
 */
export declare function strictMask<Type, Schema>(value: unknown, struct: Struct<Type, Schema>, message?: string): Type;
