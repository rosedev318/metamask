import "../../chunk-YRZVIDCF.mjs";

// src/common/lockdown/lockdown.ts
import { logError } from "@metamask/snaps-utils";
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
    logError("Lockdown failed:", error);
    throw error;
  }
}
export {
  executeLockdown
};
//# sourceMappingURL=lockdown.mjs.map