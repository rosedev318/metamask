"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkDLLLH5HNjs = require('./chunk-DLLLH5HN.js');

// src/common/globalEvents.ts
var _rpcerrors = require('@metamask/rpc-errors');
function addEventListener(event, listener) {
  if ("addEventListener" in _chunkDLLLH5HNjs.rootRealmGlobal && typeof _chunkDLLLH5HNjs.rootRealmGlobal.addEventListener === "function") {
    return _chunkDLLLH5HNjs.rootRealmGlobal.addEventListener(event.toLowerCase(), listener);
  }
  if (_chunkDLLLH5HNjs.rootRealmGlobal.process && "on" in _chunkDLLLH5HNjs.rootRealmGlobal.process && typeof _chunkDLLLH5HNjs.rootRealmGlobal.process.on === "function") {
    return _chunkDLLLH5HNjs.rootRealmGlobal.process.on(event, listener);
  }
  throw _rpcerrors.rpcErrors.internal("Platform agnostic addEventListener failed.");
}
function removeEventListener(event, listener) {
  if ("removeEventListener" in _chunkDLLLH5HNjs.rootRealmGlobal && typeof _chunkDLLLH5HNjs.rootRealmGlobal.removeEventListener === "function") {
    return _chunkDLLLH5HNjs.rootRealmGlobal.removeEventListener(event.toLowerCase(), listener);
  }
  if (_chunkDLLLH5HNjs.rootRealmGlobal.process && "removeListener" in _chunkDLLLH5HNjs.rootRealmGlobal.process && typeof _chunkDLLLH5HNjs.rootRealmGlobal.process.removeListener === "function") {
    return _chunkDLLLH5HNjs.rootRealmGlobal.process.removeListener(event, listener);
  }
  throw new Error("Platform agnostic removeEventListener failed");
}




exports.addEventListener = addEventListener; exports.removeEventListener = removeEventListener;
//# sourceMappingURL=chunk-2VA6RAEE.js.map