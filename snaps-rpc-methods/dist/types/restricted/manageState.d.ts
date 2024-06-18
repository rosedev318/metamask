import type { PermissionSpecificationBuilder, RestrictedMethodOptions, ValidPermissionSpecification } from '@metamask/permission-controller';
import { PermissionType } from '@metamask/permission-controller';
import type { ManageStateParams, ManageStateResult } from '@metamask/snaps-sdk';
import type { Json, NonEmptyArray, Hex } from '@metamask/utils';
import type { MethodHooksObject } from '../utils';
export declare const STATE_ENCRYPTION_SALT = "snap_manageState encryption";
declare const methodName = "snap_manageState";
export declare type ManageStateMethodHooks = {
    /**
     * @returns The mnemonic of the user's primary keyring.
     */
    getMnemonic: () => Promise<Uint8Array>;
    /**
     * Waits for the extension to be unlocked.
     *
     * @returns A promise that resolves once the extension is unlocked.
     */
    getUnlockPromise: (shouldShowUnlockRequest: boolean) => Promise<void>;
    /**
     * A function that clears the state of the requesting Snap.
     */
    clearSnapState: (snapId: string, encrypted: boolean) => void;
    /**
     * A function that gets the encrypted state of the requesting Snap.
     *
     * @returns The current state of the Snap.
     */
    getSnapState: (snapId: string, encrypted: boolean) => string;
    /**
     * A function that updates the state of the requesting Snap.
     *
     * @param newState - The new state of the Snap.
     */
    updateSnapState: (snapId: string, newState: string, encrypted: boolean) => void;
    /**
     * Encrypts data with a key. This is assumed to perform symmetric encryption.
     *
     * @param key - The key to use for encryption, in hexadecimal format.
     * @param data - The JSON data to encrypt.
     * @returns The ciphertext as a string. The format for this string is
     * dependent on the implementation, but MUST be a string.
     */
    encrypt: (key: string, data: Json) => Promise<string>;
    /**
     * Decrypts data with a key. This is assumed to perform symmetric decryption.
     *
     * @param key - The key to use for decryption, in hexadecimal format.
     * @param cipherText - The ciphertext to decrypt. The format for this string
     * is dependent on the implementation, but MUST be a string.
     * @returns The decrypted data as a JSON object.
     */
    decrypt: (key: Hex, cipherText: string) => Promise<unknown>;
};
declare type ManageStateSpecificationBuilderOptions = {
    allowedCaveats?: Readonly<NonEmptyArray<string>> | null;
    methodHooks: ManageStateMethodHooks;
};
declare type ManageStateSpecification = ValidPermissionSpecification<{
    permissionType: PermissionType.RestrictedMethod;
    targetName: typeof methodName;
    methodImplementation: ReturnType<typeof getManageStateImplementation>;
    allowedCaveats: Readonly<NonEmptyArray<string>> | null;
}>;
/**
 * The specification builder for the `snap_manageState` permission.
 * `snap_manageState` lets the Snap store and manage some of its state on
 * your device.
 *
 * @param options - The specification builder options.
 * @param options.allowedCaveats - The optional allowed caveats for the permission.
 * @param options.methodHooks - The RPC method hooks needed by the method implementation.
 * @returns The specification for the `snap_manageState` permission.
 */
export declare const specificationBuilder: PermissionSpecificationBuilder<PermissionType.RestrictedMethod, ManageStateSpecificationBuilderOptions, ManageStateSpecification>;
export declare const manageStateBuilder: Readonly<{
    readonly targetName: "snap_manageState";
    readonly specificationBuilder: PermissionSpecificationBuilder<PermissionType.RestrictedMethod, ManageStateSpecificationBuilderOptions, {
        permissionType: PermissionType.RestrictedMethod;
        targetName: typeof methodName;
        methodImplementation: ReturnType<typeof getManageStateImplementation>;
        allowedCaveats: Readonly<NonEmptyArray<string>> | null;
    }>;
    readonly methodHooks: MethodHooksObject<ManageStateMethodHooks>;
}>;
export declare const STORAGE_SIZE_LIMIT = 104857600;
declare type GetEncryptionKeyArgs = {
    snapId: string;
    mnemonicPhrase: Uint8Array;
};
/**
 * Get a deterministic encryption key to use for encrypting and decrypting the
 * state.
 *
 * This key should only be used for state encryption using `snap_manageState`.
 * To get other encryption keys, a different salt can be used.
 *
 * @param args - The encryption key args.
 * @param args.snapId - The ID of the snap to get the encryption key for.
 * @param args.mnemonicPhrase - The mnemonic phrase to derive the encryption key
 * from.
 * @returns The state encryption key.
 */
export declare function getEncryptionKey({ mnemonicPhrase, snapId, }: GetEncryptionKeyArgs): Promise<`0x${string}`>;
/**
 * Builds the method implementation for `snap_manageState`.
 *
 * @param hooks - The RPC method hooks.
 * @param hooks.clearSnapState - A function that clears the state stored for a
 * snap.
 * @param hooks.getSnapState - A function that fetches the persisted decrypted
 * state for a snap.
 * @param hooks.updateSnapState - A function that updates the state stored for a
 * snap.
 * @param hooks.getMnemonic - A function to retrieve the Secret Recovery Phrase
 * of the user.
 * @param hooks.getUnlockPromise - A function that resolves once the MetaMask
 * extension is unlocked and prompts the user to unlock their MetaMask if it is
 * locked.
 * @param hooks.encrypt - A function that encrypts the given state.
 * @param hooks.decrypt - A function that decrypts the given state.
 * @returns The method implementation which either returns `null` for a
 * successful state update/deletion or returns the decrypted state.
 * @throws If the params are invalid.
 */
export declare function getManageStateImplementation({ getMnemonic, getUnlockPromise, clearSnapState, getSnapState, updateSnapState, encrypt, decrypt, }: ManageStateMethodHooks): (options: RestrictedMethodOptions<ManageStateParams>) => Promise<ManageStateResult>;
/**
 * Validates the manageState method `params` and returns them cast to the correct
 * type. Throws if validation fails.
 *
 * @param params - The unvalidated params object from the method request.
 * @param method - RPC method name used for debugging errors.
 * @param storageSizeLimit - Maximum allowed size (in bytes) of a new state object.
 * @returns The validated method parameter object.
 */
export declare function getValidatedParams(params: unknown, method: string, storageSizeLimit?: number): ManageStateParams;
export {};
