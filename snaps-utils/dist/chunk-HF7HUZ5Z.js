"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/json.ts
var _utils = require('@metamask/utils');
function parseJson(json) {
  return _utils.getSafeJson.call(void 0, JSON.parse(json));
}



exports.parseJson = parseJson;
//# sourceMappingURL=chunk-HF7HUZ5Z.js.map