"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/snaps/constants.ts
var _snapsrpcmethods = require('@metamask/snaps-rpc-methods');
var ALLOWED_PERMISSIONS = Object.freeze([
  "snap_dialog",
  "snap_manageState",
  "snap_notify",
  "snap_getLocale",
  _snapsrpcmethods.SnapEndowments.Cronjob,
  _snapsrpcmethods.SnapEndowments.HomePage,
  _snapsrpcmethods.SnapEndowments.LifecycleHooks,
  _snapsrpcmethods.SnapEndowments.EthereumProvider,
  _snapsrpcmethods.SnapEndowments.TransactionInsight,
  _snapsrpcmethods.SnapEndowments.SignatureInsight
]);



exports.ALLOWED_PERMISSIONS = ALLOWED_PERMISSIONS;
//# sourceMappingURL=chunk-5YBORD3A.js.map