"use strict";Object.defineProperty(exports, "__esModule", {value: true});require('../../chunk-EXN2TFDJ.js');

// src/common/lockdown/lockdown.ts
var _snapsutils = require('@metamask/snaps-utils');
function executeLockdown() {
  try {
    lockdown({
      consoleTaming: "unsafe",
      errorTaming: "unsafe",
      mathTaming: "unsafe",
      dateTaming: "unsafe",
      overrideTaming: "severe"
    });
  } catch (error) {
    _snapsutils.logError.call(void 0, "Lockdown failed:", error);
    throw error;
  }
}


exports.executeLockdown = executeLockdown;
//# sourceMappingURL=lockdown.js.map