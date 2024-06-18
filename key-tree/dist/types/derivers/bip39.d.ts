import type { DeriveChildKeyArgs } from '.';
import type { BIP39StringNode } from '../constants';
import type { Curve } from '../curves';
import { SLIP10Node } from '../SLIP10Node';
/**
 * Convert a BIP-39 mnemonic phrase to a multi path.
 *
 * @param mnemonic - The BIP-39 mnemonic phrase to convert.
 * @returns The multi path.
 */
export declare function bip39MnemonicToMultipath(mnemonic: string): BIP39StringNode;
/**
 * Create a {@link SLIP10Node} from a BIP-39 mnemonic phrase.
 *
 * @param options - The options for creating the node.
 * @param options.path - The multi path.
 * @param options.curve - The curve to use for derivation.
 * @returns The node.
 */
export declare function deriveChildKey({ path, curve, }: DeriveChildKeyArgs): Promise<SLIP10Node>;
/**
 * Create a {@link SLIP10Node} from a BIP-39 seed.
 *
 * @param seed - The cryptographic seed bytes.
 * @param curve - The curve to use.
 * @returns An object containing the corresponding BIP-39 master key and chain
 * code.
 */
export declare function createBip39KeyFromSeed(seed: Uint8Array, curve: Curve): Promise<SLIP10Node>;
//# sourceMappingURL=bip39.d.ts.map