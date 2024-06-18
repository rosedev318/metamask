"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkDLLLH5HNjs = require('./chunk-DLLLH5HN.js');

// src/common/endowments/console.ts
var _utils = require('@metamask/utils');
var consoleAttenuatedMethods = /* @__PURE__ */ new Set([
  "log",
  "assert",
  "error",
  "debug",
  "info",
  "warn"
]);
var consoleMethods = /* @__PURE__ */ new Set([
  "debug",
  "error",
  "info",
  "log",
  "warn",
  "dir",
  "dirxml",
  "table",
  "trace",
  "group",
  "groupCollapsed",
  "groupEnd",
  "clear",
  "count",
  "countReset",
  "assert",
  "profile",
  "profileEnd",
  "time",
  "timeLog",
  "timeEnd",
  "timeStamp",
  "context"
]);
var consoleFunctions = ["log", "error", "debug", "info", "warn"];
function getMessage(snapId, message, ...args) {
  const prefix = `[Snap: ${snapId}]`;
  if (typeof message === "string") {
    return [`${prefix} ${message}`, ...args];
  }
  return [prefix, message, ...args];
}
function createConsole({ snapId } = {}) {
  _utils.assert.call(void 0, snapId !== void 0);
  const keys = Object.getOwnPropertyNames(
    _chunkDLLLH5HNjs.rootRealmGlobal.console
  );
  const attenuatedConsole = keys.reduce((target, key) => {
    if (consoleMethods.has(key) && !consoleAttenuatedMethods.has(key)) {
      return { ...target, [key]: _chunkDLLLH5HNjs.rootRealmGlobal.console[key] };
    }
    return target;
  }, {});
  return harden({
    console: {
      ...attenuatedConsole,
      assert: (value, message, ...optionalParams) => {
        _chunkDLLLH5HNjs.rootRealmGlobal.console.assert(
          value,
          ...getMessage(snapId, message, ...optionalParams)
        );
      },
      ...consoleFunctions.reduce((target, key) => {
        return {
          ...target,
          [key]: (message, ...optionalParams) => {
            _chunkDLLLH5HNjs.rootRealmGlobal.console[key](
              ...getMessage(snapId, message, ...optionalParams)
            );
          }
        };
      }, {})
    }
  });
}
var endowmentModule = {
  names: ["console"],
  factory: createConsole
};
var console_default = endowmentModule;





exports.consoleAttenuatedMethods = consoleAttenuatedMethods; exports.consoleMethods = consoleMethods; exports.console_default = console_default;
//# sourceMappingURL=chunk-OBT45IWW.js.map