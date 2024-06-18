import type { DeriveChildKeyArgs } from '.';
import type { Curve } from '../curves';
import { SLIP10Node } from '../SLIP10Node';
declare type ErrorHandler = (error: unknown, options: DeriveNodeArgs) => Promise<DeriveNodeArgs>;
/**
 * Derive a BIP-32 or SLIP-10 child key with a given path from a parent key.
 *
 * Since BIP-32 and SLIP-10 are very similar, this function can be used to
 * derive both types of keys.
 *
 * @param options - The options for deriving a child key.
 * @param options.path - The derivation path part to derive.
 * @param options.node - The node to derive from.
 * @param options.curve - The curve to use for derivation.
 * @param handleError - A function that can handle errors that occur during
 * derivation.
 * @returns The derived node.
 */
export declare function deriveChildKey({ path, node, curve }: DeriveChildKeyArgs, handleError: ErrorHandler): Promise<SLIP10Node>;
declare type BaseDeriveNodeArgs = {
    entropy: Uint8Array;
    chainCode: Uint8Array;
    childIndex: number;
    isHardened: boolean;
    depth: number;
    parentFingerprint: number;
    masterFingerprint?: number | undefined;
    curve: Curve;
};
declare type DerivePrivateKeyArgs = BaseDeriveNodeArgs & {
    privateKey: Uint8Array;
    publicKey?: never | undefined;
};
declare type DerivePublicKeyArgs = BaseDeriveNodeArgs & {
    publicKey: Uint8Array;
    privateKey?: never | undefined;
};
export declare type DeriveNodeArgs = DerivePrivateKeyArgs | DerivePublicKeyArgs;
declare type DeriveSecretExtensionArgs = {
    privateKey: Uint8Array;
    childIndex: number;
    isHardened: boolean;
    curve: Curve;
};
/**
 * Derive a BIP-32 secret extension from a parent key and child index.
 *
 * @param options - The options for deriving a secret extension.
 * @param options.privateKey - The parent private key bytes.
 * @param options.childIndex - The child index to derive.
 * @param options.isHardened - Whether the child index is hardened.
 * @param options.curve - The curve to use for derivation.
 * @returns The secret extension bytes.
 */
export declare function deriveSecretExtension({ privateKey, childIndex, isHardened, curve, }: DeriveSecretExtensionArgs): Promise<Uint8Array>;
declare type DerivePublicExtensionArgs = {
    parentPublicKey: Uint8Array;
    childIndex: number;
};
/**
 * Derive a BIP-32 public extension from a parent key and child index.
 *
 * @param options - The options for deriving a public extension.
 * @param options.parentPublicKey - The parent public key bytes.
 * @param options.childIndex - The child index to derive.
 * @returns The public extension bytes.
 */
export declare function derivePublicExtension({ parentPublicKey, childIndex, }: DerivePublicExtensionArgs): Uint8Array;
declare type DerivePublicChildKeyArgs = {
    entropy: Uint8Array;
    publicKey: Uint8Array;
    depth: number;
    masterFingerprint?: number | undefined;
    parentFingerprint: number;
    childIndex: number;
    curve: Curve;
};
/**
 * Derive a BIP-32 public child key with a given path from a parent key.
 *
 * @param args - The arguments for deriving a public child key.
 * @param args.entropy - The entropy to use for derivation.
 * @param args.publicKey - The parent public key to use for derivation.
 * @param args.depth - The depth of the parent node.
 * @param args.masterFingerprint - The fingerprint of the master node.
 * @param args.parentFingerprint - The fingerprint of the parent node.
 * @param args.childIndex - The child index to derive.
 * @param args.curve - The curve to use for derivation.
 * @returns The derived {@link SLIP10Node}.
 */
export declare function derivePublicChildKey({ entropy, publicKey, depth, masterFingerprint, parentFingerprint, childIndex, curve, }: DerivePublicChildKeyArgs): Promise<SLIP10Node>;
/**
 * Add a tweak to the private key: `(privateKey + tweak) % n`.
 *
 * @param privateKeyBytes - The private key as 32 byte Uint8Array.
 * @param tweakBytes - The tweak as 32 byte Uint8Array.
 * @param curve - The curve to use.
 * @throws If the private key or tweak is invalid.
 * @returns The private key with the tweak added to it.
 */
export declare function privateAdd(privateKeyBytes: Uint8Array, tweakBytes: Uint8Array, curve: Curve): Uint8Array;
declare type GenerateEntropyArgs = {
    chainCode: Uint8Array;
    extension: Uint8Array;
};
/**
 * Generate 64 bytes of (deterministic) entropy from a chain code and secret
 * extension.
 *
 * @param args - The arguments for generating entropy.
 * @param args.chainCode - The parent chain code bytes.
 * @param args.extension - The extension bytes.
 * @returns The generated entropy bytes.
 */
export declare function generateEntropy({ chainCode, extension }: GenerateEntropyArgs): Uint8Array;
/**
 * Validate that a node is specified.
 *
 * @param node - The node to validate.
 * @throws If the node is not specified.
 */
export declare function validateNode(node?: SLIP10Node): asserts node is SLIP10Node;
export {};
//# sourceMappingURL=shared.d.ts.map