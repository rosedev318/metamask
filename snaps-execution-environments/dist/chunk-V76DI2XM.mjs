import {
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet
} from "./chunk-YRZVIDCF.mjs";

// src/webworker/pool/WebWorkerPool.ts
import {
  WebWorkerParentPostMessageStream,
  WindowPostMessageStream
} from "@metamask/post-message-stream";
import { logError } from "@metamask/snaps-utils";
import { assert } from "@metamask/utils";
import { nanoid } from "nanoid/non-secure";
var _poolSize, _stream, _url, _workerSourceURL, _onData, onData_fn, _initializeJob, initializeJob_fn, _terminateJob, terminateJob_fn, _getWorker, getWorker_fn, _updatePool, updatePool_fn, _createWorker, createWorker_fn, _getWorkerURL, getWorkerURL_fn;
var _WebWorkerPool = class _WebWorkerPool {
  constructor(stream, url, poolSize = 3) {
    /**
     * Handle an incoming message from the `WebWorkerExecutionService`. This
     * assumes that the message contains a `jobId` property, and a JSON-RPC
     * request in the `data` property.
     *
     * @param data - The message data.
     * @param data.data - The JSON-RPC request.
     * @param data.jobId - The job ID.
     */
    __privateAdd(this, _onData);
    /**
     * Create a new worker and set up a stream to communicate with it.
     *
     * @param jobId - The job ID.
     * @returns The job.
     */
    __privateAdd(this, _initializeJob);
    /**
     * Terminate the job with the given ID. This will close the worker and delete
     * the job from the internal job map.
     *
     * @param jobId - The job ID.
     */
    __privateAdd(this, _terminateJob);
    /**
     * Get a worker from the pool. A new worker will be created automatically.
     *
     * @returns The worker.
     */
    __privateAdd(this, _getWorker);
    /**
     * Update the pool of workers. This will create new workers if the pool is
     * below the minimum size.
     */
    __privateAdd(this, _updatePool);
    /**
     * Create a new worker. This will fetch the worker source if it has not
     * already been fetched.
     *
     * @returns The worker.
     */
    __privateAdd(this, _createWorker);
    /**
     * Get the URL of the worker source. This will fetch the worker source if it
     * has not already been fetched.
     *
     * @returns The worker source URL, as a `blob:` URL.
     */
    __privateAdd(this, _getWorkerURL);
    __privateAdd(this, _poolSize, void 0);
    __privateAdd(this, _stream, void 0);
    __privateAdd(this, _url, void 0);
    this.pool = [];
    this.jobs = /* @__PURE__ */ new Map();
    __privateAdd(this, _workerSourceURL, void 0);
    __privateSet(this, _stream, stream);
    __privateSet(this, _url, url);
    __privateSet(this, _poolSize, poolSize);
    __privateGet(this, _stream).on("data", __privateMethod(this, _onData, onData_fn).bind(this));
  }
  /* istanbul ignore next - Constructor arguments. */
  static initialize(stream = new WindowPostMessageStream({
    name: "child",
    target: "parent",
    targetWindow: self.parent,
    targetOrigin: "*"
  }), url = "../executor/bundle.js", poolSize) {
    return new _WebWorkerPool(stream, url, poolSize);
  }
};
_poolSize = new WeakMap();
_stream = new WeakMap();
_url = new WeakMap();
_workerSourceURL = new WeakMap();
_onData = new WeakSet();
onData_fn = function(data) {
  const { jobId, data: request } = data;
  const job = this.jobs.get(jobId);
  if (!job) {
    __privateMethod(this, _initializeJob, initializeJob_fn).call(this, jobId).then(() => {
      __privateMethod(this, _onData, onData_fn).call(this, data);
    }).catch((error) => {
      logError("[Worker] Error initializing job:", error.toString());
      __privateGet(this, _stream).write({
        jobId,
        data: {
          name: "command",
          data: {
            jsonrpc: "2.0",
            id: request.id ?? null,
            error: {
              code: -32e3,
              message: "Internal error"
            }
          }
        }
      });
    });
    return;
  }
  if (request.method === "terminateJob") {
    __privateMethod(this, _terminateJob, terminateJob_fn).call(this, jobId);
    return;
  }
  job.stream.write(request);
};
_initializeJob = new WeakSet();
initializeJob_fn = async function(jobId) {
  const worker = await __privateMethod(this, _getWorker, getWorker_fn).call(this);
  const jobStream = new WebWorkerParentPostMessageStream({
    worker
  });
  jobStream.on("data", (data) => {
    __privateGet(this, _stream).write({ data, jobId });
  });
  const job = { id: jobId, worker, stream: jobStream };
  this.jobs.set(jobId, job);
  return job;
};
_terminateJob = new WeakSet();
terminateJob_fn = function(jobId) {
  const job = this.jobs.get(jobId);
  assert(job, `Job "${jobId}" not found.`);
  job.stream.destroy();
  job.worker.terminate();
  this.jobs.delete(jobId);
};
_getWorker = new WeakSet();
getWorker_fn = async function() {
  if (this.pool.length === 0) {
    await __privateMethod(this, _updatePool, updatePool_fn).call(this);
  }
  const worker = this.pool.shift();
  assert(worker, "Worker not found.");
  await __privateMethod(this, _updatePool, updatePool_fn).call(this);
  return worker;
};
_updatePool = new WeakSet();
updatePool_fn = async function() {
  while (this.pool.length < __privateGet(this, _poolSize)) {
    const worker = await __privateMethod(this, _createWorker, createWorker_fn).call(this);
    this.pool.push(worker);
  }
};
_createWorker = new WeakSet();
createWorker_fn = async function() {
  return new Worker(await __privateMethod(this, _getWorkerURL, getWorkerURL_fn).call(this), {
    name: `worker-${nanoid()}`
  });
};
_getWorkerURL = new WeakSet();
getWorkerURL_fn = async function() {
  if (__privateGet(this, _workerSourceURL)) {
    return __privateGet(this, _workerSourceURL);
  }
  const blob = await fetch(__privateGet(this, _url)).then(async (response) => response.blob()).then(URL.createObjectURL.bind(URL));
  __privateSet(this, _workerSourceURL, blob);
  return blob;
};
var WebWorkerPool = _WebWorkerPool;

export {
  WebWorkerPool
};
//# sourceMappingURL=chunk-V76DI2XM.mjs.map