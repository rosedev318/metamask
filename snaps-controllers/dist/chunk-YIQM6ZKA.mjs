// src/snaps/constants.ts
import { SnapEndowments } from "@metamask/snaps-rpc-methods";
var ALLOWED_PERMISSIONS = Object.freeze([
  "snap_dialog",
  "snap_manageState",
  "snap_notify",
  "snap_getLocale",
  SnapEndowments.Cronjob,
  SnapEndowments.HomePage,
  SnapEndowments.LifecycleHooks,
  SnapEndowments.EthereumProvider,
  SnapEndowments.TransactionInsight,
  SnapEndowments.SignatureInsight
]);

export {
  ALLOWED_PERMISSIONS
};
//# sourceMappingURL=chunk-YIQM6ZKA.mjs.map