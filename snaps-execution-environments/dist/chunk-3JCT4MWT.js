"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }




var _chunkEXN2TFDJjs = require('./chunk-EXN2TFDJ.js');

// src/proxy/ProxySnapExecutor.ts
var _postmessagestream = require('@metamask/post-message-stream');
var _packagejson = require('@metamask/snaps-execution-environments/package.json'); var _packagejson2 = _interopRequireDefault(_packagejson);
var _snapsutils = require('@metamask/snaps-utils');
var _utils = require('@metamask/utils');
var IFRAME_URL = `https://execution.metamask.io/iframe/${_packagejson2.default.version}/index.html`;
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
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _onData);
    /**
     * Create a new iframe and set up a stream to communicate with it.
     *
     * @param jobId - The job ID.
     */
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _initializeJob);
    /**
     * Terminate the job with the given ID. This will close the iframe and delete
     * the job from the internal job map.
     *
     * @param jobId - The job ID.
     */
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _terminateJob);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _stream, void 0);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _frameUrl, void 0);
    this.jobs = {};
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _stream, stream);
    _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _stream).on("data", _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _onData, onData_fn).bind(this));
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _frameUrl, frameUrl);
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
    _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _initializeJob, initializeJob_fn).call(this, jobId).then(() => {
      _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _onData, onData_fn).call(this, data);
    }).catch((error) => {
      _snapsutils.logError.call(void 0, "[Worker] Error initializing job:", error);
    });
    return;
  }
  if (request.method === "terminateJob") {
    _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _terminateJob, terminateJob_fn).call(this, jobId);
    return;
  }
  this.jobs[jobId].stream.write(request);
};
_initializeJob = new WeakSet();
initializeJob_fn = async function(jobId) {
  const window = await _snapsutils.createWindow.call(void 0, _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _frameUrl), jobId);
  const jobStream = new (0, _postmessagestream.WindowPostMessageStream)({
    name: "parent",
    target: "child",
    targetWindow: window,
    // iframe's internal window
    targetOrigin: "*"
  });
  jobStream.on("data", (data) => {
    _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _stream).write({ data, jobId });
  });
  this.jobs[jobId] = { id: jobId, window, stream: jobStream };
  return this.jobs[jobId];
};
_terminateJob = new WeakSet();
terminateJob_fn = function(jobId) {
  _utils.assert.call(void 0, this.jobs[jobId], `Job "${jobId}" not found.`);
  const iframe = document.getElementById(jobId);
  _utils.assert.call(void 0, iframe, `Iframe with ID "${jobId}" not found.`);
  iframe.remove();
  this.jobs[jobId].stream.destroy();
  delete this.jobs[jobId];
};
var ProxySnapExecutor = _ProxySnapExecutor;



exports.ProxySnapExecutor = ProxySnapExecutor;
//# sourceMappingURL=chunk-3JCT4MWT.js.map