"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkEQNKFFTMjs = require('./chunk-EQNKFFTM.js');


var _chunkS6VGOPUYjs = require('./chunk-S6VGOPUY.js');


var _chunkFK7AP6SHjs = require('./chunk-FK7AP6SH.js');



var _chunkZ4BLTVTBjs = require('./chunk-Z4BLTVTB.js');

// src/gas-flows/DefaultGasFeeFlow.ts
var _gasfeecontroller = require('@metamask/gas-fee-controller');
var _utils = require('@metamask/utils');
var log = _utils.createModuleLogger.call(void 0, _chunkS6VGOPUYjs.projectLogger, "default-gas-fee-flow");
var _getEstimateLevel, getEstimateLevel_fn, _getFeeMarketLevel, getFeeMarketLevel_fn, _getLegacyLevel, getLegacyLevel_fn;
var DefaultGasFeeFlow = class {
  constructor() {
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _getEstimateLevel);
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _getFeeMarketLevel);
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _getLegacyLevel);
  }
  matchesTransaction(_transactionMeta) {
    return true;
  }
  async getGasFees(request) {
    const { getGasFeeControllerEstimates, transactionMeta } = request;
    const { networkClientId } = transactionMeta;
    const { gasEstimateType, gasFeeEstimates } = await getGasFeeControllerEstimates({ networkClientId });
    if (gasEstimateType === _gasfeecontroller.GAS_ESTIMATE_TYPES.FEE_MARKET) {
      log("Using fee market estimates", gasFeeEstimates);
    } else if (gasEstimateType === _gasfeecontroller.GAS_ESTIMATE_TYPES.LEGACY) {
      log("Using legacy estimates", gasFeeEstimates);
    } else {
      throw new Error(`'No gas fee estimates available`);
    }
    const estimates = Object.values(_chunkFK7AP6SHjs.GasFeeEstimateLevel).reduce(
      (result, level) => ({
        ...result,
        [level]: _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _getEstimateLevel, getEstimateLevel_fn).call(this, {
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
  if (gasEstimateType === _gasfeecontroller.GAS_ESTIMATE_TYPES.FEE_MARKET) {
    return _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _getFeeMarketLevel, getFeeMarketLevel_fn).call(this, gasFeeEstimates, level);
  }
  return _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _getLegacyLevel, getLegacyLevel_fn).call(this, gasFeeEstimates, level);
};
_getFeeMarketLevel = new WeakSet();
getFeeMarketLevel_fn = function(gasFeeEstimates, level) {
  const maxFeePerGas = _chunkEQNKFFTMjs.gweiDecimalToWeiHex.call(void 0, 
    gasFeeEstimates[level].suggestedMaxFeePerGas
  );
  const maxPriorityFeePerGas = _chunkEQNKFFTMjs.gweiDecimalToWeiHex.call(void 0, 
    gasFeeEstimates[level].suggestedMaxPriorityFeePerGas
  );
  return {
    maxFeePerGas,
    maxPriorityFeePerGas
  };
};
_getLegacyLevel = new WeakSet();
getLegacyLevel_fn = function(gasFeeEstimates, level) {
  const gasPrice = _chunkEQNKFFTMjs.gweiDecimalToWeiHex.call(void 0, gasFeeEstimates[level]);
  return {
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: gasPrice
  };
};



exports.DefaultGasFeeFlow = DefaultGasFeeFlow;
//# sourceMappingURL=chunk-4RJXBKSR.js.map