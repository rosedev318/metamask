import type { Json } from '@metamask/utils';
import type { Struct } from 'superstruct';
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
/**
 * Remove duplicate entries from an array.
 *
 * @param array - Array to remove duplicates from.
 * @returns Array with duplicates removed.
 */
export declare function unique<Type>(array: Type[] | Iterable<Type>): Type[];
/**
 * Convert a value to a valid JSON object.
 *
 * The function chains JSON.stringify and JSON.parse to ensure that the result
 * is a valid JSON object. In objects, undefined values are removed, and in
 * arrays, they are replaced with null.
 *
 * @param value - Value to convert to JSON.
 * @returns JSON representation of the value.
 */
export declare function toJson<Type extends Json = Json>(value: any): Type;
/**
 * Asserts that the given value is defined.
 *
 * @param value - Value to check.
 */
export declare function ensureDefined<Type>(value: Type | undefined): asserts value is Type;
/**
 * Helper function that throws an error.
 *
 * @param message - Error message to throw.
 */
export declare function throwError(message: string): never;
/**
 * Compares two strings for equality, ignoring case.
 *
 * @param a - The first string to compare.
 * @param b - The second string to compare.
 * @returns `true` if the strings are equal, ignoring case. `false` otherwise.
 */
export declare function equalsIgnoreCase(a: string, b: string): boolean;
