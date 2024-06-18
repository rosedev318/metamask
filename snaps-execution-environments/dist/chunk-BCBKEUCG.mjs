import {
  createCrypto
} from "./chunk-Q42NNJFY.mjs";
import {
  rootRealmGlobal
} from "./chunk-IX5S3V47.mjs";

// src/common/endowments/math.ts
function createMath() {
  const keys = Object.getOwnPropertyNames(
    rootRealmGlobal.Math
  );
  const math = keys.reduce((target, key) => {
    if (key === "random") {
      return target;
    }
    return { ...target, [key]: rootRealmGlobal.Math[key] };
  }, {});
  const { crypto: hardenedCrypto } = createCrypto();
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

export {
  math_default
};
//# sourceMappingURL=chunk-BCBKEUCG.mjs.map