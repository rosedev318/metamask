import {
  log
} from "./chunk-4HVWEABQ.mjs";
import {
  hasTimedOut,
  withTimeout
} from "./chunk-36YC4Z3T.mjs";
import {
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet
} from "./chunk-YRZVIDCF.mjs";

// src/services/AbstractExecutionService.ts
import { JsonRpcEngine } from "@metamask/json-rpc-engine";
import ObjectMultiplex from "@metamask/object-multiplex";
import { JsonRpcError } from "@metamask/rpc-errors";
import { SNAP_STREAM_NAMES, logError } from "@metamask/snaps-utils";
import {
  Duration,
  assertIsJsonRpcRequest,
  inMilliseconds,
  isJsonRpcNotification,
  isObject
} from "@metamask/utils";
import { createStreamMiddleware } from "json-rpc-middleware-stream";
import { nanoid } from "nanoid";
import { pipeline } from "readable-stream";
var controllerName = "ExecutionService";
var _snapRpcHooks, _snapToJobMap, _jobToSnapMap, _messenger, _pingTimeout, _terminationTimeout, _removeSnapHooks, removeSnapHooks_fn, _createSnapHooks, createSnapHooks_fn, _mapSnapAndJob, mapSnapAndJob_fn, _removeSnapAndJobMapping, removeSnapAndJobMapping_fn;
var AbstractExecutionService = class {
  constructor({
    setupSnapProvider,
    messenger,
    pingTimeout = inMilliseconds(2, Duration.Second),
    terminationTimeout = inMilliseconds(1, Duration.Second)
  }) {
    __privateAdd(this, _removeSnapHooks);
    __privateAdd(this, _createSnapHooks);
    __privateAdd(this, _mapSnapAndJob);
    __privateAdd(this, _removeSnapAndJobMapping);
    __privateAdd(this, _snapRpcHooks, void 0);
    __privateAdd(this, _snapToJobMap, void 0);
    __privateAdd(this, _jobToSnapMap, void 0);
    __privateAdd(this, _messenger, void 0);
    __privateAdd(this, _pingTimeout, void 0);
    __privateAdd(this, _terminationTimeout, void 0);
    __privateSet(this, _snapRpcHooks, /* @__PURE__ */ new Map());
    this.jobs = /* @__PURE__ */ new Map();
    this.setupSnapProvider = setupSnapProvider;
    __privateSet(this, _snapToJobMap, /* @__PURE__ */ new Map());
    __privateSet(this, _jobToSnapMap, /* @__PURE__ */ new Map());
    __privateSet(this, _messenger, messenger);
    __privateSet(this, _pingTimeout, pingTimeout);
    __privateSet(this, _terminationTimeout, terminationTimeout);
    this.registerMessageHandlers();
  }
  /**
   * Constructor helper for registering the controller's messaging system
   * actions.
   */
  registerMessageHandlers() {
    __privateGet(this, _messenger).registerActionHandler(
      `${controllerName}:handleRpcRequest`,
      async (snapId, options) => this.handleRpcRequest(snapId, options)
    );
    __privateGet(this, _messenger).registerActionHandler(
      `${controllerName}:executeSnap`,
      async (snapData) => this.executeSnap(snapData)
    );
    __privateGet(this, _messenger).registerActionHandler(
      `${controllerName}:terminateSnap`,
      async (snapId) => this.terminateSnap(snapId)
    );
    __privateGet(this, _messenger).registerActionHandler(
      `${controllerName}:terminateAllSnaps`,
      async () => this.terminateAllSnaps()
    );
  }
  /**
   * Terminates the job with the specified ID and deletes all its associated
   * data. Any subsequent messages targeting the job will fail with an error.
   * Throws an error if the specified job does not exist, or if termination
   * fails unexpectedly.
   *
   * @param jobId - The id of the job to be terminated.
   */
  async terminate(jobId) {
    const jobWrapper = this.jobs.get(jobId);
    if (!jobWrapper) {
      throw new Error(`Job with id "${jobId}" not found.`);
    }
    const result = await withTimeout(
      this.command(jobId, {
        jsonrpc: "2.0",
        method: "terminate",
        params: [],
        id: nanoid()
      }),
      __privateGet(this, _terminationTimeout)
    );
    if (result === hasTimedOut || result !== "OK") {
      logError(`Job "${jobId}" failed to terminate gracefully.`, result);
    }
    Object.values(jobWrapper.streams).forEach((stream) => {
      try {
        !stream.destroyed && stream.destroy();
        stream.removeAllListeners();
      } catch (error) {
        logError("Error while destroying stream", error);
      }
    });
    this.terminateJob(jobWrapper);
    __privateMethod(this, _removeSnapAndJobMapping, removeSnapAndJobMapping_fn).call(this, jobId);
    this.jobs.delete(jobId);
    log(`Job "${jobId}" terminated.`);
  }
  /**
   * Initiates a job for a snap.
   *
   * Depending on the execution environment, this may run forever if the Snap fails to start up properly, therefore any call to this function should be wrapped in a timeout.
   *
   * @returns Information regarding the created job.
   */
  async initJob() {
    const jobId = nanoid();
    const { streams, worker } = await this.initStreams(jobId);
    const rpcEngine = new JsonRpcEngine();
    const jsonRpcConnection = createStreamMiddleware();
    pipeline(
      jsonRpcConnection.stream,
      streams.command,
      jsonRpcConnection.stream,
      (error) => {
        if (error) {
          logError(`Command stream failure.`, error);
        }
      }
    );
    rpcEngine.push(jsonRpcConnection.middleware);
    const envMetadata = {
      id: jobId,
      streams,
      rpcEngine,
      worker
    };
    this.jobs.set(jobId, envMetadata);
    return envMetadata;
  }
  /**
   * Sets up the streams for an initiated job.
   *
   * Depending on the execution environment, this may run forever if the Snap fails to start up properly, therefore any call to this function should be wrapped in a timeout.
   *
   * @param jobId - The id of the job.
   * @returns The streams to communicate with the worker and the worker itself.
   */
  async initStreams(jobId) {
    const { worker, stream: envStream } = await this.initEnvStream(jobId);
    const mux = setupMultiplex(envStream, `Job: "${jobId}"`);
    const commandStream = mux.createStream(SNAP_STREAM_NAMES.COMMAND);
    const notificationHandler = (message) => {
      if (!isJsonRpcNotification(message)) {
        return;
      }
      const snapId = __privateGet(this, _jobToSnapMap).get(jobId);
      if (message.method === "OutboundRequest") {
        __privateGet(this, _messenger).publish("ExecutionService:outboundRequest", snapId);
      } else if (message.method === "OutboundResponse") {
        __privateGet(this, _messenger).publish("ExecutionService:outboundResponse", snapId);
      } else if (message.method === "UnhandledError") {
        if (isObject(message.params) && message.params.error) {
          __privateGet(this, _messenger).publish(
            "ExecutionService:unhandledError",
            snapId,
            message.params.error
          );
          commandStream.removeListener("data", notificationHandler);
        } else {
          logError(
            new Error(
              `Received malformed "${message.method}" command stream notification.`
            )
          );
        }
      } else {
        logError(
          new Error(
            `Received unexpected command stream notification "${message.method}".`
          )
        );
      }
    };
    commandStream.on("data", notificationHandler);
    const rpcStream = mux.createStream(SNAP_STREAM_NAMES.JSON_RPC);
    return {
      streams: {
        command: commandStream,
        rpc: rpcStream,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        _connection: envStream
      },
      worker
    };
  }
  /**
   * Terminates the Snap with the specified ID. May throw an error if
   * termination unexpectedly fails, but will not fail if no job for the snap
   * with the specified ID is found.
   *
   * @param snapId - The ID of the snap to terminate.
   */
  async terminateSnap(snapId) {
    const jobId = __privateGet(this, _snapToJobMap).get(snapId);
    if (jobId) {
      await this.terminate(jobId);
    }
  }
  async terminateAllSnaps() {
    await Promise.all(
      [...this.jobs.keys()].map(async (jobId) => this.terminate(jobId))
    );
    __privateGet(this, _snapRpcHooks).clear();
  }
  /**
   * Gets the RPC request handler for the given snap.
   *
   * @param snapId - The id of the Snap whose message handler to get.
   * @returns The RPC request handler for the snap.
   */
  getRpcRequestHandler(snapId) {
    return __privateGet(this, _snapRpcHooks).get(snapId);
  }
  /**
   * Initializes and executes a snap, setting up the communication channels to the snap etc.
   *
   * Depending on the execution environment, this may run forever if the Snap fails to start up properly, therefore any call to this function should be wrapped in a timeout.
   *
   * @param snapData - Data needed for Snap execution.
   * @returns A string `OK` if execution succeeded.
   * @throws If the execution service returns an error.
   */
  async executeSnap(snapData) {
    if (__privateGet(this, _snapToJobMap).has(snapData.snapId)) {
      throw new Error(`Snap "${snapData.snapId}" is already being executed.`);
    }
    const job = await this.initJob();
    __privateMethod(this, _mapSnapAndJob, mapSnapAndJob_fn).call(this, snapData.snapId, job.id);
    const pingResult = await withTimeout(
      this.command(job.id, {
        jsonrpc: "2.0",
        method: "ping",
        id: nanoid()
      }),
      __privateGet(this, _pingTimeout)
    );
    if (pingResult === hasTimedOut) {
      throw new Error("The Snaps execution environment failed to start.");
    }
    const rpcStream = job.streams.rpc;
    this.setupSnapProvider(snapData.snapId, rpcStream);
    const result = await this.command(job.id, {
      jsonrpc: "2.0",
      method: "executeSnap",
      params: snapData,
      id: nanoid()
    });
    __privateMethod(this, _createSnapHooks, createSnapHooks_fn).call(this, snapData.snapId, job.id);
    return result;
  }
  // Cannot be hash private yet because of tests.
  async command(jobId, message) {
    assertIsJsonRpcRequest(message);
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Job with id "${jobId}" not found.`);
    }
    log("Parent: Sending Command", message);
    const response = await job.rpcEngine.handle(
      message
    );
    if (response.error) {
      throw new JsonRpcError(
        response.error.code,
        response.error.message,
        response.error.data
      );
    }
    return response.result;
  }
  /**
   * Handle RPC request.
   *
   * @param snapId - The ID of the recipient snap.
   * @param options - Bag of options to pass to the RPC handler.
   * @returns Promise that can handle the request.
   */
  async handleRpcRequest(snapId, options) {
    const rpcRequestHandler = this.getRpcRequestHandler(snapId);
    if (!rpcRequestHandler) {
      throw new Error(
        `Snap execution service returned no RPC handler for running snap "${snapId}".`
      );
    }
    return rpcRequestHandler(options);
  }
};
_snapRpcHooks = new WeakMap();
_snapToJobMap = new WeakMap();
_jobToSnapMap = new WeakMap();
_messenger = new WeakMap();
_pingTimeout = new WeakMap();
_terminationTimeout = new WeakMap();
_removeSnapHooks = new WeakSet();
removeSnapHooks_fn = function(snapId) {
  __privateGet(this, _snapRpcHooks).delete(snapId);
};
_createSnapHooks = new WeakSet();
createSnapHooks_fn = function(snapId, workerId) {
  const rpcHook = async ({ origin, handler, request }) => {
    return await this.command(workerId, {
      id: nanoid(),
      jsonrpc: "2.0",
      method: "snapRpc",
      params: {
        origin,
        handler,
        request,
        target: snapId
      }
    });
  };
  __privateGet(this, _snapRpcHooks).set(snapId, rpcHook);
};
_mapSnapAndJob = new WeakSet();
mapSnapAndJob_fn = function(snapId, jobId) {
  __privateGet(this, _snapToJobMap).set(snapId, jobId);
  __privateGet(this, _jobToSnapMap).set(jobId, snapId);
};
_removeSnapAndJobMapping = new WeakSet();
removeSnapAndJobMapping_fn = function(jobId) {
  const snapId = __privateGet(this, _jobToSnapMap).get(jobId);
  if (!snapId) {
    throw new Error(`job: "${jobId}" has no mapped snap.`);
  }
  __privateGet(this, _jobToSnapMap).delete(jobId);
  __privateGet(this, _snapToJobMap).delete(snapId);
  __privateMethod(this, _removeSnapHooks, removeSnapHooks_fn).call(this, snapId);
};
function setupMultiplex(connectionStream, streamName) {
  const mux = new ObjectMultiplex();
  pipeline(connectionStream, mux, connectionStream, (error) => {
    if (error) {
      streamName ? logError(`"${streamName}" stream failure.`, error) : logError(error);
    }
  });
  return mux;
}

export {
  AbstractExecutionService,
  setupMultiplex
};
//# sourceMappingURL=chunk-XBGQ5PKQ.mjs.map