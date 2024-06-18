import type { Infer } from 'superstruct';
export declare const SnapMessageStruct: import("superstruct").Struct<{
    method: string;
    params?: import("@metamask/utils").Json[] | Record<string, import("@metamask/utils").Json> | undefined;
}, {
    method: import("superstruct").Struct<string, null>;
    params: import("superstruct").Struct<import("@metamask/utils").Json[] | Record<string, import("@metamask/utils").Json> | undefined, null>;
}>;
/**
 * Message sent by the snap to manage accounts and requests.
 */
export declare type SnapMessage = Infer<typeof SnapMessageStruct>;
