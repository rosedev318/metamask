"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkDLLLH5HNjs = require('./chunk-DLLLH5HN.js');

// src/common/endowments/date.ts
function createDate() {
  const keys = Object.getOwnPropertyNames(
    _chunkDLLLH5HNjs.rootRealmGlobal.Date
  );
  let currentTime = 0;
  const now = () => {
    const actual = _chunkDLLLH5HNjs.rootRealmGlobal.Date.now();
    const newTime = Math.round(actual + Math.random());
    if (newTime > currentTime) {
      currentTime = newTime;
    }
    return currentTime;
  };
  const NewDate = function(...args) {
    return Reflect.construct(
      _chunkDLLLH5HNjs.rootRealmGlobal.Date,
      args.length === 0 ? [now()] : args,
      new.target
    );
  };
  keys.forEach((key) => {
    Reflect.defineProperty(NewDate, key, {
      configurable: false,
      writable: false,
      value: key === "now" ? now : _chunkDLLLH5HNjs.rootRealmGlobal.Date[key]
    });
  });
  return { Date: harden(NewDate) };
}
var endowmentModule = {
  names: ["Date"],
  factory: createDate
};
var date_default = endowmentModule;



exports.date_default = date_default;
//# sourceMappingURL=chunk-QZC2X6NG.js.map