"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkD6MUXDVIjs = require('./chunk-D6MUXDVI.js');


var _chunkYG7W4CDTjs = require('./chunk-YG7W4CDT.js');

// src/permitted/middleware.ts
var _rpcerrors = require('@metamask/rpc-errors');
var _snapsutils = require('@metamask/snaps-utils');
function createSnapsMethodMiddleware(isSnap, hooks) {
  return async function methodMiddleware(request, response, next, end) {
    const handler = _chunkD6MUXDVIjs.methodHandlers[request.method];
    if (handler) {
      if (String.prototype.startsWith.call(request.method, "snap_") && !isSnap) {
        return end(_rpcerrors.rpcErrors.methodNotFound());
      }
      const { implementation, hookNames } = handler;
      try {
        return await implementation(
          request,
          response,
          next,
          end,
          _chunkYG7W4CDTjs.selectHooks.call(void 0, hooks, hookNames)
        );
      } catch (error) {
        _snapsutils.logError.call(void 0, error);
        return end(error);
      }
    }
    return next();
  };
}



exports.createSnapsMethodMiddleware = createSnapsMethodMiddleware;
//# sourceMappingURL=chunk-6UY23OOZ.js.map