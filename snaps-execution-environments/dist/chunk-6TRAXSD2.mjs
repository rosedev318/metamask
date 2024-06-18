import {
  BaseSnapExecutor
} from "./chunk-DTUHBZ7B.mjs";
import {
  log
} from "./chunk-5DEV3QQU.mjs";

// src/node-process/ChildProcessSnapExecutor.ts
import ObjectMultiplex from "@metamask/object-multiplex";
import { ProcessMessageStream } from "@metamask/post-message-stream";
import { logError, SNAP_STREAM_NAMES } from "@metamask/snaps-utils";
import { pipeline } from "readable-stream";
var ChildProcessSnapExecutor = class _ChildProcessSnapExecutor extends BaseSnapExecutor {
  static initialize() {
    log("Worker: Connecting to parent.");
    const parentStream = new ProcessMessageStream();
    const mux = new ObjectMultiplex();
    pipeline(parentStream, mux, parentStream, (error) => {
      if (error) {
        logError(`Parent stream failure, closing worker.`, error);
      }
      self.close();
    });
    const commandStream = mux.createStream(SNAP_STREAM_NAMES.COMMAND);
    const rpcStream = mux.createStream(SNAP_STREAM_NAMES.JSON_RPC);
    return new _ChildProcessSnapExecutor(commandStream, rpcStream);
  }
};

export {
  ChildProcessSnapExecutor
};
//# sourceMappingURL=chunk-6TRAXSD2.mjs.map