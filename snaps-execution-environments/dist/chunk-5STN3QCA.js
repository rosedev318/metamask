"use strict";Object.defineProperty(exports, "__esModule", {value: true});




var _chunkEXN2TFDJjs = require('./chunk-EXN2TFDJ.js');

// src/webworker/pool/WebWorkerPool.ts



var _postmessagestream = require('@metamask/post-message-stream');
var _snapsutils = require('@metamask/snaps-utils');
var _utils = require('@metamask/utils');
var _nonsecure = require('nanoid/non-secure');
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
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _onData);
    /**
     * Create a new worker and set up a stream to communicate with it.
     *
     * @param jobId - The job ID.
     * @returns The job.
     */
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _initializeJob);
    /**
     * Terminate the job with the given ID. This will close the worker and delete
     * the job from the internal job map.
     *
     * @param jobId - The job ID.
     */
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _terminateJob);
    /**
     * Get a worker from the pool. A new worker will be created automatically.
     *
     * @returns The worker.
     */
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _getWorker);
    /**
     * Update the pool of workers. This will create new workers if the pool is
     * below the minimum size.
     */
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _updatePool);
    /**
     * Create a new worker. This will fetch the worker source if it has not
     * already been fetched.
     *
     * @returns The worker.
     */
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _createWorker);
    /**
     * Get the URL of the worker source. This will fetch the worker source if it
     * has not already been fetched.
     *
     * @returns The worker source URL, as a `blob:` URL.
     */
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _getWorkerURL);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _poolSize, void 0);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _stream, void 0);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _url, void 0);
    this.pool = [];
    this.jobs = /* @__PURE__ */ new Map();
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _workerSourceURL, void 0);
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _stream, stream);
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _url, url);
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _poolSize, poolSize);
    _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _stream).on("data", _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _onData, onData_fn).bind(this));
  }
  /* istanbul ignore next - Constructor arguments. */
  static initialize(stream = new (0, _postmessagestream.WindowPostMessageStream)({
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
    _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _initializeJob, initializeJob_fn).call(this, jobId).then(() => {
      _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _onData, onData_fn).call(this, data);
    }).catch((error) => {
      _snapsutils.logError.call(void 0, "[Worker] Error initializing job:", error.toString());
      _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _stream).write({
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
    _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _terminateJob, terminateJob_fn).call(this, jobId);
    return;
  }
  job.stream.write(request);
};
_initializeJob = new WeakSet();
initializeJob_fn = async function(jobId) {
  const worker = await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _getWorker, getWorker_fn).call(this);
  const jobStream = new (0, _postmessagestream.WebWorkerParentPostMessageStream)({
    worker
  });
  jobStream.on("data", (data) => {
    _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _stream).write({ data, jobId });
  });
  const job = { id: jobId, worker, stream: jobStream };
  this.jobs.set(jobId, job);
  return job;
};
_terminateJob = new WeakSet();
terminateJob_fn = function(jobId) {
  const job = this.jobs.get(jobId);
  _utils.assert.call(void 0, job, `Job "${jobId}" not found.`);
  job.stream.destroy();
  job.worker.terminate();
  this.jobs.delete(jobId);
};
_getWorker = new WeakSet();
getWorker_fn = async function() {
  if (this.pool.length === 0) {
    await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _updatePool, updatePool_fn).call(this);
  }
  const worker = this.pool.shift();
  _utils.assert.call(void 0, worker, "Worker not found.");
  await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _updatePool, updatePool_fn).call(this);
  return worker;
};
_updatePool = new WeakSet();
updatePool_fn = async function() {
  while (this.pool.length < _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _poolSize)) {
    const worker = await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _createWorker, createWorker_fn).call(this);
    this.pool.push(worker);
  }
};
_createWorker = new WeakSet();
createWorker_fn = async function() {
  return new Worker(await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _getWorkerURL, getWorkerURL_fn).call(this), {
    name: `worker-${_nonsecure.nanoid.call(void 0, )}`
  });
};
_getWorkerURL = new WeakSet();
getWorkerURL_fn = async function() {
  if (_chunkEXN2TFDJjs.__privateGet.call(void 0, this, _workerSourceURL)) {
    return _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _workerSourceURL);
  }
  const blob = await fetch(_chunkEXN2TFDJjs.__privateGet.call(void 0, this, _url)).then(async (response) => response.blob()).then(URL.createObjectURL.bind(URL));
  _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _workerSourceURL, blob);
  return blob;
};
var WebWorkerPool = _WebWorkerPool;



exports.WebWorkerPool = WebWorkerPool;
//# sourceMappingURL=chunk-5STN3QCA.js.map