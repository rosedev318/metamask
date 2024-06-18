import {
  ADDRESS_ZERO,
  EMPTY_BYTES,
  VALUE_ZERO
} from "./chunk-TPPISKNS.mjs";
import {
  __privateAdd,
  __privateGet,
  __privateSet
} from "./chunk-XUI43LEZ.mjs";

// src/helpers/SnapSmartContractAccount.ts
var _messenger;
var SnapSmartContractAccount = class {
  constructor(messenger) {
    __privateAdd(this, _messenger, void 0);
    __privateSet(this, _messenger, messenger);
  }
  async prepareUserOperation(request) {
    const {
      data: requestData,
      from: sender,
      to: requestTo,
      value: requestValue
    } = request;
    const data = requestData ?? EMPTY_BYTES;
    const to = requestTo ?? ADDRESS_ZERO;
    const value = requestValue ?? VALUE_ZERO;
    const response = await __privateGet(this, _messenger).call(
      "KeyringController:prepareUserOperation",
      sender,
      [{ data, to, value }]
    );
    const {
      bundlerUrl: bundler,
      callData,
      dummyPaymasterAndData,
      dummySignature,
      gasLimits: gas,
      initCode,
      nonce
    } = response;
    return {
      bundler,
      callData,
      dummyPaymasterAndData,
      dummySignature,
      gas,
      initCode,
      nonce,
      sender
    };
  }
  async updateUserOperation(request) {
    const { userOperation } = request;
    const { sender } = userOperation;
    const { paymasterAndData: responsePaymasterAndData } = await __privateGet(this, _messenger).call(
      "KeyringController:patchUserOperation",
      sender,
      userOperation
    );
    const paymasterAndData = responsePaymasterAndData === EMPTY_BYTES ? void 0 : responsePaymasterAndData;
    return {
      paymasterAndData
    };
  }
  async signUserOperation(request) {
    const { userOperation } = request;
    const { sender } = userOperation;
    const signature = await __privateGet(this, _messenger).call(
      "KeyringController:signUserOperation",
      sender,
      userOperation
    );
    return { signature };
  }
};
_messenger = new WeakMap();

export {
  SnapSmartContractAccount
};
//# sourceMappingURL=chunk-XF2D3KZV.mjs.map