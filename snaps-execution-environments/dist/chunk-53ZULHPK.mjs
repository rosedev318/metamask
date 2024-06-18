// src/common/endowments/textDecoder.ts
var createTextDecoder = () => {
  return {
    TextDecoder: harden(TextDecoder)
  };
};
var endowmentModule = {
  names: ["TextDecoder"],
  factory: createTextDecoder
};
var textDecoder_default = endowmentModule;

export {
  textDecoder_default
};
//# sourceMappingURL=chunk-53ZULHPK.mjs.map