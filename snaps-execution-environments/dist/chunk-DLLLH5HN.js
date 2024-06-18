"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/common/globalObject.ts
var _rootRealmGlobal;
var _rootRealmGlobalName;
if (typeof globalThis !== "undefined") {
  _rootRealmGlobal = globalThis;
  _rootRealmGlobalName = "globalThis" /* globalThis */;
} else if (typeof self !== "undefined") {
  _rootRealmGlobal = self;
  _rootRealmGlobalName = "self" /* self */;
} else if (typeof window !== "undefined") {
  _rootRealmGlobal = window;
  _rootRealmGlobalName = "window" /* window */;
} else if (typeof global !== "undefined") {
  _rootRealmGlobal = global;
  _rootRealmGlobalName = "global" /* global */;
} else {
  throw new Error("Unknown realm type; failed to identify global object.");
}
var rootRealmGlobal = _rootRealmGlobal;
var rootRealmGlobalName = _rootRealmGlobalName;




exports.rootRealmGlobal = rootRealmGlobal; exports.rootRealmGlobalName = rootRealmGlobalName;
//# sourceMappingURL=chunk-DLLLH5HN.js.map