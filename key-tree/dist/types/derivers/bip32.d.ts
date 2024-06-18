import type { DeriveChildKeyArgs } from '.';
import type { SLIP10Node } from '../SLIP10Node';
/**
 * Converts a BIP-32 private key to an Ethereum address.
 *
 * **WARNING:** Only validates that the key is non-zero and of the correct
 * length. It is the consumer's responsibility to ensure that the specified
 * key is a valid BIP-44 Ethereum `address_index` key.
 *
 * @param key - The `address_index` private key bytes to convert to an Ethereum
 * address.
 * @returns The Ethereum address corresponding to the given key.
 */
export declare function privateKeyToEthAddress(key: Uint8Array): Uint8Array;
/**
 * Converts a BIP-32 public key to an Ethereum address.
 *
 * **WARNING:** Only validates that the key is non-zero and of the correct
 * length. It is the consumer's responsibility to ensure that the specified
 * key is a valid BIP-44 Ethereum `address_index` key.
 *
 * @param key - The `address_index` public key bytes to convert to an Ethereum
 * address.
 * @returns The Ethereum address corresponding to the given key.
 */
export declare function publicKeyToEthAddress(key: Uint8Array): Uint8Array;
/**
 * Derive a BIP-32 child key with a given path from a parent key.
 *
 * @param options - The options for deriving a child key.
 * @param options.path - The derivation path part to derive.
 * @param options.node - The node to derive from.
 * @param options.curve - The curve to use for derivation.
 * @returns The derived child key as a {@link SLIP10Node}.
 */
export declare function deriveChildKey(options: DeriveChildKeyArgs): Promise<SLIP10Node>;
//# sourceMappingURL=bip32.d.ts.map