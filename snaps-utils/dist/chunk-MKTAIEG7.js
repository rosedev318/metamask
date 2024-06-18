"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkE5WSD47Sjs = require('./chunk-E5WSD47S.js');


var _chunkHVTYDKBOjs = require('./chunk-HVTYDKBO.js');


var _chunkM3KAAQFKjs = require('./chunk-M3KAAQFK.js');


var _chunkAFQY2CNYjs = require('./chunk-AFQY2CNY.js');

// src/validation.ts
async function validateFetchedSnap(files) {
  _chunkE5WSD47Sjs.assertIsSnapManifest.call(void 0, files.manifest.result);
  await _chunkHVTYDKBOjs.validateSnapShasum.call(void 0, files);
  _chunkAFQY2CNYjs.validateSnapManifestLocalizations.call(void 0, 
    files.manifest.result,
    files.localizationFiles.map((file) => file.result)
  );
  if (files.svgIcon) {
    _chunkM3KAAQFKjs.assertIsSnapIcon.call(void 0, files.svgIcon);
  }
}



exports.validateFetchedSnap = validateFetchedSnap;
//# sourceMappingURL=chunk-MKTAIEG7.js.map