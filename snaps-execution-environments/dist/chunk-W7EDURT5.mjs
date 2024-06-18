import {
  rootRealmGlobal
} from "./chunk-IX5S3V47.mjs";

// src/common/endowments/console.ts
import { assert } from "@metamask/utils";
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
  assert(snapId !== void 0);
  const keys = Object.getOwnPropertyNames(
    rootRealmGlobal.console
  );
  const attenuatedConsole = keys.reduce((target, key) => {
    if (consoleMethods.has(key) && !consoleAttenuatedMethods.has(key)) {
      return { ...target, [key]: rootRealmGlobal.console[key] };
    }
    return target;
  }, {});
  return harden({
    console: {
      ...attenuatedConsole,
      assert: (value, message, ...optionalParams) => {
        rootRealmGlobal.console.assert(
          value,
          ...getMessage(snapId, message, ...optionalParams)
        );
      },
      ...consoleFunctions.reduce((target, key) => {
        return {
          ...target,
          [key]: (message, ...optionalParams) => {
            rootRealmGlobal.console[key](
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

export {
  consoleAttenuatedMethods,
  consoleMethods,
  console_default
};
//# sourceMappingURL=chunk-W7EDURT5.mjs.map