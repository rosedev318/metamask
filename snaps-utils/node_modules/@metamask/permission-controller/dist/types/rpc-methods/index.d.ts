import type { GetPermissionsHooks } from './getPermissions';
import type { RequestPermissionsHooks } from './requestPermissions';
import type { RevokePermissionsHooks } from './revokePermissions';
export declare type PermittedRpcMethodHooks = RequestPermissionsHooks & GetPermissionsHooks & RevokePermissionsHooks;
export declare const handlers: readonly [import("..").PermittedHandlerExport<RequestPermissionsHooks, [import("..").RequestedPermissions], import("..").PermissionConstraint[]>, import("..").PermittedHandlerExport<GetPermissionsHooks, [], import("..").PermissionConstraint[]>, import("..").PermittedHandlerExport<RevokePermissionsHooks, {
    [x: string]: import("@metamask/utils").Json;
}, null>];
//# sourceMappingURL=index.d.ts.map