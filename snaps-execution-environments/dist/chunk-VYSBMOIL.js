"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkHKHW6TTXjs = require('./chunk-HKHW6TTX.js');


var _chunkMS2LQQYHjs = require('./chunk-MS2LQQYH.js');


var _chunkPYVUMOEVjs = require('./chunk-PYVUMOEV.js');


var _chunkFOEAIF5Ujs = require('./chunk-FOEAIF5U.js');


var _chunkLO5ORVRCjs = require('./chunk-LO5ORVRC.js');


var _chunkB3JZNNZDjs = require('./chunk-B3JZNNZD.js');


var _chunkOBT45IWWjs = require('./chunk-OBT45IWW.js');


var _chunkHGLRZZ56js = require('./chunk-HGLRZZ56.js');


var _chunkQZC2X6NGjs = require('./chunk-QZC2X6NG.js');


var _chunkDLLLH5HNjs = require('./chunk-DLLLH5HN.js');

// src/common/endowments/commonEndowmentFactory.ts
var commonEndowments = [
  { endowment: AbortController, name: "AbortController" },
  { endowment: AbortSignal, name: "AbortSignal" },
  { endowment: ArrayBuffer, name: "ArrayBuffer" },
  { endowment: atob, name: "atob", bind: true },
  { endowment: BigInt, name: "BigInt" },
  { endowment: BigInt64Array, name: "BigInt64Array" },
  { endowment: BigUint64Array, name: "BigUint64Array" },
  { endowment: btoa, name: "btoa", bind: true },
  { endowment: DataView, name: "DataView" },
  { endowment: Float32Array, name: "Float32Array" },
  { endowment: Float64Array, name: "Float64Array" },
  { endowment: Int8Array, name: "Int8Array" },
  { endowment: Int16Array, name: "Int16Array" },
  { endowment: Int32Array, name: "Int32Array" },
  { endowment: Uint8Array, name: "Uint8Array" },
  { endowment: Uint8ClampedArray, name: "Uint8ClampedArray" },
  { endowment: Uint16Array, name: "Uint16Array" },
  { endowment: Uint32Array, name: "Uint32Array" },
  { endowment: URL, name: "URL" },
  { endowment: WebAssembly, name: "WebAssembly" }
];
var buildCommonEndowments = () => {
  const endowmentFactories = [
    _chunkHGLRZZ56js.crypto_default,
    _chunkHKHW6TTXjs.interval_default,
    _chunkMS2LQQYHjs.math_default,
    _chunkPYVUMOEVjs.network_default,
    _chunkB3JZNNZDjs.timeout_default,
    _chunkFOEAIF5Ujs.textDecoder_default,
    _chunkLO5ORVRCjs.textEncoder_default,
    _chunkQZC2X6NGjs.date_default,
    _chunkOBT45IWWjs.console_default
  ];
  commonEndowments.forEach((endowmentSpecification) => {
    const endowment = {
      names: [endowmentSpecification.name],
      factory: () => {
        const boundEndowment = typeof endowmentSpecification.endowment === "function" && endowmentSpecification.bind ? endowmentSpecification.endowment.bind(_chunkDLLLH5HNjs.rootRealmGlobal) : endowmentSpecification.endowment;
        return {
          [endowmentSpecification.name]: harden(boundEndowment)
        };
      }
    };
    endowmentFactories.push(endowment);
  });
  return endowmentFactories;
};
var commonEndowmentFactory_default = buildCommonEndowments;



exports.commonEndowmentFactory_default = commonEndowmentFactory_default;
//# sourceMappingURL=chunk-VYSBMOIL.js.map