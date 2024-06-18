// src/fetchGasEstimatesViaEthFeeHistory/fetchLatestBlock.ts
import { query, fromHex } from "@metamask/controller-utils";
async function fetchLatestBlock(ethQuery, includeFullTransactionData = false) {
  const blockNumber = await query(ethQuery, "blockNumber");
  const block = await query(ethQuery, "getBlockByNumber", [
    blockNumber,
    includeFullTransactionData
  ]);
  return {
    ...block,
    number: fromHex(block.number),
    baseFeePerGas: fromHex(block.baseFeePerGas)
  };
}

export {
  fetchLatestBlock
};
//# sourceMappingURL=chunk-SINQOHIN.mjs.map