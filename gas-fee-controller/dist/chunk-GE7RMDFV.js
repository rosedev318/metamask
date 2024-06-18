"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _chunkS2EH2EPSjs = require('./chunk-S2EH2EPS.js');

// src/fetchGasEstimatesViaEthFeeHistory/calculateGasFeeEstimatesForPriorityLevels.ts
var _controllerutils = require('@metamask/controller-utils');
var _ethjsunit = require('@metamask/ethjs-unit');
var _bnjs = require('bn.js'); var _bnjs2 = _interopRequireDefault(_bnjs);
var PRIORITY_LEVELS = ["low", "medium", "high"];
var SETTINGS_BY_PRIORITY_LEVEL = {
  low: {
    percentile: 10,
    baseFeePercentageMultiplier: new (0, _bnjs2.default)(110),
    priorityFeePercentageMultiplier: new (0, _bnjs2.default)(94),
    minSuggestedMaxPriorityFeePerGas: new (0, _bnjs2.default)(1e9),
    estimatedWaitTimes: {
      minWaitTimeEstimate: 15e3,
      maxWaitTimeEstimate: 3e4
    }
  },
  medium: {
    percentile: 20,
    baseFeePercentageMultiplier: new (0, _bnjs2.default)(120),
    priorityFeePercentageMultiplier: new (0, _bnjs2.default)(97),
    minSuggestedMaxPriorityFeePerGas: new (0, _bnjs2.default)(15e8),
    estimatedWaitTimes: {
      minWaitTimeEstimate: 15e3,
      maxWaitTimeEstimate: 45e3
    }
  },
  high: {
    percentile: 30,
    baseFeePercentageMultiplier: new (0, _bnjs2.default)(125),
    priorityFeePercentageMultiplier: new (0, _bnjs2.default)(98),
    minSuggestedMaxPriorityFeePerGas: new (0, _bnjs2.default)(2e9),
    estimatedWaitTimes: {
      minWaitTimeEstimate: 15e3,
      maxWaitTimeEstimate: 6e4
    }
  }
};
function calculateEstimatesForPriorityLevel(priorityLevel, blocks) {
  const settings = SETTINGS_BY_PRIORITY_LEVEL[priorityLevel];
  const latestBaseFeePerGas = blocks[blocks.length - 1].baseFeePerGas;
  const adjustedBaseFee = latestBaseFeePerGas.mul(settings.baseFeePercentageMultiplier).divn(100);
  const priorityFees = blocks.map((block) => {
    return "priorityFeesByPercentile" in block ? block.priorityFeesByPercentile[settings.percentile] : null;
  }).filter(_bnjs2.default.isBN);
  const medianPriorityFee = _chunkS2EH2EPSjs.medianOf.call(void 0, priorityFees);
  const adjustedPriorityFee = medianPriorityFee.mul(settings.priorityFeePercentageMultiplier).divn(100);
  const suggestedMaxPriorityFeePerGas = _bnjs2.default.max(
    adjustedPriorityFee,
    settings.minSuggestedMaxPriorityFeePerGas
  );
  const suggestedMaxFeePerGas = adjustedBaseFee.add(
    suggestedMaxPriorityFeePerGas
  );
  return {
    ...settings.estimatedWaitTimes,
    suggestedMaxPriorityFeePerGas: _ethjsunit.fromWei.call(void 0, suggestedMaxPriorityFeePerGas, _controllerutils.GWEI),
    suggestedMaxFeePerGas: _ethjsunit.fromWei.call(void 0, suggestedMaxFeePerGas, _controllerutils.GWEI)
  };
}
function calculateGasFeeEstimatesForPriorityLevels(blocks) {
  return PRIORITY_LEVELS.reduce((obj, priorityLevel) => {
    const gasEstimatesForPriorityLevel = calculateEstimatesForPriorityLevel(
      priorityLevel,
      blocks
    );
    return { ...obj, [priorityLevel]: gasEstimatesForPriorityLevel };
  }, {});
}



exports.calculateGasFeeEstimatesForPriorityLevels = calculateGasFeeEstimatesForPriorityLevels;
//# sourceMappingURL=chunk-GE7RMDFV.js.map