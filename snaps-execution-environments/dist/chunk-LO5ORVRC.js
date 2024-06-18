"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/common/endowments/textEncoder.ts
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



exports.textEncoder_default = textEncoder_default;
//# sourceMappingURL=chunk-LO5ORVRC.js.map