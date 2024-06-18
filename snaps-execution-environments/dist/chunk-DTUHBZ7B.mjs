import {
  createEndowments
} from "./chunk-VV2DBGFP.mjs";
import {
  assertEthereumOutboundRequest,
  assertSnapOutboundRequest,
  isValidResponse,
  proxyStreamProvider,
  sanitizeRequestArguments,
  withTeardown
} from "./chunk-HBVPZMDK.mjs";
import {
  log
} from "./chunk-5DEV3QQU.mjs";
import {
  getCommandMethodImplementations
} from "./chunk-MM6ZSW4E.mjs";
import {
  ExecuteSnapRequestArgumentsStruct,
  PingRequestArgumentsStruct,
  SnapRpcRequestArgumentsStruct,
  TerminateRequestArgumentsStruct
} from "./chunk-WV3CXIKN.mjs";
import {
  addEventListener,
  removeEventListener
} from "./chunk-ZNTCZK7J.mjs";
import {
  sortParamKeys
} from "./chunk-BTEAZZKP.mjs";
import {
  __privateAdd,
  __privateMethod
} from "./chunk-YRZVIDCF.mjs";

// src/common/BaseSnapExecutor.ts
import { createIdRemapMiddleware } from "@metamask/json-rpc-engine";
import { StreamProvider } from "@metamask/providers/dist/StreamProvider";
import { errorCodes, rpcErrors, serializeError } from "@metamask/rpc-errors";
import { getErrorData } from "@metamask/snaps-sdk";
import {
  SNAP_EXPORT_NAMES,
  logError,
  SNAP_EXPORTS,
  WrappedSnapError,
  unwrapError,
  logInfo
} from "@metamask/snaps-utils";
import {
  assert,
  isJsonRpcRequest,
  hasProperty,
  getSafeJson,
  JsonRpcIdStruct
} from "@metamask/utils";
import { validate, is } from "superstruct";
var fallbackError = {
  code: errorCodes.rpc.internal,
  message: "Execution Environment Error"
};
var unhandledError = rpcErrors.internal({
  message: "Unhandled Snap Error"
}).serialize();
var EXECUTION_ENVIRONMENT_METHODS = {
  ping: {
    struct: PingRequestArgumentsStruct,
    params: []
  },
  executeSnap: {
    struct: ExecuteSnapRequestArgumentsStruct,
    params: ["snapId", "sourceCode", "endowments"]
  },
  terminate: {
    struct: TerminateRequestArgumentsStruct,
    params: []
  },
  snapRpc: {
    struct: SnapRpcRequestArgumentsStruct,
    params: ["target", "handler", "origin", "request"]
  }
};
var _write, write_fn, _notify, notify_fn, _respond, respond_fn;
var BaseSnapExecutor = class {
  constructor(commandStream, rpcStream) {
    // Awaitable function that writes back to the command stream
    // To prevent snap execution from blocking writing we wrap in a promise
    // and await it before continuing execution
    __privateAdd(this, _write);
    __privateAdd(this, _notify);
    __privateAdd(this, _respond);
    this.lastTeardown = 0;
    this.snapData = /* @__PURE__ */ new Map();
    this.commandStream = commandStream;
    this.commandStream.on("data", (data) => {
      this.onCommandRequest(data).catch((error) => {
        logError(error);
      });
    });
    this.rpcStream = rpcStream;
    this.methods = getCommandMethodImplementations(
      this.startSnap.bind(this),
      async (target, handlerType, args) => {
        const data = this.snapData.get(target);
        const handler = data?.exports[handlerType];
        const { required } = SNAP_EXPORTS[handlerType];
        assert(
          !required || handler !== void 0,
          `No ${handlerType} handler exported for snap "${target}`,
          rpcErrors.methodNotSupported
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
          return getSafeJson(result);
        } catch (error) {
          throw rpcErrors.internal(
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
    const serializedError = serializeError(error, {
      fallbackError: unhandledError,
      shouldIncludeStack: false
    });
    const errorData = getErrorData(serializedError);
    __privateMethod(this, _notify, notify_fn).call(this, {
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
      logError(notifyError);
    });
  }
  async onCommandRequest(message) {
    if (!isJsonRpcRequest(message)) {
      if (hasProperty(message, "id") && is(message.id, JsonRpcIdStruct)) {
        await __privateMethod(this, _write, write_fn).call(this, {
          error: serializeError(
            rpcErrors.internal(
              "JSON-RPC requests must be JSON serializable objects."
            )
          ),
          id: message.id,
          jsonrpc: "2.0"
        });
      } else {
        logInfo(
          "Command stream received a non-JSON-RPC request, and was unable to respond."
        );
      }
      return;
    }
    const { id, method, params } = message;
    if (!hasProperty(EXECUTION_ENVIRONMENT_METHODS, method)) {
      await __privateMethod(this, _respond, respond_fn).call(this, id, {
        error: rpcErrors.methodNotFound({
          data: {
            method
          }
        }).serialize()
      });
      return;
    }
    const methodObject = EXECUTION_ENVIRONMENT_METHODS[method];
    const paramsAsArray = sortParamKeys(methodObject.params, params);
    const [error] = validate(paramsAsArray, methodObject.struct);
    if (error) {
      await __privateMethod(this, _respond, respond_fn).call(this, id, {
        error: rpcErrors.invalidParams({
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
      await __privateMethod(this, _respond, respond_fn).call(this, id, { result });
    } catch (rpcError) {
      await __privateMethod(this, _respond, respond_fn).call(this, id, {
        error: serializeError(rpcError, {
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
    log(`Starting snap '${snapId}' in worker.`);
    if (this.snapPromiseErrorHandler) {
      removeEventListener("unhandledrejection", this.snapPromiseErrorHandler);
    }
    if (this.snapErrorHandler) {
      removeEventListener("error", this.snapErrorHandler);
    }
    this.snapErrorHandler = (error) => {
      this.errorHandler(error.error, { snapId });
    };
    this.snapPromiseErrorHandler = (error) => {
      this.errorHandler(error instanceof Error ? error : error.reason, {
        snapId
      });
    };
    const provider = new StreamProvider(this.rpcStream, {
      jsonRpcStreamName: "metamask-provider",
      rpcMiddleware: [createIdRemapMiddleware()]
    });
    await provider.initialize();
    const snap = this.createSnapGlobal(provider);
    const ethereum = this.createEIP1193Provider(provider);
    const snapModule = { exports: {} };
    try {
      const { endowments, teardown: endowmentTeardown } = createEndowments({
        snap,
        ethereum,
        snapId,
        endowments: _endowments,
        notify: __privateMethod(this, _notify, notify_fn).bind(this)
      });
      this.snapData.set(snapId, {
        idleTeardown: endowmentTeardown,
        runningEvaluations: /* @__PURE__ */ new Set(),
        exports: {}
      });
      addEventListener("unhandledRejection", this.snapPromiseErrorHandler);
      addEventListener("error", this.snapErrorHandler);
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
      const [cause] = unwrapError(error);
      throw rpcErrors.internal({
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
    data.exports = SNAP_EXPORT_NAMES.reduce((acc, exportName) => {
      const snapExport = snapModule.exports[exportName];
      const { validator } = SNAP_EXPORTS[exportName];
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
      const sanitizedArgs = sanitizeRequestArguments(args);
      assertSnapOutboundRequest(sanitizedArgs);
      return await withTeardown(
        (async () => {
          await __privateMethod(this, _notify, notify_fn).call(this, {
            method: "OutboundRequest",
            params: { source: "snap.request" }
          });
          try {
            return await originalRequest(sanitizedArgs);
          } finally {
            await __privateMethod(this, _notify, notify_fn).call(this, {
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
      const sanitizedArgs = sanitizeRequestArguments(args);
      assertEthereumOutboundRequest(sanitizedArgs);
      return await withTeardown(
        (async () => {
          await __privateMethod(this, _notify, notify_fn).call(this, {
            method: "OutboundRequest",
            params: { source: "ethereum.request" }
          });
          try {
            return await originalRequest(sanitizedArgs);
          } finally {
            await __privateMethod(this, _notify, notify_fn).call(this, {
              method: "OutboundResponse",
              params: { source: "ethereum.request" }
            });
          }
        })(),
        this
      );
    };
    const streamProviderProxy = proxyStreamProvider(provider, request);
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
      throw rpcErrors.internal(
        `Tried to execute in context of unknown snap: "${snapId}".`
      );
    }
    let stop;
    const stopPromise = new Promise(
      (_, reject) => stop = () => reject(
        // TODO(rekmarks): Specify / standardize error code for this case.
        rpcErrors.internal(
          `The snap "${snapId}" has been terminated during execution.`
        )
      )
    );
    const evaluationData = { stop };
    try {
      data.runningEvaluations.add(evaluationData);
      return await Promise.race([executor(), stopPromise]);
    } catch (error) {
      throw new WrappedSnapError(error);
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
  if (!isValidResponse(notification)) {
    throw rpcErrors.internal(
      "JSON-RPC notifications must be JSON serializable objects smaller than 64 MB."
    );
  }
  await __privateMethod(this, _write, write_fn).call(this, {
    ...notification,
    jsonrpc: "2.0"
  });
};
_respond = new WeakSet();
respond_fn = async function(id, response) {
  if (!isValidResponse(response)) {
    await __privateMethod(this, _write, write_fn).call(this, {
      error: serializeError(
        rpcErrors.internal(
          "JSON-RPC responses must be JSON serializable objects smaller than 64 MB."
        )
      ),
      id,
      jsonrpc: "2.0"
    });
    return;
  }
  await __privateMethod(this, _write, write_fn).call(this, {
    ...response,
    id,
    jsonrpc: "2.0"
  });
};

export {
  BaseSnapExecutor
};
//# sourceMappingURL=chunk-DTUHBZ7B.mjs.map