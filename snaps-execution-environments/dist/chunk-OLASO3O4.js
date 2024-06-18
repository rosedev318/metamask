"use strict";Object.defineProperty(exports, "__esModule", {value: true});




var _chunkDFPM46ZFjs = require('./chunk-DFPM46ZF.js');

// src/common/commands.ts
var _snapsutils = require('@metamask/snaps-utils');
var _utils = require('@metamask/utils');
function getHandlerArguments(origin, handler, request) {
  switch (handler) {
    case _snapsutils.HandlerType.OnTransaction: {
      _chunkDFPM46ZFjs.assertIsOnTransactionRequestArguments.call(void 0, request.params);
      const { transaction, chainId, transactionOrigin } = request.params;
      return {
        transaction,
        chainId,
        transactionOrigin
      };
    }
    case _snapsutils.HandlerType.OnSignature: {
      _chunkDFPM46ZFjs.assertIsOnSignatureRequestArguments.call(void 0, request.params);
      const { signature, signatureOrigin } = request.params;
      return { signature, signatureOrigin };
    }
    case _snapsutils.HandlerType.OnNameLookup: {
      _chunkDFPM46ZFjs.assertIsOnNameLookupRequestArguments.call(void 0, request.params);
      const { chainId, domain, address } = request.params;
      return domain ? {
        chainId,
        domain
      } : {
        chainId,
        address
      };
    }
    case _snapsutils.HandlerType.OnRpcRequest:
    case _snapsutils.HandlerType.OnKeyringRequest:
      return { origin, request };
    case _snapsutils.HandlerType.OnCronjob:
    case _snapsutils.HandlerType.OnInstall:
    case _snapsutils.HandlerType.OnUpdate:
      return { request };
    case _snapsutils.HandlerType.OnHomePage:
      return {};
    case _snapsutils.HandlerType.OnUserInput: {
      _chunkDFPM46ZFjs.assertIsOnUserInputRequestArguments.call(void 0, request.params);
      const { id, event } = request.params;
      return { id, event };
    }
    default:
      return _utils.assertExhaustive.call(void 0, handler);
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




exports.getHandlerArguments = getHandlerArguments; exports.getCommandMethodImplementations = getCommandMethodImplementations;
//# sourceMappingURL=chunk-OLASO3O4.js.map