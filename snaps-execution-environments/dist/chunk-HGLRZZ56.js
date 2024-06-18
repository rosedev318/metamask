"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkDLLLH5HNjs = require('./chunk-DLLLH5HN.js');


var _chunkEXN2TFDJjs = require('./chunk-EXN2TFDJ.js');

// src/common/endowments/crypto.ts
var createCrypto = () => {
  if ("crypto" in _chunkDLLLH5HNjs.rootRealmGlobal && typeof _chunkDLLLH5HNjs.rootRealmGlobal.crypto === "object" && "SubtleCrypto" in _chunkDLLLH5HNjs.rootRealmGlobal && typeof _chunkDLLLH5HNjs.rootRealmGlobal.SubtleCrypto === "function") {
    return {
      crypto: harden(_chunkDLLLH5HNjs.rootRealmGlobal.crypto),
      SubtleCrypto: harden(_chunkDLLLH5HNjs.rootRealmGlobal.SubtleCrypto)
    };
  }
  const crypto = _chunkEXN2TFDJjs.__require.call(void 0, "crypto").webcrypto;
  return {
    crypto: harden(crypto),
    SubtleCrypto: harden(crypto.subtle.constructor)
  };
};
var endowmentModule = {
  names: ["crypto", "SubtleCrypto"],
  factory: createCrypto
};
var crypto_default = endowmentModule;




exports.createCrypto = createCrypto; exports.crypto_default = crypto_default;
//# sourceMappingURL=chunk-HGLRZZ56.js.map