import {
  GasFeeEstimateLevel
} from "./chunk-YEJJKWT2.mjs";

// src/utils/gas-flow.ts
import { weiHexToGweiDec } from "@metamask/controller-utils";
import {
  GAS_ESTIMATE_TYPES
} from "@metamask/gas-fee-controller";
function getGasFeeFlow(transactionMeta, gasFeeFlows) {
  return gasFeeFlows.find(
    (gasFeeFlow) => gasFeeFlow.matchesTransaction(transactionMeta)
  );
}
function mergeGasFeeEstimates({
  gasFeeControllerEstimateType,
  gasFeeControllerEstimates,
  transactionGasFeeEstimates
}) {
  if (gasFeeControllerEstimateType === GAS_ESTIMATE_TYPES.FEE_MARKET) {
    return Object.values(GasFeeEstimateLevel).reduce(
      (result, level) => ({
        ...result,
        [level]: mergeFeeMarketEstimate(
          gasFeeControllerEstimates[level],
          transactionGasFeeEstimates[level]
        )
      }),
      { ...gasFeeControllerEstimates }
    );
  }
  if (gasFeeControllerEstimateType === GAS_ESTIMATE_TYPES.LEGACY) {
    return Object.values(GasFeeEstimateLevel).reduce(
      (result, level) => ({
        ...result,
        [level]: getLegacyEstimate(transactionGasFeeEstimates[level])
      }),
      {}
    );
  }
  return gasFeeControllerEstimates;
}
function mergeFeeMarketEstimate(gasFeeControllerEstimate, transactionGasFeeEstimate) {
  return {
    ...gasFeeControllerEstimate,
    suggestedMaxFeePerGas: weiHexToGweiDec(
      transactionGasFeeEstimate.maxFeePerGas
    ),
    suggestedMaxPriorityFeePerGas: weiHexToGweiDec(
      transactionGasFeeEstimate.maxPriorityFeePerGas
    )
  };
}
function getLegacyEstimate(transactionGasFeeEstimate) {
  return weiHexToGweiDec(transactionGasFeeEstimate.maxFeePerGas);
}

export {
  getGasFeeFlow,
  mergeGasFeeEstimates
};
//# sourceMappingURL=chunk-TWND5SFD.mjs.map