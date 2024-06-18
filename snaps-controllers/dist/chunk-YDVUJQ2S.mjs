import {
  ProxyExecutionService
} from "./chunk-KEEKVE7E.mjs";
import {
  __privateAdd,
  __privateMethod
} from "./chunk-YRZVIDCF.mjs";

// src/services/offscreen/OffscreenExecutionService.ts
import { BrowserRuntimePostMessageStream } from "@metamask/post-message-stream";
var _createDocument, createDocument_fn;
var OffscreenExecutionService = class extends ProxyExecutionService {
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
      stream: new BrowserRuntimePostMessageStream({
        name: "parent",
        target: "child"
      })
    });
    /**
     * Creates the offscreen document to be used as the execution environment.
     *
     * If the document already exists, this does nothing.
     */
    __privateAdd(this, _createDocument);
    this.documentUrl = documentUrl;
  }
  /**
   * Create a new stream for the specified job. This wraps the runtime stream
   * in a stream specific to the job.
   *
   * @param jobId - The job ID.
   */
  async initEnvStream(jobId) {
    await __privateMethod(this, _createDocument, createDocument_fn).call(this);
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

export {
  OffscreenExecutionService
};
//# sourceMappingURL=chunk-YDVUJQ2S.mjs.map