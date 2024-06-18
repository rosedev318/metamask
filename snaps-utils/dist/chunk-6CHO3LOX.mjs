// src/json.ts
import { getSafeJson } from "@metamask/utils";
function parseJson(json) {
  return getSafeJson(JSON.parse(json));
}

export {
  parseJson
};
//# sourceMappingURL=chunk-6CHO3LOX.mjs.map