import {
  rootRealmGlobal
} from "./chunk-IX5S3V47.mjs";
import {
  __require
} from "./chunk-YRZVIDCF.mjs";

// src/common/endowments/crypto.ts
var createCrypto = () => {
  if ("crypto" in rootRealmGlobal && typeof rootRealmGlobal.crypto === "object" && "SubtleCrypto" in rootRealmGlobal && typeof rootRealmGlobal.SubtleCrypto === "function") {
    return {
      crypto: harden(rootRealmGlobal.crypto),
      SubtleCrypto: harden(rootRealmGlobal.SubtleCrypto)
    };
  }
  const crypto = __require("crypto").webcrypto;
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

export {
  createCrypto,
  crypto_default
};
//# sourceMappingURL=chunk-Q42NNJFY.mjs.map