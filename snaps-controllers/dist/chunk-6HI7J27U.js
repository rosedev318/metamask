"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkCFTCANAKjs = require('./chunk-CFTCANAK.js');



var _chunkEXN2TFDJjs = require('./chunk-EXN2TFDJ.js');

// src/services/offscreen/OffscreenExecutionService.ts
var _postmessagestream = require('@metamask/post-message-stream');
var _createDocument, createDocument_fn;
var OffscreenExecutionService = class extends _chunkCFTCANAKjs.ProxyExecutionService {
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
  constructor({
    documentUrl,
    messenger,
    setupSnapProvider
  }) {
    super({
      messenger,
      setupSnapProvider,
      stream: new (0, _postmessagestream.BrowserRuntimePostMessageStream)({
        name: "parent",
        target: "child"
      })
    });
    /**
     * Creates the offscreen document to be used as the execution environment.
     *
     * If the document already exists, this does nothing.
     */
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _createDocument);
    this.documentUrl = documentUrl;
  }
  /**
   * Create a new stream for the specified job. This wraps the runtime stream
   * in a stream specific to the job.
   *
   * @param jobId - The job ID.
   */
  async initEnvStream(jobId) {
    await _chunkEXN2TFDJjs.__privateMethod.call(void 0, this, _createDocument, createDocument_fn).call(this);
    return super.initEnvStream(jobId);
  }
};
_createDocument = new WeakSet();
createDocument_fn = async function() {
  if (await chrome.offscreen.hasDocument()) {
    return;
  }
  await chrome.offscreen.createDocument({
    justification: "MetaMask Snaps Execution Environment",
    reasons: ["IFRAME_SCRIPTING"],
    url: this.documentUrl.toString()
  });
};



exports.OffscreenExecutionService = OffscreenExecutionService;
//# sourceMappingURL=chunk-6HI7J27U.js.map