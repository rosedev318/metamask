import type { JsonRpcMiddleware } from '@metamask/json-rpc-engine';
import type { Json, JsonRpcParams } from '@metamask/utils';
import type { QueuedRequestController } from './QueuedRequestController';
/**
 * Creates a JSON-RPC middleware for handling queued requests. This middleware
 * intercepts JSON-RPC requests, checks if they require queueing, and manages
 * their execution based on the specified options.
 *
 * @param options - Configuration options.
 * @param options.enqueueRequest - A method for enqueueing a request.
 * @param options.useRequestQueue - A function that determines if the request queue feature is enabled.
 * @returns The JSON-RPC middleware that manages queued requests.
 */
export declare const createQueuedRequestMiddleware: ({ enqueueRequest, useRequestQueue, }: {
    enqueueRequest: QueuedRequestController['enqueueRequest'];
    useRequestQueue: () => boolean;
}) => JsonRpcMiddleware<JsonRpcParams, Json>;
//# sourceMappingURL=QueuedRequestMiddleware.d.ts.map