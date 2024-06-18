import {
  BaseSnapExecutor
} from "./chunk-DTUHBZ7B.mjs";
import {
  log
} from "./chunk-5DEV3QQU.mjs";

// src/iframe/IFrameSnapExecutor.ts
import ObjectMultiplex from "@metamask/object-multiplex";
import { WindowPostMessageStream } from "@metamask/post-message-stream";
import { logError, SNAP_STREAM_NAMES } from "@metamask/snaps-utils";
import { pipeline } from "readable-stream";
var IFrameSnapExecutor = class _IFrameSnapExecutor extends BaseSnapExecutor {
  /**
   * Initialize the IFrameSnapExecutor. This creates a post message stream from
   * and to the parent window, for two-way communication with the iframe.
   *
   * @param stream - The stream to use for communication.
   * @returns An instance of `IFrameSnapExecutor`, with the initialized post
   * message streams.
   */
  static initialize(stream = new WindowPostMessageStream({
    name: "child",
    target: "parent",
    targetWindow: self.parent,
    targetOrigin: "*"
  })) {
    log("Worker: Connecting to parent.");
    const mux = new ObjectMultiplex();
    pipeline(stream, mux, stream, (error) => {
      if (error) {
        logError(`Parent stream failure, closing worker.`, error);
      }
      self.close();
    });
    const commandStream = mux.createStream(SNAP_STREAM_NAMES.COMMAND);
    const rpcStream = mux.createStream(SNAP_STREAM_NAMES.JSON_RPC);
    return new _IFrameSnapExecutor(commandStream, rpcStream);
  }
};

export {
  IFrameSnapExecutor
};
//# sourceMappingURL=chunk-G2KQG3ZY.mjs.map