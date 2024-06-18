"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _chunkS55SWI44js = require('./chunk-S55SWI44.js');


var _chunkZ7BOREC4js = require('./chunk-Z7BOREC4.js');

// src/webworker/executor/WebWorkerSnapExecutor.ts
var _objectmultiplex = require('@metamask/object-multiplex'); var _objectmultiplex2 = _interopRequireDefault(_objectmultiplex);
var _postmessagestream = require('@metamask/post-message-stream');
var _snapsutils = require('@metamask/snaps-utils');
var _readablestream = require('readable-stream');
var WebWorkerSnapExecutor = class _WebWorkerSnapExecutor extends _chunkS55SWI44js.BaseSnapExecutor {
  /**
   * Initialize the WebWorkerSnapExecutor. This creates a post message stream
   * from and to the parent window, for two-way communication with the iframe.
   *
   * @param stream - The stream to use for communication.
   * @returns An instance of `WebWorkerSnapExecutor`, with the initialized post
   * message streams.
   */
  static initialize(stream = new (0, _postmessagestream.WebWorkerPostMessageStream)()) {
    _chunkZ7BOREC4js.log.call(void 0, "Worker: Connecting to parent.");
    const mux = new (0, _objectmultiplex2.default)();
    _readablestream.pipeline.call(void 0, stream, mux, stream, (error) => {
      if (error) {
        _snapsutils.logError.call(void 0, `Parent stream failure, closing worker.`, error);
      }
      self.close();
    });
    const commandStream = mux.createStream(_snapsutils.SNAP_STREAM_NAMES.COMMAND);
    const rpcStream = mux.createStream(_snapsutils.SNAP_STREAM_NAMES.JSON_RPC);
    return new _WebWorkerSnapExecutor(commandStream, rpcStream);
  }
};



exports.WebWorkerSnapExecutor = WebWorkerSnapExecutor;
//# sourceMappingURL=chunk-CBFVKEU2.js.map