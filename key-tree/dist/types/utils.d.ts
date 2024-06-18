import type { BIP32Node, ChangeHDPathString, CoinTypeHDPathString, CoinTypeToAddressTuple, HardenedBIP32Node, UnhardenedBIP32Node, UnprefixedNode } from './constants';
import type { SupportedCurve } from './curves';
/**
 * Gets a string representation of a BIP-44 path of depth 2, i.e.:
 * `m / 44' / coin_type'`
 *
 * For display purposes only.
 *
 * @param coin_type - The `coin_type` index to create a path visualization for.
 * @returns The visualization of the BIP-44 path for thte specified `coin_type`.
 */
export declare function getBIP44CoinTypePathString(coin_type: number): CoinTypeHDPathString;
declare type BIP44PathIndex = number | {
    index: number;
    hardened: boolean;
};
declare type BIP44PathIndices = {
    coin_type: number;
    account?: number;
    change?: BIP44PathIndex;
    address_index: BIP44PathIndex;
};
export declare type CoinTypeToAddressIndices = Pick<BIP44PathIndices, 'account' | 'change' | 'address_index'>;
/**
 * Gets a string representation of a BIP-44 path of depth 4, i.e.:
 * `m / 44' / coin_type' / account' / change`
 *
 * For display purposes only.
 *
 * @param coinTypePath - The parent `coin_type` path.
 * @param indices - The `account` and `change` index to create a path visualization for.
 * @returns The visualization of the BIP-44 path for the specified `coin_type`
 * and `change` indices.
 */
export declare function getBIP44ChangePathString(coinTypePath: CoinTypeHDPathString, indices: Omit<CoinTypeToAddressIndices, 'address_index'>): ChangeHDPathString;
/**
 * Gets a BIP-44 path tuple of the form `account' / change / address_index`,
 * which can be used to derive address keys together with a `coin_type` key.
 *
 * @param indices - The BIP-44 derivation index values.
 * @param indices.account - The `account` index value.
 * @param indices.change - The `change` index value.
 * @param indices.address_index - The `address_index` index value.
 * @returns The `account' / change / address_index` path corresponding to the
 * specified indices.
 */
export declare function getBIP44CoinTypeToAddressPathTuple({ account, change, address_index, }: CoinTypeToAddressIndices): CoinTypeToAddressTuple;
/**
 * A hardened BIP-32 node token, e.g. `bip32:0'`.
 * Validates that the index is a non-negative integer number, and throws an
 * error if validation fails.
 *
 * @param index - The index of the node.
 * @returns The hardened BIP-32 node token.
 */
export declare function getHardenedBIP32NodeToken(index: number): HardenedBIP32Node;
/**
 * An unhardened BIP-32 node token, e.g. `bip32:0`.
 * Validates that the index is a non-negative integer number, and throws an
 * error if validation fails.
 *
 * @param index - The index of the node.
 * @returns The unhardened BIP-32 node token.
 */
export declare function getUnhardenedBIP32NodeToken(index: number): UnhardenedBIP32Node;
/**
 * A hardened or unhardened BIP-32 node token, e.g. `bip32:0` or `bip32:0'`.
 * Validates that the index is a non-negative integer number, and throws an
 * error if validation fails.
 *
 * @param index - The index of the node.
 * @returns The hardened or unhardened BIP-32 node token.
 */
export declare function getBIP32NodeToken(index: BIP44PathIndex): BIP32Node;
/**
 * Validates that the index is a non-negative integer number. Throws an
 * error if validation fails.
 *
 * @param addressIndex - The index to validate.
 */
export declare function validateBIP32Index(addressIndex: number): void;
/**
 * Check if the index is a valid BIP-32 index.
 *
 * @param index - The BIP-32 index to test.
 * @returns Whether the index is a non-negative integer number.
 */
export declare function isValidBIP32Index(index: number): boolean;
/**
 * Check if the value is a valid BIP-32 path segment, i.e., a string of the form
 * `0'`.
 *
 * @param segment - The BIP-32 path segment to test.
 * @returns Whether the path segment is a valid BIP-32 path segment.
 */
export declare function isValidBIP32PathSegment(segment: string): segment is UnprefixedNode;
/**
 * Check if the value is a hardened BIP-32 index. This only checks if the value
 * ends with a `'` character, and does not validate that the index is a valid
 * BIP-32 index.
 *
 * @param bip32Token - The token to test.
 * @returns Whether the token is hardened, i.e. ends with `'`.
 */
export declare function isHardened(bip32Token: string): boolean;
/**
 * Get a `Uint8Array` from a hexadecimal string or a `Uint8Array`. If the input
 * is a hexadecimal string, it is converted to a `Uint8Array`. If the input is
 * a `Uint8Array`, it is returned as-is.
 *
 * @param hexString - The hexadecimal string to convert.
 * @returns The `Uint8Array` corresponding to the hexadecimal string.
 */
export declare function hexStringToBytes(hexString: string | Uint8Array): Uint8Array;
/**
 * The same as {@link hexStringToBytes}, but returns `undefined` if the input
 * is `undefined`.
 *
 * @param hexString - The hexadecimal string to convert.
 * @returns The `Uint8Array` corresponding to the hexadecimal string.
 */
export declare function nullableHexStringToBytes(hexString?: string | Uint8Array): Uint8Array | undefined;
/**
 * Tests whether the specified `Uint8Array` is a valid BIP-32 key.
 * A valid bytes key is 64 bytes long and has at least one non-zero byte.
 *
 * @param bytes - The `Uint8Array` to test.
 * @param expectedLength - The expected length of the Uint8Array.
 * @returns Whether the Uint8Array represents a valid BIP-32 key.
 */
export declare function isValidBytesKey(bytes: Uint8Array, expectedLength: number): boolean;
/**
 * Tests whether the specified number is a valid integer equal to or greater than 0.
 *
 * @param value - The number to test.
 * @returns Whether the number is a valid integer.
 */
export declare function isValidInteger(value: unknown): value is number;
/**
 * Get a `Uint8Array` from a hexadecimal string or `Uint8Array`. Validates that the
 * length of the `Uint8Array` matches the specified length, and that the `Uint8Array`
 * is not empty.
 *
 * @param value - The value to convert to a `Uint8Array`.
 * @param length - The length to validate the `Uint8Array` against.
 * @returns The `Uint8Array` corresponding to the hexadecimal string.
 */
export declare function getBytes(value: unknown, length: number): Uint8Array;
/**
 * Get a `Uint8Array` from a hexadecimal string or `Uint8Array`. Validates that
 * the length of the `Uint8Array` matches the specified length.
 *
 * This function is "unsafe," in the sense that it does not validate that the
 * `Uint8Array` is not empty (i.e., all bytes are zero).
 *
 * @param value - The value to convert to a `Uint8Array`.
 * @param length - The length to validate the `Uint8Array` against.
 * @returns The `Uint8Array` corresponding to the hexadecimal string.
 */
export declare function getBytesUnsafe(value: unknown, length: number): Uint8Array;
export declare const decodeBase58check: (value: string) => Uint8Array;
export declare const encodeBase58check: (value: Uint8Array) => string;
/**
 * Get the fingerprint of a compressed public key as number.
 *
 * @param publicKey - The compressed public key to get the fingerprint for.
 * @returns The fingerprint of the public key.
 */
export declare const getFingerprint: (publicKey: Uint8Array) => number;
/**
 * Get a secret recovery phrase (or mnemonic phrase) in string form as a
 * `Uint8Array`. The secret recovery phrase is split into words, and each word
 * is converted to a number using the BIP-39 word list. The numbers are then
 * converted to bytes, and the bytes are concatenated into a single
 * `Uint8Array`.
 *
 * @param mnemonicPhrase - The secret recovery phrase to convert.
 * @returns The `Uint8Array` corresponding to the secret recovery phrase.
 */
export declare function mnemonicPhraseToBytes(mnemonicPhrase: string): Uint8Array;
/**
 * Validates the curve name.
 *
 * @param curveName - The name of the curve to validate.
 */
export declare function validateCurve(curveName: unknown): asserts curveName is SupportedCurve;
/**
 * Get a 4-byte-long `Uint8Array` from a numeric value.
 *
 * @param value - The value to convert to a `Uint8Array`.
 * @returns The `Uint8Array` corresponding to the `bigint` value.
 */
export declare function numberToUint32(value: number): Uint8Array;
export {};
//# sourceMappingURL=utils.d.ts.map