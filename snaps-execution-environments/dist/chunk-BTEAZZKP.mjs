// src/common/sortParams.ts
var sortParamKeys = (methodParams, params) => {
  if (!params) {
    return [];
  }
  if (params instanceof Array) {
    return params;
  }
  const methodParamsOrder = methodParams.reduce(
    (paramsOrderObj, paramsName, i) => ({
      ...paramsOrderObj,
      [paramsName]: i
    }),
    {}
  );
  return Object.entries(params).sort(
    ([name1, _1], [name2, _2]) => methodParamsOrder[name1] - methodParamsOrder[name2]
  ).map(([_, val]) => val);
};

export {
  sortParamKeys
};
//# sourceMappingURL=chunk-BTEAZZKP.mjs.map