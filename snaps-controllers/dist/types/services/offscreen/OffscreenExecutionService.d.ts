import type { ExecutionServiceArgs } from '../AbstractExecutionService';
import { ProxyExecutionService } from '../proxy/ProxyExecutionService';
declare type OffscreenExecutionEnvironmentServiceArgs = {
    documentUrl: URL;
} & ExecutionServiceArgs;
export declare class OffscreenExecutionService extends ProxyExecutionService {
    #private;
    readonly documentUrl: URL;
    /**
     * Create a new offscreen execution service.
     *
     * @param args - The constructor arguments.
     * @param args.documentUrl - The URL of the offscreen document to use as the
     * execution environment. This must be a URL relative to the location where
     * this is called. This cannot be a public (http(s)) URL.
     * @param args.messenger - The messenger to use for communication with the
     * `SnapController`.
     * @param args.setupSnapProvider - The function to use to set up the snap
     * provider.
     */
    constructor({ documentUrl, messenger, setupSnapProvider, }: OffscreenExecutionEnvironmentServiceArgs);
    /**
     * Create a new stream for the specified job. This wraps the runtime stream
     * in a stream specific to the job.
     *
     * @param jobId - The job ID.
     */
    protected initEnvStream(jobId: string): Promise<{
        worker: string;
        stream: import("..").ProxyPostMessageStream;
    }>;
}
export {};
