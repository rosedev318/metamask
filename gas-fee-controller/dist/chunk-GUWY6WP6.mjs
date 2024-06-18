import {
  medianOf
} from "./chunk-C4I7KKIU.mjs";

// src/fetchGasEstimatesViaEthFeeHistory/calculateGasFeeEstimatesForPriorityLevels.ts
import { GWEI } from "@metamask/controller-utils";
import { fromWei } from "@metamask/ethjs-unit";
import BN from "bn.js";
var PRIORITY_LEVELS = ["low", "medium", "high"];
var SETTINGS_BY_PRIORITY_LEVEL = {
  low: {
    percentile: 10,
    baseFeePercentageMultiplier: new BN(110),
    priorityFeePercentageMultiplier: new BN(94),
    minSuggestedMaxPriorityFeePerGas: new BN(1e9),
    estimatedWaitTimes: {
      minWaitTimeEstimate: 15e3,
      maxWaitTimeEstimate: 3e4
    }
  },
  medium: {
    percentile: 20,
    baseFeePercentageMultiplier: new BN(120),
    priorityFeePercentageMultiplier: new BN(97),
    minSuggestedMaxPriorityFeePerGas: new BN(15e8),
    estimatedWaitTimes: {
      minWaitTimeEstimate: 15e3,
      maxWaitTimeEstimate: 45e3
    }
  },
  high: {
    percentile: 30,
    baseFeePercentageMultiplier: new BN(125),
    priorityFeePercentageMultiplier: new BN(98),
    minSuggestedMaxPriorityFeePerGas: new BN(2e9),
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
  }).filter(BN.isBN);
  const medianPriorityFee = medianOf(priorityFees);
  const adjustedPriorityFee = medianPriorityFee.mul(settings.priorityFeePercentageMultiplier).divn(100);
  const suggestedMaxPriorityFeePerGas = BN.max(
    adjustedPriorityFee,
    settings.minSuggestedMaxPriorityFeePerGas
  );
  const suggestedMaxFeePerGas = adjustedBaseFee.add(
    suggestedMaxPriorityFeePerGas
  );
  return {
    ...settings.estimatedWaitTimes,
    suggestedMaxPriorityFeePerGas: fromWei(suggestedMaxPriorityFeePerGas, GWEI),
    suggestedMaxFeePerGas: fromWei(suggestedMaxFeePerGas, GWEI)
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

export {
  calculateGasFeeEstimatesForPriorityLevels
};
//# sourceMappingURL=chunk-GUWY6WP6.mjs.map