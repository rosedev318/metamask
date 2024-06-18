"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/fetchGasEstimatesViaEthFeeHistory/fetchLatestBlock.ts
var _controllerutils = require('@metamask/controller-utils');
async function fetchLatestBlock(ethQuery, includeFullTransactionData = false) {
  const blockNumber = await _controllerutils.query.call(void 0, ethQuery, "blockNumber");
  const block = await _controllerutils.query.call(void 0, ethQuery, "getBlockByNumber", [
    blockNumber,
    includeFullTransactionData
  ]);
  return {
    ...block,
    number: _controllerutils.fromHex.call(void 0, block.number),
    baseFeePerGas: _controllerutils.fromHex.call(void 0, block.baseFeePerGas)
  };
}



exports.fetchLatestBlock = fetchLatestBlock;
//# sourceMappingURL=chunk-LO7OP5FM.js.map