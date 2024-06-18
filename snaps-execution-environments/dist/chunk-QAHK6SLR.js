"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _chunkS55SWI44js = require('./chunk-S55SWI44.js');


var _chunkZ7BOREC4js = require('./chunk-Z7BOREC4.js');

// src/node-process/ChildProcessSnapExecutor.ts
var _objectmultiplex = require('@metamask/object-multiplex'); var _objectmultiplex2 = _interopRequireDefault(_objectmultiplex);
var _postmessagestream = require('@metamask/post-message-stream');
var _snapsutils = require('@metamask/snaps-utils');
var _readablestream = require('readable-stream');
var ChildProcessSnapExecutor = class _ChildProcessSnapExecutor extends _chunkS55SWI44js.BaseSnapExecutor {
  static initialize() {
    _chunkZ7BOREC4js.log.call(void 0, "Worker: Connecting to parent.");
    const parentStream = new (0, _postmessagestream.ProcessMessageStream)();
    const mux = new (0, _objectmultiplex2.default)();
    _readablestream.pipeline.call(void 0, parentStream, mux, parentStream, (error) => {
      if (error) {
        _snapsutils.logError.call(void 0, `Parent stream failure, closing worker.`, error);
      }
      self.close();
    });
    const commandStream = mux.createStream(_snapsutils.SNAP_STREAM_NAMES.COMMAND);
    const rpcStream = mux.createStream(_snapsutils.SNAP_STREAM_NAMES.JSON_RPC);
    return new _ChildProcessSnapExecutor(commandStream, rpcStream);
  }
};



exports.ChildProcessSnapExecutor = ChildProcessSnapExecutor;
//# sourceMappingURL=chunk-QAHK6SLR.js.map