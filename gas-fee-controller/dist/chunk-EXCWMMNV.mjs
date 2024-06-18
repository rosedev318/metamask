import {
  fetchBlockFeeHistory
} from "./chunk-AQN4AQEF.mjs";
import {
  calculateGasFeeEstimatesForPriorityLevels
} from "./chunk-GUWY6WP6.mjs";
import {
  fetchLatestBlock
} from "./chunk-SINQOHIN.mjs";

// src/fetchGasEstimatesViaEthFeeHistory.ts
import { GWEI } from "@metamask/controller-utils";
import { fromWei } from "@metamask/ethjs-unit";
async function fetchGasEstimatesViaEthFeeHistory(ethQuery) {
  const latestBlock = await fetchLatestBlock(ethQuery);
  const blocks = await fetchBlockFeeHistory({
    ethQuery,
    endBlock: latestBlock.number,
    numberOfBlocks: 5,
    percentiles: [10, 20, 30]
  });
  const estimatedBaseFee = fromWei(latestBlock.baseFeePerGas, GWEI);
  const levelSpecificEstimates = calculateGasFeeEstimatesForPriorityLevels(blocks);
  return {
    ...levelSpecificEstimates,
    estimatedBaseFee,
    historicalBaseFeeRange: null,
    baseFeeTrend: null,
    latestPriorityFeeRange: null,
    historicalPriorityFeeRange: null,
    priorityFeeTrend: null,
    networkCongestion: null
  };
}

export {
  fetchGasEstimatesViaEthFeeHistory
};
//# sourceMappingURL=chunk-EXCWMMNV.mjs.map