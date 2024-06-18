import {
  restrictedMethodPermissionBuilders
} from "./chunk-3S7DJI4I.mjs";
import {
  caveatMappers
} from "./chunk-Y4LNTDZ2.mjs";
import {
  selectHooks
} from "./chunk-SGQXD5K7.mjs";
import {
  endowmentCaveatMappers,
  endowmentPermissionBuilders
} from "./chunk-C6E6DI4I.mjs";

// src/permissions.ts
import { hasProperty } from "@metamask/utils";
function processSnapPermissions(initialPermissions) {
  return Object.fromEntries(
    Object.entries(initialPermissions).map(([initialPermission, value]) => {
      if (hasProperty(caveatMappers, initialPermission)) {
        return [initialPermission, caveatMappers[initialPermission](value)];
      } else if (hasProperty(endowmentCaveatMappers, initialPermission)) {
        return [
          initialPermission,
          endowmentCaveatMappers[initialPermission](value)
        ];
      }
      return [
        initialPermission,
        value
      ];
    })
  );
}
var buildSnapEndowmentSpecifications = (excludedEndowments) => Object.values(endowmentPermissionBuilders).reduce((allSpecifications, { targetName, specificationBuilder }) => {
  if (!excludedEndowments.includes(targetName)) {
    allSpecifications[targetName] = specificationBuilder({});
  }
  return allSpecifications;
}, {});
var buildSnapRestrictedMethodSpecifications = (excludedPermissions, hooks) => Object.values(restrictedMethodPermissionBuilders).reduce((specifications, { targetName, specificationBuilder, methodHooks }) => {
  if (!excludedPermissions.includes(targetName)) {
    specifications[targetName] = specificationBuilder({
      // @ts-expect-error The selectHooks type is wonky
      methodHooks: selectHooks(
        hooks,
        methodHooks
      )
    });
  }
  return specifications;
}, {});

export {
  processSnapPermissions,
  buildSnapEndowmentSpecifications,
  buildSnapRestrictedMethodSpecifications
};
//# sourceMappingURL=chunk-AKRFLGOS.mjs.map