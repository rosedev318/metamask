"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkFK7AP6SHjs = require('./chunk-FK7AP6SH.js');

// src/utils/gas-flow.ts
var _controllerutils = require('@metamask/controller-utils');


var _gasfeecontroller = require('@metamask/gas-fee-controller');
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
  if (gasFeeControllerEstimateType === _gasfeecontroller.GAS_ESTIMATE_TYPES.FEE_MARKET) {
    return Object.values(_chunkFK7AP6SHjs.GasFeeEstimateLevel).reduce(
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
  if (gasFeeControllerEstimateType === _gasfeecontroller.GAS_ESTIMATE_TYPES.LEGACY) {
    return Object.values(_chunkFK7AP6SHjs.GasFeeEstimateLevel).reduce(
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
    suggestedMaxFeePerGas: _controllerutils.weiHexToGweiDec.call(void 0, 
      transactionGasFeeEstimate.maxFeePerGas
    ),
    suggestedMaxPriorityFeePerGas: _controllerutils.weiHexToGweiDec.call(void 0, 
      transactionGasFeeEstimate.maxPriorityFeePerGas
    )
  };
}
function getLegacyEstimate(transactionGasFeeEstimate) {
  return _controllerutils.weiHexToGweiDec.call(void 0, transactionGasFeeEstimate.maxFeePerGas);
}




exports.getGasFeeFlow = getGasFeeFlow; exports.mergeGasFeeEstimates = mergeGasFeeEstimates;
//# sourceMappingURL=chunk-UH7FNVKS.js.map