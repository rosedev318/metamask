"use strict";

var _chunkI5G4YFHMjs = require('../chunk-I5G4YFHM.js');


var _chunk4XRZLEKUjs = require('../chunk-4XRZLEKU.js');


var _chunkOCNPLHS2js = require('../chunk-OCNPLHS2.js');


var _chunk3JCT4MWTjs = require('../chunk-3JCT4MWT.js');
require('../chunk-EXN2TFDJ.js');

// src/webview/index.ts
_chunkOCNPLHS2js.executeLockdownMore.call(void 0, );
_chunk4XRZLEKUjs.executeLockdownEvents.call(void 0, );
var parentStream = new (0, _chunkI5G4YFHMjs.WebViewExecutorStream)({
  name: "child",
  // webview
  target: "parent",
  // rnside
  targetWindow: window.ReactNativeWebView
});
_chunk3JCT4MWTjs.ProxySnapExecutor.initialize(parentStream);
//# sourceMappingURL=index.js.map