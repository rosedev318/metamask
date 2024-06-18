export declare const AccountCreatedEventStruct: import("superstruct").Struct<{
    method: "notify:accountCreated";
    params: {
        account: {
            type: "eip155:eoa" | "eip155:erc4337";
            id: string;
            address: string;
            options: Record<string, import("@metamask/utils").Json>;
            methods: ("personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation")[];
        };
    };
}, {
    method: import("superstruct").Struct<"notify:accountCreated", "notify:accountCreated">;
    params: import("superstruct").Struct<{
        account: {
            type: "eip155:eoa" | "eip155:erc4337";
            id: string;
            address: string;
            options: Record<string, import("@metamask/utils").Json>;
            methods: ("personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation")[];
        };
    }, {
        /**
         * New account object.
         */
        account: import("superstruct").Struct<{
            type: "eip155:eoa" | "eip155:erc4337";
            id: string;
            address: string;
            options: Record<string, import("@metamask/utils").Json>;
            methods: ("personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation")[];
        }, {
            id: import("superstruct").Struct<string, null>; /**
             * Request result.
             */
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
    }>;
}>;
export declare const AccountUpdatedEventStruct: import("superstruct").Struct<{
    method: "notify:accountUpdated";
    params: {
        account: {
            type: "eip155:eoa" | "eip155:erc4337";
            id: string;
            address: string;
            options: Record<string, import("@metamask/utils").Json>;
            methods: ("personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation")[];
        };
    };
}, {
    method: import("superstruct").Struct<"notify:accountUpdated", "notify:accountUpdated">;
    params: import("superstruct").Struct<{
        account: {
            type: "eip155:eoa" | "eip155:erc4337";
            id: string;
            address: string;
            options: Record<string, import("@metamask/utils").Json>;
            methods: ("personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation")[];
        };
    }, {
        /**
         * Updated account object.
         */
        account: import("superstruct").Struct<{
            type: "eip155:eoa" | "eip155:erc4337";
            id: string;
            address: string;
            options: Record<string, import("@metamask/utils").Json>;
            methods: ("personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation")[];
        }, {
            id: import("superstruct").Struct<string, null>; /**
             * Request result.
             */
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
    }>;
}>;
export declare const AccountDeletedEventStruct: import("superstruct").Struct<{
    method: "notify:accountDeleted";
    params: {
        id: string;
    };
}, {
    method: import("superstruct").Struct<"notify:accountDeleted", "notify:accountDeleted">;
    params: import("superstruct").Struct<{
        id: string;
    }, {
        /**
         * Deleted account ID.
         */
        id: import("superstruct").Struct<string, null>;
    }>;
}>;
export declare const RequestApprovedEventStruct: import("superstruct").Struct<{
    method: "notify:requestApproved";
    params: {
        id: string;
        result: import("@metamask/utils").Json;
    };
}, {
    method: import("superstruct").Struct<"notify:requestApproved", "notify:requestApproved">;
    params: import("superstruct").Struct<{
        id: string;
        result: import("@metamask/utils").Json;
    }, {
        /**
         * Request ID.
         */
        id: import("superstruct").Struct<string, null>;
        /**
         * Request result.
         */
        result: import("superstruct").Struct<import("@metamask/utils").Json, unknown>;
    }>;
}>;
export declare const RequestRejectedEventStruct: import("superstruct").Struct<{
    method: "notify:requestRejected";
    params: {
        id: string;
    };
}, {
    method: import("superstruct").Struct<"notify:requestRejected", "notify:requestRejected">;
    params: import("superstruct").Struct<{
        id: string;
    }, {
        /**
         * Request ID.
         */
        id: import("superstruct").Struct<string, null>;
    }>;
}>;
