import {
  PermittedCoinTypesCaveatSpecification,
  permittedCoinTypesCaveatMapper
} from "./chunk-EKXDFYIX.mjs";
import {
  PermittedDerivationPathsCaveatSpecification,
  permittedDerivationPathsCaveatMapper
} from "./chunk-WFAY5FPP.mjs";
import {
  SnapIdsCaveatSpecification,
  snapIdsCaveatMapper
} from "./chunk-CVK2TYJX.mjs";
import {
  getBip44EntropyBuilder
} from "./chunk-LR7UR4YU.mjs";
import {
  getBip32EntropyBuilder
} from "./chunk-TNRH2LRU.mjs";
import {
  getBip32PublicKeyBuilder
} from "./chunk-6WUIFFMQ.mjs";
import {
  invokeSnapBuilder
} from "./chunk-VVBTXSID.mjs";

// src/restricted/caveats/index.ts
var caveatSpecifications = {
  ...PermittedDerivationPathsCaveatSpecification,
  ...PermittedCoinTypesCaveatSpecification,
  ...SnapIdsCaveatSpecification
};
var caveatMappers = {
  [getBip32EntropyBuilder.targetName]: permittedDerivationPathsCaveatMapper,
  [getBip32PublicKeyBuilder.targetName]: permittedDerivationPathsCaveatMapper,
  [getBip44EntropyBuilder.targetName]: permittedCoinTypesCaveatMapper,
  [invokeSnapBuilder.targetName]: snapIdsCaveatMapper
};

export {
  caveatSpecifications,
  caveatMappers
};
//# sourceMappingURL=chunk-Y4LNTDZ2.mjs.map