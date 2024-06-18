import {
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet
} from "./chunk-YRZVIDCF.mjs";

// src/proxy/ProxySnapExecutor.ts
import { WindowPostMessageStream } from "@metamask/post-message-stream";
import packageJson from "@metamask/snaps-execution-environments/package.json";
import { createWindow, logError } from "@metamask/snaps-utils";
import { assert } from "@metamask/utils";
var IFRAME_URL = `https://execution.metamask.io/iframe/${packageJson.version}/index.html`;
var _stream, _frameUrl, _onData, onData_fn, _initializeJob, initializeJob_fn, _terminateJob, terminateJob_fn;
var _ProxySnapExecutor = class _ProxySnapExecutor {
  constructor(stream, frameUrl) {
    /**
     * Handle an incoming message from a `ProxyExecutionService`. This
     * assumes that the message contains a `jobId` property, and a JSON-RPC
     * request in the `data` property.
     *
     * @param data - The message data.
     * @param data.data - The JSON-RPC request.
     * @param data.jobId - The job ID.
     */
    __privateAdd(this, _onData);
    /**
     * Create a new iframe and set up a stream to communicate with it.
     *
     * @param jobId - The job ID.
     */
    __privateAdd(this, _initializeJob);
    /**
     * Terminate the job with the given ID. This will close the iframe and delete
     * the job from the internal job map.
     *
     * @param jobId - The job ID.
     */
    __privateAdd(this, _terminateJob);
    __privateAdd(this, _stream, void 0);
    __privateAdd(this, _frameUrl, void 0);
    this.jobs = {};
    __privateSet(this, _stream, stream);
    __privateGet(this, _stream).on("data", __privateMethod(this, _onData, onData_fn).bind(this));
    __privateSet(this, _frameUrl, frameUrl);
  }
  /**
   * Initialize the executor with the given stream. This is a wrapper around the
   * constructor.
   *
   * @param stream - The stream to use for communication.
   * @param frameUrl - An optional URL for the iframe to use.
   * @returns The initialized executor.
   */
  static initialize(stream, frameUrl = IFRAME_URL) {
    return new _ProxySnapExecutor(stream, frameUrl);
  }
};
_stream = new WeakMap();
_frameUrl = new WeakMap();
_onData = new WeakSet();
onData_fn = function(data) {
  const { jobId, data: request } = data;
  if (!this.jobs[jobId]) {
    __privateMethod(this, _initializeJob, initializeJob_fn).call(this, jobId).then(() => {
      __privateMethod(this, _onData, onData_fn).call(this, data);
    }).catch((error) => {
      logError("[Worker] Error initializing job:", error);
    });
    return;
  }
  if (request.method === "terminateJob") {
    __privateMethod(this, _terminateJob, terminateJob_fn).call(this, jobId);
    return;
  }
  this.jobs[jobId].stream.write(request);
};
_initializeJob = new WeakSet();
initializeJob_fn = async function(jobId) {
  const window = await createWindow(__privateGet(this, _frameUrl), jobId);
  const jobStream = new WindowPostMessageStream({
    name: "parent",
    target: "child",
    targetWindow: window,
    // iframe's internal window
    targetOrigin: "*"
  });
  jobStream.on("data", (data) => {
    __privateGet(this, _stream).write({ data, jobId });
  });
  this.jobs[jobId] = { id: jobId, window, stream: jobStream };
  return this.jobs[jobId];
};
_terminateJob = new WeakSet();
terminateJob_fn = function(jobId) {
  assert(this.jobs[jobId], `Job "${jobId}" not found.`);
  const iframe = document.getElementById(jobId);
  assert(iframe, `Iframe with ID "${jobId}" not found.`);
  iframe.remove();
  this.jobs[jobId].stream.destroy();
  delete this.jobs[jobId];
};
var ProxySnapExecutor = _ProxySnapExecutor;

export {
  ProxySnapExecutor
};
//# sourceMappingURL=chunk-MIWGLICQ.mjs.map