import type { Hex } from '@metamask/utils';
import type { Infer } from 'superstruct';
export declare const SignatureStruct: import("superstruct").Struct<{
    curve: "secp256k1";
    format: "DER";
    signature: `0x${string}`;
}, {
    signature: import("superstruct").Struct<`0x${string}`, null>;
    curve: import("superstruct").Struct<"secp256k1", "secp256k1">;
    format: import("superstruct").Struct<"DER", "DER">;
}>;
declare type Signature = Infer<typeof SignatureStruct>;
declare type VerifyArgs = {
    registry: string;
    signature: Signature;
    publicKey: Hex;
};
/**
 * Verifies that the Snap Registry is properly signed using a cryptographic key.
 *
 * @param options - Parameters for signing.
 * @param options.registry - Raw text of the registry.json file.
 * @param options.signature - Hex-encoded encoded signature.
 * @param options.publicKey - Hex-encoded or Uint8Array public key to compare
 * the signature to.
 * @returns Whether the signature is valid.
 */
export declare function verify({ registry, signature, publicKey, }: VerifyArgs): boolean;
export {};
