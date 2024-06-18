import {
  assertIsOnNameLookupRequestArguments,
  assertIsOnSignatureRequestArguments,
  assertIsOnTransactionRequestArguments,
  assertIsOnUserInputRequestArguments
} from "./chunk-WV3CXIKN.mjs";

// src/common/commands.ts
import { HandlerType } from "@metamask/snaps-utils";
import { assertExhaustive } from "@metamask/utils";
function getHandlerArguments(origin, handler, request) {
  switch (handler) {
    case HandlerType.OnTransaction: {
      assertIsOnTransactionRequestArguments(request.params);
      const { transaction, chainId, transactionOrigin } = request.params;
      return {
        transaction,
        chainId,
        transactionOrigin
      };
    }
    case HandlerType.OnSignature: {
      assertIsOnSignatureRequestArguments(request.params);
      const { signature, signatureOrigin } = request.params;
      return { signature, signatureOrigin };
    }
    case HandlerType.OnNameLookup: {
      assertIsOnNameLookupRequestArguments(request.params);
      const { chainId, domain, address } = request.params;
      return domain ? {
        chainId,
        domain
      } : {
        chainId,
        address
      };
    }
    case HandlerType.OnRpcRequest:
    case HandlerType.OnKeyringRequest:
      return { origin, request };
    case HandlerType.OnCronjob:
    case HandlerType.OnInstall:
    case HandlerType.OnUpdate:
      return { request };
    case HandlerType.OnHomePage:
      return {};
    case HandlerType.OnUserInput: {
      assertIsOnUserInputRequestArguments(request.params);
      const { id, event } = request.params;
      return { id, event };
    }
    default:
      return assertExhaustive(handler);
  }
}
function getCommandMethodImplementations(startSnap, invokeSnap, onTerminate) {
  return {
    ping: async () => Promise.resolve("OK"),
    terminate: async () => {
      onTerminate();
      return Promise.resolve("OK");
    },
    executeSnap: async (snapId, sourceCode, endowments) => {
      await startSnap(snapId, sourceCode, endowments);
      return "OK";
    },
    snapRpc: async (target, handler, origin, request) => {
      return await invokeSnap(
        target,
        handler,
        getHandlerArguments(origin, handler, request)
      ) ?? null;
    }
  };
}

export {
  getHandlerArguments,
  getCommandMethodImplementations
};
//# sourceMappingURL=chunk-MM6ZSW4E.mjs.map