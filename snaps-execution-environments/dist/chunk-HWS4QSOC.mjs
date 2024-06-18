// src/common/endowments/textEncoder.ts
var createTextEncoder = () => {
  return {
    TextEncoder: harden(TextEncoder)
  };
};
var endowmentModule = {
  names: ["TextEncoder"],
  factory: createTextEncoder
};
var textEncoder_default = endowmentModule;

export {
  textEncoder_default
};
//# sourceMappingURL=chunk-HWS4QSOC.mjs.map