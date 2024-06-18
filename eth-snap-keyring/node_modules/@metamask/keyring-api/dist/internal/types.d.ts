import type { Infer } from 'superstruct';
export declare const InternalAccountStruct: import("superstruct").Struct<{
    type: "eip155:eoa" | "eip155:erc4337";
    id: string;
    address: string;
    options: Record<string, import("@metamask/utils").Json>;
    methods: ("personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation")[];
    metadata: {
        name: string;
        keyring: {
            type: string;
        };
        snap?: {
            id: string;
            enabled: boolean;
            name: string;
        };
        lastSelected?: number;
    };
}, {
    metadata: import("superstruct").Struct<{
        name: string;
        keyring: {
            type: string;
        };
        snap?: {
            id: string;
            enabled: boolean;
            name: string;
        };
        lastSelected?: number;
    }, {
        name: import("superstruct").Struct<string, null>;
        snap: import("superstruct").Struct<import("../superstruct").ExactOptionalTag | {
            id: string;
            enabled: boolean;
            name: string;
        }, {
            id: import("superstruct").Struct<string, null>;
            enabled: import("superstruct").Struct<boolean, null>;
            name: import("superstruct").Struct<string, null>;
        }>;
        lastSelected: import("superstruct").Struct<number | import("../superstruct").ExactOptionalTag, null>;
        keyring: import("superstruct").Struct<{
            type: string;
        }, {
            type: import("superstruct").Struct<string, null>;
        }>;
    }>;
    id: import("superstruct").Struct<string, null>;
    address: import("superstruct").Struct<string, null>;
    options: import("superstruct").Struct<Record<string, import("@metamask/utils").Json>, null>;
    methods: import("superstruct").Struct<("personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation")[], import("superstruct").Struct<"personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation", {
        personal_sign: "personal_sign";
        eth_sign: "eth_sign";
        eth_signTransaction: "eth_signTransaction";
        eth_signTypedData_v1: "eth_signTypedData_v1";
        eth_signTypedData_v3: "eth_signTypedData_v3";
        eth_signTypedData_v4: "eth_signTypedData_v4";
        eth_prepareUserOperation: "eth_prepareUserOperation";
        eth_patchUserOperation: "eth_patchUserOperation";
        eth_signUserOperation: "eth_signUserOperation";
    }>>;
    type: import("superstruct").Struct<"eip155:eoa" | "eip155:erc4337", {
        "eip155:eoa": "eip155:eoa";
        "eip155:erc4337": "eip155:erc4337";
    }>;
}>;
/**
 * Internal account representation.
 *
 * This type is used internally by MetaMask to add additional metadata to the
 * account object. It's should not be used by external applications.
 */
export declare type InternalAccount = Infer<typeof InternalAccountStruct>;
