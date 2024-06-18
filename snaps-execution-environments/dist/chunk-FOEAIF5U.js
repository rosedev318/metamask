"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/common/endowments/textDecoder.ts
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



exports.textDecoder_default = textDecoder_default;
//# sourceMappingURL=chunk-FOEAIF5U.js.map