"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkVYSBMOILjs = require('./chunk-VYSBMOIL.js');


var _chunkDLLLH5HNjs = require('./chunk-DLLLH5HN.js');

// src/common/endowments/index.ts
var _rpcerrors = require('@metamask/rpc-errors');
var _snapsutils = require('@metamask/snaps-utils');
var _utils = require('@metamask/utils');
var registeredEndowments = _chunkVYSBMOILjs.commonEndowmentFactory_default.call(void 0, );
var endowmentFactories = registeredEndowments.reduce((factories, builder) => {
  builder.names.forEach((name) => {
    factories.set(name, builder.factory);
  });
  return factories;
}, /* @__PURE__ */ new Map());
function createEndowments({
  snap,
  ethereum,
  snapId,
  endowments,
  notify
}) {
  const attenuatedEndowments = {};
  const result = endowments.reduce(
    ({ allEndowments, teardowns }, endowmentName) => {
      if (endowmentFactories.has(endowmentName)) {
        if (!_utils.hasProperty.call(void 0, attenuatedEndowments, endowmentName)) {
          const { teardownFunction, ...endowment } = endowmentFactories.get(
            endowmentName
          )({ snapId, notify });
          Object.assign(attenuatedEndowments, endowment);
          if (teardownFunction) {
            teardowns.push(teardownFunction);
          }
        }
        allEndowments[endowmentName] = attenuatedEndowments[endowmentName];
      } else if (endowmentName === "ethereum") {
        allEndowments[endowmentName] = ethereum;
      } else if (endowmentName in _chunkDLLLH5HNjs.rootRealmGlobal) {
        _snapsutils.logWarning.call(void 0, `Access to unhardened global ${endowmentName}.`);
        const globalValue = _chunkDLLLH5HNjs.rootRealmGlobal[endowmentName];
        allEndowments[endowmentName] = globalValue;
      } else {
        throw _rpcerrors.rpcErrors.internal(`Unknown endowment: "${endowmentName}".`);
      }
      return { allEndowments, teardowns };
    },
    {
      allEndowments: { snap },
      teardowns: []
    }
  );
  const teardown = async () => {
    await Promise.all(
      result.teardowns.map((teardownFunction) => teardownFunction())
    );
  };
  return { endowments: result.allEndowments, teardown };
}



exports.createEndowments = createEndowments;
//# sourceMappingURL=chunk-HCAXYGTC.js.map