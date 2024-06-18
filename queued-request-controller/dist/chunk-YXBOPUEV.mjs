// src/QueuedRequestMiddleware.ts
import { createAsyncMiddleware } from "@metamask/json-rpc-engine";
import { serializeError } from "@metamask/rpc-errors";
var isConfirmationMethod = (method) => {
  const confirmationMethods = [
    "eth_sendTransaction",
    "wallet_watchAsset",
    "wallet_switchEthereumChain",
    "eth_signTypedData_v4",
    "wallet_addEthereumChain",
    "wallet_requestPermissions",
    "wallet_requestSnaps",
    "personal_sign",
    "eth_sign",
    "eth_requestAccounts"
  ];
  return confirmationMethods.includes(method);
};
function hasRequiredMetadata(request) {
  if (!request.origin) {
    throw new Error("Request object is lacking an 'origin'");
  } else if (typeof request.origin !== "string") {
    throw new Error(
      `Request object has an invalid origin of type '${typeof request.origin}'`
    );
  } else if (!request.networkClientId) {
    throw new Error("Request object is lacking a 'networkClientId'");
  } else if (typeof request.networkClientId !== "string") {
    throw new Error(
      `Request object has an invalid networkClientId of type '${typeof request.networkClientId}'`
    );
  }
}
var createQueuedRequestMiddleware = ({
  enqueueRequest,
  useRequestQueue
}) => {
  return createAsyncMiddleware(async (req, res, next) => {
    hasRequiredMetadata(req);
    if (!useRequestQueue() || !isConfirmationMethod(req.method)) {
      return await next();
    }
    try {
      await enqueueRequest(req, next);
    } catch (error) {
      res.error = serializeError(error);
    }
    return void 0;
  });
};

export {
  createQueuedRequestMiddleware
};
//# sourceMappingURL=chunk-YXBOPUEV.mjs.map