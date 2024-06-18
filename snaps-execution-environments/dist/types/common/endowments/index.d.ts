import type { StreamProvider } from '@metamask/providers';
import type { SnapsProvider } from '@metamask/snaps-sdk';
import type { NotifyFunction } from '../BaseSnapExecutor';
/**
 * Gets the endowments for a particular Snap. Some endowments, like `setTimeout`
 * and `clearTimeout`, must be attenuated so that they can only affect behavior
 * within the Snap's own realm. Therefore, we use factory functions to create
 * such attenuated / modified endowments. Otherwise, the value that's on the
 * root realm global will be used.
 *
 * @param options - An options bag.
 * @param options.snap - The Snaps global API object.
 * @param options.ethereum - The Snap's EIP-1193 provider object.
 * @param options.snapId - The id of the snap that will use the created endowments.
 * @param options.endowments - The list of endowments to provide to the snap.
 * @param options.notify - A reference to the notify function of the snap executor.
 * @returns An object containing the Snap's endowments.
 */
export declare function createEndowments({ snap, ethereum, snapId, endowments, notify, }: {
    snap: SnapsProvider;
    ethereum: StreamProvider;
    snapId: string;
    endowments: string[];
    notify: NotifyFunction;
}): {
    endowments: Record<string, unknown>;
    teardown: () => Promise<void>;
};
