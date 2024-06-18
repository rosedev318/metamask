import type { Infer } from 'superstruct';
export declare const JsonRpcRequestStruct: import("superstruct").Struct<{
    jsonrpc: "2.0";
    id: string | number | null;
    method: string;
    params?: import("@metamask/utils").Json[] | Record<string, import("@metamask/utils").Json>;
}, {
    jsonrpc: import("superstruct").Struct<"2.0", "2.0">;
    id: import("superstruct").Struct<string | number | null, null>;
    method: import("superstruct").Struct<string, null>;
    params: import("superstruct").Struct<import("./superstruct").ExactOptionalTag | import("@metamask/utils").Json[] | Record<string, import("@metamask/utils").Json>, null>;
}>;
/**
 * JSON-RPC request type.
 */
export declare type JsonRpcRequest = Infer<typeof JsonRpcRequestStruct>;
