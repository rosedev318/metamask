"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// src/fetchBlockFeeHistory.ts
var _controllerutils = require('@metamask/controller-utils');
var _bnjs = require('bn.js'); var _bnjs2 = _interopRequireDefault(_bnjs);
var MAX_NUMBER_OF_BLOCKS_PER_ETH_FEE_HISTORY_CALL = 1024;
async function fetchBlockFeeHistory({
  ethQuery,
  numberOfBlocks: totalNumberOfBlocks,
  endBlock: givenEndBlock = "latest",
  percentiles: givenPercentiles = [],
  includeNextBlock = false
}) {
  const percentiles = givenPercentiles.length > 0 ? Array.from(new Set(givenPercentiles)).sort((a, b) => a - b) : [];
  const finalEndBlockNumber = givenEndBlock === "latest" ? _controllerutils.fromHex.call(void 0, await _controllerutils.query.call(void 0, ethQuery, "blockNumber")) : givenEndBlock;
  const requestChunkSpecifiers = determineRequestChunkSpecifiers(
    finalEndBlockNumber,
    totalNumberOfBlocks
  );
  const blockChunks = await Promise.all(
    requestChunkSpecifiers.map(({ numberOfBlocks, endBlockNumber }, i) => {
      return i === requestChunkSpecifiers.length - 1 ? makeRequestForChunk({
        ethQuery,
        numberOfBlocks,
        endBlockNumber,
        percentiles,
        includeNextBlock
      }) : makeRequestForChunk({
        ethQuery,
        numberOfBlocks,
        endBlockNumber,
        percentiles,
        includeNextBlock: false
      });
    })
  );
  return blockChunks.reduce(
    (array, blocks) => [...array, ...blocks],
    []
  );
}
function buildExistingFeeHistoryBlock({
  baseFeePerGas,
  number,
  blockIndex,
  gasUsedRatios,
  priorityFeePercentileGroups,
  percentiles
}) {
  const gasUsedRatio = gasUsedRatios[blockIndex];
  const priorityFeesForEachPercentile = priorityFeePercentileGroups[blockIndex];
  const priorityFeesByPercentile = percentiles.reduce(
    (obj, percentile, percentileIndex) => {
      const priorityFee = priorityFeesForEachPercentile[percentileIndex];
      return { ...obj, [percentile]: _controllerutils.fromHex.call(void 0, priorityFee) };
    },
    {}
  );
  return {
    number,
    baseFeePerGas,
    gasUsedRatio,
    priorityFeesByPercentile
  };
}
function buildNextFeeHistoryBlock({
  baseFeePerGas,
  number
}) {
  return {
    number,
    baseFeePerGas,
    gasUsedRatio: null,
    priorityFeesByPercentile: null
  };
}
async function makeRequestForChunk({
  ethQuery,
  numberOfBlocks,
  endBlockNumber,
  percentiles,
  includeNextBlock
}) {
  const response = await _controllerutils.query.call(void 0, 
    ethQuery,
    "eth_feeHistory",
    [_controllerutils.toHex.call(void 0, numberOfBlocks), _controllerutils.toHex.call(void 0, endBlockNumber), percentiles]
  );
  const startBlockNumber = _controllerutils.fromHex.call(void 0, response.oldestBlock);
  if (response.baseFeePerGas !== void 0 && response.baseFeePerGas.length > 0 && response.gasUsedRatio.length > 0 && (response.reward === void 0 || response.reward.length > 0)) {
    const baseFeesPerGasAsHex = includeNextBlock ? response.baseFeePerGas : response.baseFeePerGas.slice(0, numberOfBlocks);
    const gasUsedRatios = response.gasUsedRatio;
    const priorityFeePercentileGroups = response.reward ?? [];
    const numberOfExistingResults = gasUsedRatios.length;
    return baseFeesPerGasAsHex.map((baseFeePerGasAsHex, blockIndex) => {
      const baseFeePerGas = _controllerutils.fromHex.call(void 0, baseFeePerGasAsHex);
      const number = startBlockNumber.addn(blockIndex);
      return blockIndex >= numberOfExistingResults ? buildNextFeeHistoryBlock({ baseFeePerGas, number }) : buildExistingFeeHistoryBlock({
        baseFeePerGas,
        number,
        blockIndex,
        gasUsedRatios,
        priorityFeePercentileGroups,
        percentiles
      });
    });
  }
  return [];
}
function determineRequestChunkSpecifiers(endBlockNumber, totalNumberOfBlocks) {
  if (endBlockNumber.lt(new (0, _bnjs2.default)(totalNumberOfBlocks))) {
    totalNumberOfBlocks = endBlockNumber.toNumber();
  }
  const specifiers = [];
  for (let chunkStartBlockNumber = endBlockNumber.subn(totalNumberOfBlocks); chunkStartBlockNumber.lt(endBlockNumber); chunkStartBlockNumber = chunkStartBlockNumber.addn(
    MAX_NUMBER_OF_BLOCKS_PER_ETH_FEE_HISTORY_CALL
  )) {
    const distanceToEnd = endBlockNumber.sub(chunkStartBlockNumber).toNumber();
    const numberOfBlocks = distanceToEnd < MAX_NUMBER_OF_BLOCKS_PER_ETH_FEE_HISTORY_CALL ? distanceToEnd : MAX_NUMBER_OF_BLOCKS_PER_ETH_FEE_HISTORY_CALL;
    const chunkEndBlockNumber = chunkStartBlockNumber.addn(numberOfBlocks);
    specifiers.push({ numberOfBlocks, endBlockNumber: chunkEndBlockNumber });
  }
  return specifiers;
}



exports.fetchBlockFeeHistory = fetchBlockFeeHistory;
//# sourceMappingURL=chunk-5INBFZXY.js.map