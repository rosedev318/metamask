"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkHGLRZZ56js = require('./chunk-HGLRZZ56.js');


var _chunkDLLLH5HNjs = require('./chunk-DLLLH5HN.js');

// src/common/endowments/math.ts
function createMath() {
  const keys = Object.getOwnPropertyNames(
    _chunkDLLLH5HNjs.rootRealmGlobal.Math
  );
  const math = keys.reduce((target, key) => {
    if (key === "random") {
      return target;
    }
    return { ...target, [key]: _chunkDLLLH5HNjs.rootRealmGlobal.Math[key] };
  }, {});
  const { crypto: hardenedCrypto } = _chunkHGLRZZ56js.createCrypto.call(void 0, );
  return harden({
    Math: {
      ...math,
      random: () => {
        return hardenedCrypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
      }
    }
  });
}
var endowmentModule = {
  names: ["Math"],
  factory: createMath
};
var math_default = endowmentModule;



exports.math_default = math_default;
//# sourceMappingURL=chunk-MS2LQQYH.js.map