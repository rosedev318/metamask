// src/fetchGasEstimatesViaEthFeeHistory/medianOf.ts
function medianOf(numbers) {
  const sortedNumbers = numbers.slice().sort((a, b) => a.cmp(b));
  const len = sortedNumbers.length;
  const index = Math.floor((len - 1) / 2);
  return sortedNumbers[index];
}

export {
  medianOf
};
//# sourceMappingURL=chunk-C4I7KKIU.mjs.map