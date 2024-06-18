import {
  BaseSnapExecutor
} from "./chunk-DTUHBZ7B.mjs";
import {
  log
} from "./chunk-5DEV3QQU.mjs";

// src/node-thread/ThreadSnapExecutor.ts
import ObjectMultiplex from "@metamask/object-multiplex";
import { ThreadMessageStream } from "@metamask/post-message-stream";
import { logError, SNAP_STREAM_NAMES } from "@metamask/snaps-utils";
import { pipeline } from "readable-stream";
var ThreadSnapExecutor = class _ThreadSnapExecutor extends BaseSnapExecutor {
  static initialize() {
    log("Worker: Connecting to parent.");
    const parentStream = new ThreadMessageStream();
    const mux = new ObjectMultiplex();
    pipeline(parentStream, mux, parentStream, (error) => {
      if (error) {
        logError(`Parent stream failure, closing worker.`, error);
      }
      self.close();
    });
    const commandStream = mux.createStream(SNAP_STREAM_NAMES.COMMAND);
    const rpcStream = mux.createStream(SNAP_STREAM_NAMES.JSON_RPC);
    return new _ThreadSnapExecutor(commandStream, rpcStream);
  }
};

export {
  ThreadSnapExecutor
};
//# sourceMappingURL=chunk-4DDRUOJT.mjs.map