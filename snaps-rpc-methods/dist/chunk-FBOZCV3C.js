"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkLVTN25J2js = require('./chunk-LVTN25J2.js');


var _chunkAYJK7MSHjs = require('./chunk-AYJK7MSH.js');


var _chunkYG7W4CDTjs = require('./chunk-YG7W4CDT.js');



var _chunkJRSPKOFGjs = require('./chunk-JRSPKOFG.js');

// src/permissions.ts
var _utils = require('@metamask/utils');
function processSnapPermissions(initialPermissions) {
  return Object.fromEntries(
    Object.entries(initialPermissions).map(([initialPermission, value]) => {
      if (_utils.hasProperty.call(void 0, _chunkAYJK7MSHjs.caveatMappers, initialPermission)) {
        return [initialPermission, _chunkAYJK7MSHjs.caveatMappers[initialPermission](value)];
      } else if (_utils.hasProperty.call(void 0, _chunkJRSPKOFGjs.endowmentCaveatMappers, initialPermission)) {
        return [
          initialPermission,
          _chunkJRSPKOFGjs.endowmentCaveatMappers[initialPermission](value)
        ];
      }
      return [
        initialPermission,
        value
      ];
    })
  );
}
var buildSnapEndowmentSpecifications = (excludedEndowments) => Object.values(_chunkJRSPKOFGjs.endowmentPermissionBuilders).reduce((allSpecifications, { targetName, specificationBuilder }) => {
  if (!excludedEndowments.includes(targetName)) {
    allSpecifications[targetName] = specificationBuilder({});
  }
  return allSpecifications;
}, {});
var buildSnapRestrictedMethodSpecifications = (excludedPermissions, hooks) => Object.values(_chunkLVTN25J2js.restrictedMethodPermissionBuilders).reduce((specifications, { targetName, specificationBuilder, methodHooks }) => {
  if (!excludedPermissions.includes(targetName)) {
    specifications[targetName] = specificationBuilder({
      // @ts-expect-error The selectHooks type is wonky
      methodHooks: _chunkYG7W4CDTjs.selectHooks.call(void 0, 
        hooks,
        methodHooks
      )
    });
  }
  return specifications;
}, {});





exports.processSnapPermissions = processSnapPermissions; exports.buildSnapEndowmentSpecifications = buildSnapEndowmentSpecifications; exports.buildSnapRestrictedMethodSpecifications = buildSnapRestrictedMethodSpecifications;
//# sourceMappingURL=chunk-FBOZCV3C.js.map