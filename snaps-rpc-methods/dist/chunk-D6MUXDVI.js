"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkAOWUGDERjs = require('./chunk-AOWUGDER.js');


var _chunkIDZGMGIBjs = require('./chunk-IDZGMGIB.js');


var _chunkPS6OEQXLjs = require('./chunk-PS6OEQXL.js');


var _chunkGP5KW5FUjs = require('./chunk-GP5KW5FU.js');


var _chunk3LPBU737js = require('./chunk-3LPBU737.js');


var _chunk4LSOS7SMjs = require('./chunk-4LSOS7SM.js');


var _chunk3UAWEHMFjs = require('./chunk-3UAWEHMF.js');


var _chunkNP3KGMVCjs = require('./chunk-NP3KGMVC.js');


var _chunk4W7U4OH6js = require('./chunk-4W7U4OH6.js');


var _chunkNWT2EXFDjs = require('./chunk-NWT2EXFD.js');

// src/permitted/handlers.ts
var methodHandlers = {
  wallet_getAllSnaps: _chunk4LSOS7SMjs.getAllSnapsHandler,
  wallet_getSnaps: _chunkNWT2EXFDjs.getSnapsHandler,
  wallet_requestSnaps: _chunkPS6OEQXLjs.requestSnapsHandler,
  wallet_invokeSnap: _chunkIDZGMGIBjs.invokeSnapSugarHandler,
  wallet_invokeKeyring: _chunkAOWUGDERjs.invokeKeyringHandler,
  snap_getClientStatus: _chunk3UAWEHMFjs.getClientStatusHandler,
  snap_getFile: _chunkNP3KGMVCjs.getFileHandler,
  snap_createInterface: _chunk3LPBU737js.createInterfaceHandler,
  snap_updateInterface: _chunkGP5KW5FUjs.updateInterfaceHandler,
  snap_getInterfaceState: _chunk4W7U4OH6js.getInterfaceStateHandler
};
var handlers = Object.values(methodHandlers);




exports.methodHandlers = methodHandlers; exports.handlers = handlers;
//# sourceMappingURL=chunk-D6MUXDVI.js.map