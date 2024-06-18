import type { DeriveChildKeyArgs } from '.';
import type { SLIP10Node } from '../SLIP10Node';
/**
 * Derive a SLIP-10 child key with a given path from a parent key.
 *
 * @param options - The options for deriving a child key.
 * @returns A tuple containing the derived private key, public key and chain
 * code.
 */
export declare function deriveChildKey(options: DeriveChildKeyArgs): Promise<SLIP10Node>;
//# sourceMappingURL=slip10.d.ts.map