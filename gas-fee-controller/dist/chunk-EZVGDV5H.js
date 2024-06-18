"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk5INBFZXYjs = require('./chunk-5INBFZXY.js');


var _chunkGE7RMDFVjs = require('./chunk-GE7RMDFV.js');


var _chunkLO7OP5FMjs = require('./chunk-LO7OP5FM.js');

// src/fetchGasEstimatesViaEthFeeHistory.ts
var _controllerutils = require('@metamask/controller-utils');
var _ethjsunit = require('@metamask/ethjs-unit');
async function fetchGasEstimatesViaEthFeeHistory(ethQuery) {
  const latestBlock = await _chunkLO7OP5FMjs.fetchLatestBlock.call(void 0, ethQuery);
  const blocks = await _chunk5INBFZXYjs.fetchBlockFeeHistory.call(void 0, {
    ethQuery,
    endBlock: latestBlock.number,
    numberOfBlocks: 5,
    percentiles: [10, 20, 30]
  });
  const estimatedBaseFee = _ethjsunit.fromWei.call(void 0, latestBlock.baseFeePerGas, _controllerutils.GWEI);
  const levelSpecificEstimates = _chunkGE7RMDFVjs.calculateGasFeeEstimatesForPriorityLevels.call(void 0, blocks);
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



exports.fetchGasEstimatesViaEthFeeHistory = fetchGasEstimatesViaEthFeeHistory;
//# sourceMappingURL=chunk-EZVGDV5H.js.map