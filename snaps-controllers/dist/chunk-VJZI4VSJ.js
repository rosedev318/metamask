"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _chunkNXZVKBSVjs = require('./chunk-NXZVKBSV.js');



var _chunkXE5IWVNVjs = require('./chunk-XE5IWVNV.js');





var _chunkEXN2TFDJjs = require('./chunk-EXN2TFDJ.js');

// src/services/AbstractExecutionService.ts
var _jsonrpcengine = require('@metamask/json-rpc-engine');
var _objectmultiplex = require('@metamask/object-multiplex'); var _objectmultiplex2 = _interopRequireDefault(_objectmultiplex);
var _rpcerrors = require('@metamask/rpc-errors');
var _snapsutils = require('@metamask/snaps-utils');






var _utils = require('@metamask/utils');
var _jsonrpcmiddlewarestream = require('json-rpc-middleware-stream');
var _nanoid = require('nanoid');
var _readablestream = require('readable-stream');
var controllerName = "ExecutionService";
var _snapRpcHooks, _snapToJobMap, _jobToSnapMap, _messenger, _pingTimeout, _terminationTimeout, _removeSnapHooks, removeSnapHooks_fn, _createSnapHooks, createSnapHooks_fn, _mapSnapAndJob, mapSnapAndJob_fn, _removeSnapAndJobMapping, removeSnapAndJobMapping_fn;
var AbstractExecutionService = class {
  constructor({
    setupSnapProvider,
    messenger,
    pingTimeout = _utils.inMilliseconds.call(void 0, 2, _utils.Duration.Second),
    terminationTimeout = _utils.inMilliseconds.call(void 0, 1, _utils.Duration.Second)
  }) {
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _removeSnapHooks);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _createSnapHooks);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _mapSnapAndJob);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _removeSnapAndJobMapping);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _snapRpcHooks, void 0);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _snapToJobMap, void 0);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _jobToSnapMap, void 0);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _messenger, void 0);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _pingTimeout, void 0);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _terminationTimeout, void 0);
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _snapRpcHooks, /* @__PURE__ */ new Map());
    this.jobs = /* @__PURE__ */ new Map();
    this.setupSnapProvider = setupSnapProvider;
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _snapToJobMap, /* @__PURE__ */ new Map());
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _jobToSnapMap, /* @__PURE__ */ new Map());
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _messenger, messenger);
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _pingTimeout, pingTimeout);
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _terminationTimeout, terminationTimeout);
    this.registerMessageHandlers();
  }
  /**
   * Constructor helper for registering the controller's messaging system
   * actions.
   */
  registerMessageHandlers() {
    _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _messenger).registerActionHandler(
      `${controllerName}:handleRpcRequest`,
      async (snapId, options) => this.handleRpcRequest(snapId, options)
    );
    _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _messenger).registerActionHandler(
      `${controllerName}:executeSnap`,
      async (snapData) => this.executeSnap(snapData)
    );
    _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _messenger).registerActionHandler(
      `${controllerName}:terminateSnap`,
      async (snapId) => this.terminateSnap(snapId)
    );
    _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _messenger).registerActionHandler(
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
    const result = await _chunkXE5IWVNVjs.withTimeout.call(void 0, 
      this.command(jobId, {
        jsonrpc: "2.0",
        method: "terminate",
        params: [],
        id: _nanoid.nanoid.call(void 0, )
      }),
      _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _terminationTimeout)
    );
    if (result === _chunkXE5IWVNVjs.hasTimedOut || result !== "OK") {
      _snapsutils.logError.call(void 0, `Job "${jobId}" failed to terminate gracefully.`, result);
    }
    Object.values(jobWrapper.streams).forEach((stream) => {
      try {
        !stream.destroyed && stream.destroy();
        stream.removeAllListeners();
      } catch (error) {
        _snapsutils.logError.call(void 0, "Error while destroying stream", error);
      }
    });
    this.terminateJob(jobWrapper);
    _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _removeSnapAndJobMapping, removeSnapAndJobMapping_fn).call(this, jobId);
    this.jobs.delete(jobId);
    _chunkNXZVKBSVjs.log.call(void 0, `Job "${jobId}" terminated.`);
  }
  /**
   * Initiates a job for a snap.
   *
   * Depending on the execution environment, this may run forever if the Snap fails to start up properly, therefore any call to this function should be wrapped in a timeout.
   *
   * @returns Information regarding the created job.
   */
  async initJob() {
    const jobId = _nanoid.nanoid.call(void 0, );
    const { streams, worker } = await this.initStreams(jobId);
    const rpcEngine = new (0, _jsonrpcengine.JsonRpcEngine)();
    const jsonRpcConnection = _jsonrpcmiddlewarestream.createStreamMiddleware.call(void 0, );
    _readablestream.pipeline.call(void 0, 
      jsonRpcConnection.stream,
      streams.command,
      jsonRpcConnection.stream,
      (error) => {
        if (error) {
          _snapsutils.logError.call(void 0, `Command stream failure.`, error);
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
    const commandStream = mux.createStream(_snapsutils.SNAP_STREAM_NAMES.COMMAND);
    const notificationHandler = (message) => {
      if (!_utils.isJsonRpcNotification.call(void 0, message)) {
        return;
      }
      const snapId = _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _jobToSnapMap).get(jobId);
      if (message.method === "OutboundRequest") {
        _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _messenger).publish("ExecutionService:outboundRequest", snapId);
      } else if (message.method === "OutboundResponse") {
        _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _messenger).publish("ExecutionService:outboundResponse", snapId);
      } else if (message.method === "UnhandledError") {
        if (_utils.isObject.call(void 0, message.params) && message.params.error) {
          _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _messenger).publish(
            "ExecutionService:unhandledError",
            snapId,
            message.params.error
          );
          commandStream.removeListener("data", notificationHandler);
        } else {
          _snapsutils.logError.call(void 0, 
            new Error(
              `Received malformed "${message.method}" command stream notification.`
            )
          );
        }
      } else {
        _snapsutils.logError.call(void 0, 
          new Error(
            `Received unexpected command stream notification "${message.method}".`
          )
        );
      }
    };
    commandStream.on("data", notificationHandler);
    const rpcStream = mux.createStream(_snapsutils.SNAP_STREAM_NAMES.JSON_RPC);
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
    const jobId = _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _snapToJobMap).get(snapId);
    if (jobId) {
      await this.terminate(jobId);
    }
  }
  async terminateAllSnaps() {
    await Promise.all(
      [...this.jobs.keys()].map(async (jobId) => this.terminate(jobId))
    );
    _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _snapRpcHooks).clear();
  }
  /**
   * Gets the RPC request handler for the given snap.
   *
   * @param snapId - The id of the Snap whose message handler to get.
   * @returns The RPC request handler for the snap.
   */
  getRpcRequestHandler(snapId) {
    return _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _snapRpcHooks).get(snapId);
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
    if (_chunkEXN2TFDJjs.__privateGet.call(void 0, this, _snapToJobMap).has(snapData.snapId)) {
      throw new Error(`Snap "${snapData.snapId}" is already being executed.`);
    }
    const job = await this.initJob();
    _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _mapSnapAndJob, mapSnapAndJob_fn).call(this, snapData.snapId, job.id);
    const pingResult = await _chunkXE5IWVNVjs.withTimeout.call(void 0, 
      this.command(job.id, {
        jsonrpc: "2.0",
        method: "ping",
        id: _nanoid.nanoid.call(void 0, )
      }),
      _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _pingTimeout)
    );
    if (pingResult === _chunkXE5IWVNVjs.hasTimedOut) {
      throw new Error("The Snaps execution environment failed to start.");
    }
    const rpcStream = job.streams.rpc;
    this.setupSnapProvider(snapData.snapId, rpcStream);
    const result = await this.command(job.id, {
      jsonrpc: "2.0",
      method: "executeSnap",
      params: snapData,
      id: _nanoid.nanoid.call(void 0, )
    });
    _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _createSnapHooks, createSnapHooks_fn).call(this, snapData.snapId, job.id);
    return result;
  }
  // Cannot be hash private yet because of tests.
  async command(jobId, message) {
    _utils.assertIsJsonRpcRequest.call(void 0, message);
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Job with id "${jobId}" not found.`);
    }
    _chunkNXZVKBSVjs.log.call(void 0, "Parent: Sending Command", message);
    const response = await job.rpcEngine.handle(
      message
    );
    if (response.error) {
      throw new (0, _rpcerrors.JsonRpcError)(
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
  _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _snapRpcHooks).delete(snapId);
};
_createSnapHooks = new WeakSet();
createSnapHooks_fn = function(snapId, workerId) {
  const rpcHook = async ({ origin, handler, request }) => {
    return await this.command(workerId, {
      id: _nanoid.nanoid.call(void 0, ),
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
  _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _snapRpcHooks).set(snapId, rpcHook);
};
_mapSnapAndJob = new WeakSet();
mapSnapAndJob_fn = function(snapId, jobId) {
  _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _snapToJobMap).set(snapId, jobId);
  _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _jobToSnapMap).set(jobId, snapId);
};
_removeSnapAndJobMapping = new WeakSet();
removeSnapAndJobMapping_fn = function(jobId) {
  const snapId = _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _jobToSnapMap).get(jobId);
  if (!snapId) {
    throw new Error(`job: "${jobId}" has no mapped snap.`);
  }
  _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _jobToSnapMap).delete(jobId);
  _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _snapToJobMap).delete(snapId);
  _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _removeSnapHooks, removeSnapHooks_fn).call(this, snapId);
};
function setupMultiplex(connectionStream, streamName) {
  const mux = new (0, _objectmultiplex2.default)();
  _readablestream.pipeline.call(void 0, connectionStream, mux, connectionStream, (error) => {
    if (error) {
      streamName ? _snapsutils.logError.call(void 0, `"${streamName}" stream failure.`, error) : _snapsutils.logError.call(void 0, error);
    }
  });
  return mux;
}




exports.AbstractExecutionService = AbstractExecutionService; exports.setupMultiplex = setupMultiplex;
//# sourceMappingURL=chunk-VJZI4VSJ.js.map