"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkHCAXYGTCjs = require('./chunk-HCAXYGTC.js');







var _chunkC7XBEPVOjs = require('./chunk-C7XBEPVO.js');


var _chunkZ7BOREC4js = require('./chunk-Z7BOREC4.js');


var _chunkOLASO3O4js = require('./chunk-OLASO3O4.js');





var _chunkDFPM46ZFjs = require('./chunk-DFPM46ZF.js');



var _chunk2VA6RAEEjs = require('./chunk-2VA6RAEE.js');


var _chunkCV5LC4PPjs = require('./chunk-CV5LC4PP.js');



var _chunkEXN2TFDJjs = require('./chunk-EXN2TFDJ.js');

// src/common/BaseSnapExecutor.ts
var _jsonrpcengine = require('@metamask/json-rpc-engine');
var _StreamProvider = require('@metamask/providers/dist/StreamProvider');
var _rpcerrors = require('@metamask/rpc-errors');
var _snapssdk = require('@metamask/snaps-sdk');







var _snapsutils = require('@metamask/snaps-utils');






var _utils = require('@metamask/utils');
var _superstruct = require('superstruct');
var fallbackError = {
  code: _rpcerrors.errorCodes.rpc.internal,
  message: "Execution Environment Error"
};
var unhandledError = _rpcerrors.rpcErrors.internal({
  message: "Unhandled Snap Error"
}).serialize();
var EXECUTION_ENVIRONMENT_METHODS = {
  ping: {
    struct: _chunkDFPM46ZFjs.PingRequestArgumentsStruct,
    params: []
  },
  executeSnap: {
    struct: _chunkDFPM46ZFjs.ExecuteSnapRequestArgumentsStruct,
    params: ["snapId", "sourceCode", "endowments"]
  },
  terminate: {
    struct: _chunkDFPM46ZFjs.TerminateRequestArgumentsStruct,
    params: []
  },
  snapRpc: {
    struct: _chunkDFPM46ZFjs.SnapRpcRequestArgumentsStruct,
    params: ["target", "handler", "origin", "request"]
  }
};
var _write, write_fn, _notify, notify_fn, _respond, respond_fn;
var BaseSnapExecutor = class {
  constructor(commandStream, rpcStream) {
    // Awaitable function that writes back to the command stream
    // To prevent snap execution from blocking writing we wrap in a promise
    // and await it before continuing execution
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _write);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _notify);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _respond);
    this.lastTeardown = 0;
    this.snapData = /* @__PURE__ */ new Map();
    this.commandStream = commandStream;
    this.commandStream.on("data", (data) => {
      this.onCommandRequest(data).catch((error) => {
        _snapsutils.logError.call(void 0, error);
      });
    });
    this.rpcStream = rpcStream;
    this.methods = _chunkOLASO3O4js.getCommandMethodImplementations.call(void 0, 
      this.startSnap.bind(this),
      async (target, handlerType, args) => {
        const data = this.snapData.get(target);
        const handler = data?.exports[handlerType];
        const { required } = _snapsutils.SNAP_EXPORTS[handlerType];
        _utils.assert.call(void 0, 
          !required || handler !== void 0,
          `No ${handlerType} handler exported for snap "${target}`,
          _rpcerrors.rpcErrors.methodNotSupported
        );
        if (!handler) {
          return null;
        }
        let result = await this.executeInSnapContext(
          target,
          () => (
            // TODO: fix handler args type cast
            handler(args)
          )
        );
        if (result === void 0) {
          result = null;
        }
        try {
          return _utils.getSafeJson.call(void 0, result);
        } catch (error) {
          throw _rpcerrors.rpcErrors.internal(
            `Received non-JSON-serializable value: ${error.message.replace(
              /^Assertion failed: /u,
              ""
            )}`
          );
        }
      },
      this.onTerminate.bind(this)
    );
  }
  errorHandler(error, data) {
    const serializedError = _rpcerrors.serializeError.call(void 0, error, {
      fallbackError: unhandledError,
      shouldIncludeStack: false
    });
    const errorData = _snapssdk.getErrorData.call(void 0, serializedError);
    _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _notify, notify_fn).call(this, {
      method: "UnhandledError",
      params: {
        error: {
          ...serializedError,
          data: {
            ...errorData,
            ...data
          }
        }
      }
    }).catch((notifyError) => {
      _snapsutils.logError.call(void 0, notifyError);
    });
  }
  async onCommandRequest(message) {
    if (!_utils.isJsonRpcRequest.call(void 0, message)) {
      if (_utils.hasProperty.call(void 0, message, "id") && _superstruct.is.call(void 0, message.id, _utils.JsonRpcIdStruct)) {
        await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _write, write_fn).call(this, {
          error: _rpcerrors.serializeError.call(void 0, 
            _rpcerrors.rpcErrors.internal(
              "JSON-RPC requests must be JSON serializable objects."
            )
          ),
          id: message.id,
          jsonrpc: "2.0"
        });
      } else {
        _snapsutils.logInfo.call(void 0, 
          "Command stream received a non-JSON-RPC request, and was unable to respond."
        );
      }
      return;
    }
    const { id, method, params } = message;
    if (!_utils.hasProperty.call(void 0, EXECUTION_ENVIRONMENT_METHODS, method)) {
      await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _respond, respond_fn).call(this, id, {
        error: _rpcerrors.rpcErrors.methodNotFound({
          data: {
            method
          }
        }).serialize()
      });
      return;
    }
    const methodObject = EXECUTION_ENVIRONMENT_METHODS[method];
    const paramsAsArray = _chunkCV5LC4PPjs.sortParamKeys.call(void 0, methodObject.params, params);
    const [error] = _superstruct.validate.call(void 0, paramsAsArray, methodObject.struct);
    if (error) {
      await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _respond, respond_fn).call(this, id, {
        error: _rpcerrors.rpcErrors.invalidParams({
          message: `Invalid parameters for method "${method}": ${error.message}.`,
          data: {
            method,
            params: paramsAsArray
          }
        }).serialize()
      });
      return;
    }
    try {
      const result = await this.methods[method](...paramsAsArray);
      await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _respond, respond_fn).call(this, id, { result });
    } catch (rpcError) {
      await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _respond, respond_fn).call(this, id, {
        error: _rpcerrors.serializeError.call(void 0, rpcError, {
          fallbackError
        })
      });
    }
  }
  /**
   * Attempts to evaluate a snap in SES. Generates APIs for the snap. May throw
   * on errors.
   *
   * @param snapId - The id of the snap.
   * @param sourceCode - The source code of the snap, in IIFE format.
   * @param _endowments - An array of the names of the endowments.
   */
  async startSnap(snapId, sourceCode, _endowments) {
    _chunkZ7BOREC4js.log.call(void 0, `Starting snap '${snapId}' in worker.`);
    if (this.snapPromiseErrorHandler) {
      _chunk2VA6RAEEjs.removeEventListener.call(void 0, "unhandledrejection", this.snapPromiseErrorHandler);
    }
    if (this.snapErrorHandler) {
      _chunk2VA6RAEEjs.removeEventListener.call(void 0, "error", this.snapErrorHandler);
    }
    this.snapErrorHandler = (error) => {
      this.errorHandler(error.error, { snapId });
    };
    this.snapPromiseErrorHandler = (error) => {
      this.errorHandler(error instanceof Error ? error : error.reason, {
        snapId
      });
    };
    const provider = new (0, _StreamProvider.StreamProvider)(this.rpcStream, {
      jsonRpcStreamName: "metamask-provider",
      rpcMiddleware: [_jsonrpcengine.createIdRemapMiddleware.call(void 0, )]
    });
    await provider.initialize();
    const snap = this.createSnapGlobal(provider);
    const ethereum = this.createEIP1193Provider(provider);
    const snapModule = { exports: {} };
    try {
      const { endowments, teardown: endowmentTeardown } = _chunkHCAXYGTCjs.createEndowments.call(void 0, {
        snap,
        ethereum,
        snapId,
        endowments: _endowments,
        notify: _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _notify, notify_fn).bind(this)
      });
      this.snapData.set(snapId, {
        idleTeardown: endowmentTeardown,
        runningEvaluations: /* @__PURE__ */ new Set(),
        exports: {}
      });
      _chunk2VA6RAEEjs.addEventListener.call(void 0, "unhandledRejection", this.snapPromiseErrorHandler);
      _chunk2VA6RAEEjs.addEventListener.call(void 0, "error", this.snapErrorHandler);
      const compartment = new Compartment({
        ...endowments,
        module: snapModule,
        exports: snapModule.exports
      });
      compartment.globalThis.self = compartment.globalThis;
      compartment.globalThis.global = compartment.globalThis;
      compartment.globalThis.window = compartment.globalThis;
      await this.executeInSnapContext(snapId, () => {
        compartment.evaluate(sourceCode);
        this.registerSnapExports(snapId, snapModule);
      });
    } catch (error) {
      this.removeSnap(snapId);
      const [cause] = _snapsutils.unwrapError.call(void 0, error);
      throw _rpcerrors.rpcErrors.internal({
        message: `Error while running snap '${snapId}': ${cause.message}`,
        data: {
          cause: cause.serialize()
        }
      });
    }
  }
  /**
   * Cancels all running evaluations of all snaps and clears all snap data.
   * NOTE:** Should only be called in response to the `terminate` RPC command.
   */
  onTerminate() {
    this.snapData.forEach(
      (data) => data.runningEvaluations.forEach((evaluation) => evaluation.stop())
    );
    this.snapData.clear();
  }
  registerSnapExports(snapId, snapModule) {
    const data = this.snapData.get(snapId);
    if (!data) {
      return;
    }
    data.exports = _snapsutils.SNAP_EXPORT_NAMES.reduce((acc, exportName) => {
      const snapExport = snapModule.exports[exportName];
      const { validator } = _snapsutils.SNAP_EXPORTS[exportName];
      if (validator(snapExport)) {
        return { ...acc, [exportName]: snapExport };
      }
      return acc;
    }, {});
  }
  /**
   * Instantiates a snap API object (i.e. `globalThis.snap`).
   *
   * @param provider - A StreamProvider connected to MetaMask.
   * @returns The snap provider object.
   */
  createSnapGlobal(provider) {
    const originalRequest = provider.request.bind(provider);
    const request = async (args) => {
      const sanitizedArgs = _chunkC7XBEPVOjs.sanitizeRequestArguments.call(void 0, args);
      _chunkC7XBEPVOjs.assertSnapOutboundRequest.call(void 0, sanitizedArgs);
      return await _chunkC7XBEPVOjs.withTeardown.call(void 0, 
        (async () => {
          await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _notify, notify_fn).call(this, {
            method: "OutboundRequest",
            params: { source: "snap.request" }
          });
          try {
            return await originalRequest(sanitizedArgs);
          } finally {
            await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _notify, notify_fn).call(this, {
              method: "OutboundResponse",
              params: { source: "snap.request" }
            });
          }
        })(),
        this
      );
    };
    const snapGlobalProxy = new Proxy(
      {},
      {
        has(_target, prop) {
          return typeof prop === "string" && ["request"].includes(prop);
        },
        get(_target, prop) {
          if (prop === "request") {
            return request;
          }
          return void 0;
        }
      }
    );
    return harden(snapGlobalProxy);
  }
  /**
   * Instantiates an EIP-1193 Ethereum provider object (i.e. `globalThis.ethereum`).
   *
   * @param provider - A StreamProvider connected to MetaMask.
   * @returns The EIP-1193 Ethereum provider object.
   */
  createEIP1193Provider(provider) {
    const originalRequest = provider.request.bind(provider);
    const request = async (args) => {
      const sanitizedArgs = _chunkC7XBEPVOjs.sanitizeRequestArguments.call(void 0, args);
      _chunkC7XBEPVOjs.assertEthereumOutboundRequest.call(void 0, sanitizedArgs);
      return await _chunkC7XBEPVOjs.withTeardown.call(void 0, 
        (async () => {
          await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _notify, notify_fn).call(this, {
            method: "OutboundRequest",
            params: { source: "ethereum.request" }
          });
          try {
            return await originalRequest(sanitizedArgs);
          } finally {
            await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _notify, notify_fn).call(this, {
              method: "OutboundResponse",
              params: { source: "ethereum.request" }
            });
          }
        })(),
        this
      );
    };
    const streamProviderProxy = _chunkC7XBEPVOjs.proxyStreamProvider.call(void 0, provider, request);
    return harden(streamProviderProxy);
  }
  /**
   * Removes the snap with the given name.
   *
   * @param snapId - The id of the snap to remove.
   */
  removeSnap(snapId) {
    this.snapData.delete(snapId);
  }
  /**
   * Calls the specified executor function in the context of the specified snap.
   * Essentially, this means that the operation performed by the executor is
   * counted as an evaluation of the specified snap. When the count of running
   * evaluations of a snap reaches zero, its endowments are torn down.
   *
   * @param snapId - The id of the snap whose context to execute in.
   * @param executor - The function that will be executed in the snap's context.
   * @returns The executor's return value.
   * @template Result - The return value of the executor.
   */
  async executeInSnapContext(snapId, executor) {
    const data = this.snapData.get(snapId);
    if (data === void 0) {
      throw _rpcerrors.rpcErrors.internal(
        `Tried to execute in context of unknown snap: "${snapId}".`
      );
    }
    let stop;
    const stopPromise = new Promise(
      (_, reject) => stop = () => reject(
        // TODO(rekmarks): Specify / standardize error code for this case.
        _rpcerrors.rpcErrors.internal(
          `The snap "${snapId}" has been terminated during execution.`
        )
      )
    );
    const evaluationData = { stop };
    try {
      data.runningEvaluations.add(evaluationData);
      return await Promise.race([executor(), stopPromise]);
    } catch (error) {
      throw new (0, _snapsutils.WrappedSnapError)(error);
    } finally {
      data.runningEvaluations.delete(evaluationData);
      if (data.runningEvaluations.size === 0) {
        this.lastTeardown += 1;
        await data.idleTeardown();
      }
    }
  }
};
_write = new WeakSet();
write_fn = async function(chunk) {
  return new Promise((resolve, reject) => {
    this.commandStream.write(chunk, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
};
_notify = new WeakSet();
notify_fn = async function(notification) {
  if (!_chunkC7XBEPVOjs.isValidResponse.call(void 0, notification)) {
    throw _rpcerrors.rpcErrors.internal(
      "JSON-RPC notifications must be JSON serializable objects smaller than 64 MB."
    );
  }
  await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _write, write_fn).call(this, {
    ...notification,
    jsonrpc: "2.0"
  });
};
_respond = new WeakSet();
respond_fn = async function(id, response) {
  if (!_chunkC7XBEPVOjs.isValidResponse.call(void 0, response)) {
    await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _write, write_fn).call(this, {
      error: _rpcerrors.serializeError.call(void 0, 
        _rpcerrors.rpcErrors.internal(
          "JSON-RPC responses must be JSON serializable objects smaller than 64 MB."
        )
      ),
      id,
      jsonrpc: "2.0"
    });
    return;
  }
  await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _write, write_fn).call(this, {
    ...response,
    id,
    jsonrpc: "2.0"
  });
};



exports.BaseSnapExecutor = BaseSnapExecutor;
//# sourceMappingURL=chunk-S55SWI44.js.map