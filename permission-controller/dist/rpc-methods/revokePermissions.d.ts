import { type Json, type NonEmptyArray } from '@metamask/utils';
import type { PermissionConstraint } from '../Permission';
import type { PermittedHandlerExport } from '../utils';
export declare const revokePermissionsHandler: PermittedHandlerExport<RevokePermissionsHooks, RevokePermissionArgs, null>;
declare type RevokePermissionArgs = Record<PermissionConstraint['parentCapability'], Json>;
declare type RevokePermissions = (permissions: NonEmptyArray<PermissionConstraint['parentCapability']>) => void;
export declare type RevokePermissionsHooks = {
    revokePermissionsForOrigin: RevokePermissions;
};
export {};
//# sourceMappingURL=revokePermissions.d.ts.map