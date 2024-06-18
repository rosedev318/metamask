"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/fetchGasEstimatesViaEthFeeHistory/medianOf.ts
function medianOf(numbers) {
  const sortedNumbers = numbers.slice().sort((a, b) => a.cmp(b));
  const len = sortedNumbers.length;
  const index = Math.floor((len - 1) / 2);
  return sortedNumbers[index];
}



exports.medianOf = medianOf;
//# sourceMappingURL=chunk-S2EH2EPS.js.map