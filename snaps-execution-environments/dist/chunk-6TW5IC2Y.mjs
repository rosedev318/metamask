import {
  interval_default
} from "./chunk-ACK2JBSO.mjs";
import {
  math_default
} from "./chunk-BCBKEUCG.mjs";
import {
  network_default
} from "./chunk-3IL5HX3I.mjs";
import {
  textDecoder_default
} from "./chunk-53ZULHPK.mjs";
import {
  textEncoder_default
} from "./chunk-HWS4QSOC.mjs";
import {
  timeout_default
} from "./chunk-CWCVTRNZ.mjs";
import {
  console_default
} from "./chunk-W7EDURT5.mjs";
import {
  crypto_default
} from "./chunk-Q42NNJFY.mjs";
import {
  date_default
} from "./chunk-UOPIRTJX.mjs";
import {
  rootRealmGlobal
} from "./chunk-IX5S3V47.mjs";

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
    crypto_default,
    interval_default,
    math_default,
    network_default,
    timeout_default,
    textDecoder_default,
    textEncoder_default,
    date_default,
    console_default
  ];
  commonEndowments.forEach((endowmentSpecification) => {
    const endowment = {
      names: [endowmentSpecification.name],
      factory: () => {
        const boundEndowment = typeof endowmentSpecification.endowment === "function" && endowmentSpecification.bind ? endowmentSpecification.endowment.bind(rootRealmGlobal) : endowmentSpecification.endowment;
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

export {
  commonEndowmentFactory_default
};
//# sourceMappingURL=chunk-6TW5IC2Y.mjs.map