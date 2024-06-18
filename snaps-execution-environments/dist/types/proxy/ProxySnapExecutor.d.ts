import type { BasePostMessageStream } from '@metamask/post-message-stream';
import { WindowPostMessageStream } from '@metamask/post-message-stream';
declare type ExecutorJob = {
    id: string;
    window: Window;
    stream: WindowPostMessageStream;
};
/**
 * A "proxy" snap executor that uses a level of indirection to execute snaps.
 *
 * Useful for multiple execution environments.
 *
 * This is not a traditional snap executor, as it does not execute snaps itself.
 * Instead, it creates an iframe window for each snap execution, and sends the
 * snap execution request to the iframe window. The iframe window is responsible
 * for executing the snap.
 *
 * This executor is persisted between snap executions. The executor essentially
 * acts as a proxy between the client and the iframe execution environment.
 */
export declare class ProxySnapExecutor {
    #private;
    readonly jobs: Record<string, ExecutorJob>;
    /**
     * Initialize the executor with the given stream. This is a wrapper around the
     * constructor.
     *
     * @param stream - The stream to use for communication.
     * @param frameUrl - An optional URL for the iframe to use.
     * @returns The initialized executor.
     */
    static initialize(stream: BasePostMessageStream, frameUrl?: string): ProxySnapExecutor;
    constructor(stream: BasePostMessageStream, frameUrl: string);
}
export {};
