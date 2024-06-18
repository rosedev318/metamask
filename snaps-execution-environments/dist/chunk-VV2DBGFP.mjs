import {
  commonEndowmentFactory_default
} from "./chunk-6TW5IC2Y.mjs";
import {
  rootRealmGlobal
} from "./chunk-IX5S3V47.mjs";

// src/common/endowments/index.ts
import { rpcErrors } from "@metamask/rpc-errors";
import { logWarning } from "@metamask/snaps-utils";
import { hasProperty } from "@metamask/utils";
var registeredEndowments = commonEndowmentFactory_default();
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
        if (!hasProperty(attenuatedEndowments, endowmentName)) {
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
      } else if (endowmentName in rootRealmGlobal) {
        logWarning(`Access to unhardened global ${endowmentName}.`);
        const globalValue = rootRealmGlobal[endowmentName];
        allEndowments[endowmentName] = globalValue;
      } else {
        throw rpcErrors.internal(`Unknown endowment: "${endowmentName}".`);
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

export {
  createEndowments
};
//# sourceMappingURL=chunk-VV2DBGFP.mjs.map