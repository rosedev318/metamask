import type { StreamProvider, RequestArguments } from '@metamask/providers';
/**
 * Make proxy for Promise and handle the teardown process properly.
 * If the teardown is called in the meanwhile, Promise result will not be
 * exposed to the snap anymore and warning will be logged to the console.
 *
 * @param originalPromise - Original promise.
 * @param teardownRef - Reference containing teardown count.
 * @param teardownRef.lastTeardown - Number of the last teardown.
 * @returns New proxy promise.
 */
export declare function withTeardown<Type>(originalPromise: Promise<Type>, teardownRef: {
    lastTeardown: number;
}): Promise<Type>;
/**
 * Returns a Proxy that narrows down (attenuates) the fields available on
 * the StreamProvider and replaces the request implementation.
 *
 * @param provider - Instance of a StreamProvider to be limited.
 * @param request - Custom attenuated request object.
 * @returns Proxy to the StreamProvider instance.
 */
export declare function proxyStreamProvider(provider: StreamProvider, request: unknown): StreamProvider;
export declare const BLOCKED_RPC_METHODS: readonly string[];
/**
 * Asserts the validity of request arguments for a snap outbound request using the `snap.request` API.
 *
 * @param args - The arguments to validate.
 */
export declare function assertSnapOutboundRequest(args: RequestArguments): void;
/**
 * Asserts the validity of request arguments for an ethereum outbound request using the `ethereum.request` API.
 *
 * @param args - The arguments to validate.
 */
export declare function assertEthereumOutboundRequest(args: RequestArguments): void;
/**
 * Gets a sanitized value to be used for passing to the underlying MetaMask provider.
 *
 * @param value - An unsanitized value from a snap.
 * @returns A sanitized value ready to be passed to a MetaMask provider.
 */
export declare function sanitizeRequestArguments(value: unknown): RequestArguments;
/**
 * Check if the input is a valid response.
 *
 * @param response - The response.
 * @returns True if the response is valid, otherwise false.
 */
export declare function isValidResponse(response: Record<string, unknown>): boolean;
