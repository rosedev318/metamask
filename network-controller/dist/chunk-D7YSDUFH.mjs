// src/create-network-client.ts
import { ChainId } from "@metamask/controller-utils";
import { createInfuraMiddleware } from "@metamask/eth-json-rpc-infura";
import {
  createBlockCacheMiddleware,
  createBlockRefMiddleware,
  createBlockRefRewriteMiddleware,
  createBlockTrackerInspectorMiddleware,
  createInflightCacheMiddleware,
  createFetchMiddleware,
  createRetryOnEmptyMiddleware
} from "@metamask/eth-json-rpc-middleware";
import {
  providerFromEngine,
  providerFromMiddleware
} from "@metamask/eth-json-rpc-provider";
import {
  createAsyncMiddleware,
  createScaffoldMiddleware,
  JsonRpcEngine,
  mergeMiddleware
} from "@metamask/json-rpc-engine";
import { PollingBlockTracker } from "eth-block-tracker";
var SECOND = 1e3;
function createNetworkClient(networkConfig) {
  const rpcApiMiddleware = networkConfig.type === "infura" /* Infura */ ? createInfuraMiddleware({
    network: networkConfig.network,
    projectId: networkConfig.infuraProjectId,
    maxAttempts: 5,
    source: "metamask"
  }) : createFetchMiddleware({
    btoa: global.btoa,
    fetch: global.fetch,
    rpcUrl: networkConfig.rpcUrl
  });
  const rpcProvider = providerFromMiddleware(rpcApiMiddleware);
  const blockTrackerOpts = (
    // eslint-disable-next-line n/no-process-env
    process.env.IN_TEST && networkConfig.type === "custom" ? { pollingInterval: SECOND } : {}
  );
  const blockTracker = new PollingBlockTracker({
    ...blockTrackerOpts,
    provider: rpcProvider
  });
  const networkMiddleware = networkConfig.type === "infura" /* Infura */ ? createInfuraNetworkMiddleware({
    blockTracker,
    network: networkConfig.network,
    rpcProvider,
    rpcApiMiddleware
  }) : createCustomNetworkMiddleware({
    blockTracker,
    chainId: networkConfig.chainId,
    rpcApiMiddleware
  });
  const engine = new JsonRpcEngine();
  engine.push(networkMiddleware);
  const provider = providerFromEngine(engine);
  const destroy = () => {
    blockTracker.destroy();
  };
  return { configuration: networkConfig, provider, blockTracker, destroy };
}
function createInfuraNetworkMiddleware({
  blockTracker,
  network,
  rpcProvider,
  rpcApiMiddleware
}) {
  return mergeMiddleware([
    createNetworkAndChainIdMiddleware({ network }),
    createBlockCacheMiddleware({ blockTracker }),
    createInflightCacheMiddleware(),
    createBlockRefMiddleware({ blockTracker, provider: rpcProvider }),
    createRetryOnEmptyMiddleware({ blockTracker, provider: rpcProvider }),
    createBlockTrackerInspectorMiddleware({ blockTracker }),
    rpcApiMiddleware
  ]);
}
function createNetworkAndChainIdMiddleware({
  network
}) {
  return createScaffoldMiddleware({
    eth_chainId: ChainId[network]
  });
}
var createChainIdMiddleware = (chainId) => {
  return (req, res, next, end) => {
    if (req.method === "eth_chainId") {
      res.result = chainId;
      return end();
    }
    return next();
  };
};
function createCustomNetworkMiddleware({
  blockTracker,
  chainId,
  rpcApiMiddleware
}) {
  const testMiddlewares = process.env.IN_TEST ? [createEstimateGasDelayTestMiddleware()] : [];
  return mergeMiddleware([
    ...testMiddlewares,
    createChainIdMiddleware(chainId),
    createBlockRefRewriteMiddleware({ blockTracker }),
    createBlockCacheMiddleware({ blockTracker }),
    createInflightCacheMiddleware(),
    createBlockTrackerInspectorMiddleware({ blockTracker }),
    rpcApiMiddleware
  ]);
}
function createEstimateGasDelayTestMiddleware() {
  return createAsyncMiddleware(async (req, _, next) => {
    if (req.method === "eth_estimateGas") {
      await new Promise((resolve) => setTimeout(resolve, SECOND * 2));
    }
    return next();
  });
}

export {
  createNetworkClient
};
//# sourceMappingURL=chunk-D7YSDUFH.mjs.map