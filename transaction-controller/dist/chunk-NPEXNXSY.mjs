import {
  gweiDecimalToWeiHex
} from "./chunk-LDXTSESK.mjs";
import {
  projectLogger
} from "./chunk-UQQWZT6C.mjs";
import {
  GasFeeEstimateLevel
} from "./chunk-YEJJKWT2.mjs";
import {
  __privateAdd,
  __privateMethod
} from "./chunk-XUI43LEZ.mjs";

// src/gas-flows/DefaultGasFeeFlow.ts
import { GAS_ESTIMATE_TYPES } from "@metamask/gas-fee-controller";
import { createModuleLogger } from "@metamask/utils";
var log = createModuleLogger(projectLogger, "default-gas-fee-flow");
var _getEstimateLevel, getEstimateLevel_fn, _getFeeMarketLevel, getFeeMarketLevel_fn, _getLegacyLevel, getLegacyLevel_fn;
var DefaultGasFeeFlow = class {
  constructor() {
    __privateAdd(this, _getEstimateLevel);
    __privateAdd(this, _getFeeMarketLevel);
    __privateAdd(this, _getLegacyLevel);
  }
  matchesTransaction(_transactionMeta) {
    return true;
  }
  async getGasFees(request) {
    const { getGasFeeControllerEstimates, transactionMeta } = request;
    const { networkClientId } = transactionMeta;
    const { gasEstimateType, gasFeeEstimates } = await getGasFeeControllerEstimates({ networkClientId });
    if (gasEstimateType === GAS_ESTIMATE_TYPES.FEE_MARKET) {
      log("Using fee market estimates", gasFeeEstimates);
    } else if (gasEstimateType === GAS_ESTIMATE_TYPES.LEGACY) {
      log("Using legacy estimates", gasFeeEstimates);
    } else {
      throw new Error(`'No gas fee estimates available`);
    }
    const estimates = Object.values(GasFeeEstimateLevel).reduce(
      (result, level) => ({
        ...result,
        [level]: __privateMethod(this, _getEstimateLevel, getEstimateLevel_fn).call(this, {
          gasEstimateType,
          gasFeeEstimates,
          level
        })
      }),
      {}
    );
    return { estimates };
  }
};
_getEstimateLevel = new WeakSet();
getEstimateLevel_fn = function({
  gasEstimateType,
  gasFeeEstimates,
  level
}) {
  if (gasEstimateType === GAS_ESTIMATE_TYPES.FEE_MARKET) {
    return __privateMethod(this, _getFeeMarketLevel, getFeeMarketLevel_fn).call(this, gasFeeEstimates, level);
  }
  return __privateMethod(this, _getLegacyLevel, getLegacyLevel_fn).call(this, gasFeeEstimates, level);
};
_getFeeMarketLevel = new WeakSet();
getFeeMarketLevel_fn = function(gasFeeEstimates, level) {
  const maxFeePerGas = gweiDecimalToWeiHex(
    gasFeeEstimates[level].suggestedMaxFeePerGas
  );
  const maxPriorityFeePerGas = gweiDecimalToWeiHex(
    gasFeeEstimates[level].suggestedMaxPriorityFeePerGas
  );
  return {
    maxFeePerGas,
    maxPriorityFeePerGas
  };
};
_getLegacyLevel = new WeakSet();
getLegacyLevel_fn = function(gasFeeEstimates, level) {
  const gasPrice = gweiDecimalToWeiHex(gasFeeEstimates[level]);
  return {
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: gasPrice
  };
};

export {
  DefaultGasFeeFlow
};
//# sourceMappingURL=chunk-NPEXNXSY.mjs.map