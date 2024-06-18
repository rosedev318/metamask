import {
  invokeKeyringHandler
} from "./chunk-TKXU7ZXP.mjs";
import {
  invokeSnapSugarHandler
} from "./chunk-MXCJWR45.mjs";
import {
  requestSnapsHandler
} from "./chunk-MXPVC2XP.mjs";
import {
  updateInterfaceHandler
} from "./chunk-YS6TYXCP.mjs";
import {
  createInterfaceHandler
} from "./chunk-WLDEPJGG.mjs";
import {
  getAllSnapsHandler
} from "./chunk-UB3733UY.mjs";
import {
  getClientStatusHandler
} from "./chunk-62URQ5VS.mjs";
import {
  getFileHandler
} from "./chunk-I6FU5MGE.mjs";
import {
  getInterfaceStateHandler
} from "./chunk-TJYMYQAB.mjs";
import {
  getSnapsHandler
} from "./chunk-CH5O2YCX.mjs";

// src/permitted/handlers.ts
var methodHandlers = {
  wallet_getAllSnaps: getAllSnapsHandler,
  wallet_getSnaps: getSnapsHandler,
  wallet_requestSnaps: requestSnapsHandler,
  wallet_invokeSnap: invokeSnapSugarHandler,
  wallet_invokeKeyring: invokeKeyringHandler,
  snap_getClientStatus: getClientStatusHandler,
  snap_getFile: getFileHandler,
  snap_createInterface: createInterfaceHandler,
  snap_updateInterface: updateInterfaceHandler,
  snap_getInterfaceState: getInterfaceStateHandler
};
var handlers = Object.values(methodHandlers);

export {
  methodHandlers,
  handlers
};
//# sourceMappingURL=chunk-JQ456NCC.mjs.map