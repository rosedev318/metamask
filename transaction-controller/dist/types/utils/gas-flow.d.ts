import type { GasFeeEstimates, LegacyGasPriceEstimate } from '@metamask/gas-fee-controller';
import { type GasFeeState } from '@metamask/gas-fee-controller';
import { type GasFeeEstimates as TransactionGasFeeEstimates, type GasFeeFlow, type TransactionMeta } from '../types';
/**
 * Returns the first gas fee flow that matches the transaction.
 *
 * @param transactionMeta - The transaction metadata to find a gas fee flow for.
 * @param gasFeeFlows - The gas fee flows to search.
 * @returns The first gas fee flow that matches the transaction, or undefined if none match.
 */
export declare function getGasFeeFlow(transactionMeta: TransactionMeta, gasFeeFlows: GasFeeFlow[]): GasFeeFlow | undefined;
type FeeMarketMergeGasFeeEstimatesRequest = {
    gasFeeControllerEstimateType: 'fee-market';
    gasFeeControllerEstimates: GasFeeEstimates;
    transactionGasFeeEstimates: TransactionGasFeeEstimates;
};
type LegacyMergeGasFeeEstimatesRequest = {
    gasFeeControllerEstimateType: 'legacy';
    gasFeeControllerEstimates: LegacyGasPriceEstimate;
    transactionGasFeeEstimates: TransactionGasFeeEstimates;
};
/**
 * Merge the gas fee estimates from the gas fee controller with the gas fee estimates from a transaction.
 * @param request - Data required to merge gas fee estimates.
 * @param request.gasFeeControllerEstimateType - Gas fee estimate type from the gas fee controller.
 * @param request.gasFeeControllerEstimates - Gas fee estimates from the GasFeeController.
 * @param request.transactionGasFeeEstimates - Gas fee estimates from the transaction.
 * @returns The merged gas fee estimates.
 */
export declare function mergeGasFeeEstimates({ gasFeeControllerEstimateType, gasFeeControllerEstimates, transactionGasFeeEstimates, }: FeeMarketMergeGasFeeEstimatesRequest | LegacyMergeGasFeeEstimatesRequest): GasFeeState['gasFeeEstimates'];
export {};
//# sourceMappingURL=gas-flow.d.ts.map