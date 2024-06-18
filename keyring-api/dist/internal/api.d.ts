import type { Infer } from 'superstruct';
export declare const ListAccountsRequestStruct: import("superstruct").Struct<{
    jsonrpc: "2.0";
    id: string | number | null;
    method: "keyring_listAccounts";
}, {
    method: import("superstruct").Struct<"keyring_listAccounts", "keyring_listAccounts">;
    jsonrpc: import("superstruct").Struct<"2.0", "2.0">;
    id: import("superstruct").Struct<string | number | null, null>;
}>;
export declare type ListAccountsRequest = Infer<typeof ListAccountsRequestStruct>;
export declare const ListAccountsResponseStruct: import("superstruct").Struct<{
    type: "eip155:eoa" | "eip155:erc4337";
    id: string;
    address: string;
    options: Record<string, import("@metamask/utils").Json>;
    methods: ("personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation")[];
}[], import("superstruct").Struct<{
    type: "eip155:eoa" | "eip155:erc4337";
    id: string;
    address: string;
    options: Record<string, import("@metamask/utils").Json>;
    methods: ("personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation")[];
}, {
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
}>>;
export declare type ListAccountsResponse = Infer<typeof ListAccountsResponseStruct>;
export declare const GetAccountRequestStruct: import("superstruct").Struct<{
    jsonrpc: "2.0";
    id: string | number | null;
    method: "keyring_getAccount";
    params: {
        id: string;
    };
}, {
    method: import("superstruct").Struct<"keyring_getAccount", "keyring_getAccount">;
    params: import("superstruct").Struct<{
        id: string;
    }, {
        id: import("superstruct").Struct<string, null>;
    }>;
    jsonrpc: import("superstruct").Struct<"2.0", "2.0">;
    id: import("superstruct").Struct<string | number | null, null>;
}>;
export declare type GetAccountRequest = Infer<typeof GetAccountRequestStruct>;
export declare const GetAccountResponseStruct: import("superstruct").Struct<{
    type: "eip155:eoa" | "eip155:erc4337";
    id: string;
    address: string;
    options: Record<string, import("@metamask/utils").Json>;
    methods: ("personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation")[];
}, {
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
export declare type GetAccountResponse = Infer<typeof GetAccountResponseStruct>;
export declare const CreateAccountRequestStruct: import("superstruct").Struct<{
    jsonrpc: "2.0";
    id: string | number | null;
    method: "keyring_createAccount";
    params: {
        options: Record<string, import("@metamask/utils").Json>;
    };
}, {
    method: import("superstruct").Struct<"keyring_createAccount", "keyring_createAccount">;
    params: import("superstruct").Struct<{
        options: Record<string, import("@metamask/utils").Json>;
    }, {
        options: import("superstruct").Struct<Record<string, import("@metamask/utils").Json>, null>;
    }>;
    jsonrpc: import("superstruct").Struct<"2.0", "2.0">;
    id: import("superstruct").Struct<string | number | null, null>;
}>;
export declare type CreateAccountRequest = Infer<typeof CreateAccountRequestStruct>;
export declare const CreateAccountResponseStruct: import("superstruct").Struct<{
    type: "eip155:eoa" | "eip155:erc4337";
    id: string;
    address: string;
    options: Record<string, import("@metamask/utils").Json>;
    methods: ("personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation")[];
}, {
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
export declare type CreateAccountResponse = Infer<typeof CreateAccountResponseStruct>;
export declare const FilterAccountChainsStruct: import("superstruct").Struct<{
    jsonrpc: "2.0";
    id: string | number | null;
    method: "keyring_filterAccountChains";
    params: {
        id: string;
        chains: string[];
    };
}, {
    method: import("superstruct").Struct<"keyring_filterAccountChains", "keyring_filterAccountChains">;
    params: import("superstruct").Struct<{
        id: string;
        chains: string[];
    }, {
        id: import("superstruct").Struct<string, null>;
        chains: import("superstruct").Struct<string[], import("superstruct").Struct<string, null>>;
    }>;
    jsonrpc: import("superstruct").Struct<"2.0", "2.0">;
    id: import("superstruct").Struct<string | number | null, null>;
}>;
export declare type FilterAccountChainsRequest = Infer<typeof FilterAccountChainsStruct>;
export declare const FilterAccountChainsResponseStruct: import("superstruct").Struct<string[], import("superstruct").Struct<string, null>>;
export declare type FilterAccountChainsResponse = Infer<typeof FilterAccountChainsResponseStruct>;
export declare const UpdateAccountRequestStruct: import("superstruct").Struct<{
    jsonrpc: "2.0";
    id: string | number | null;
    method: "keyring_updateAccount";
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
    method: import("superstruct").Struct<"keyring_updateAccount", "keyring_updateAccount">;
    params: import("superstruct").Struct<{
        account: {
            type: "eip155:eoa" | "eip155:erc4337";
            id: string;
            address: string;
            options: Record<string, import("@metamask/utils").Json>;
            methods: ("personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation")[];
        };
    }, {
        account: import("superstruct").Struct<{
            type: "eip155:eoa" | "eip155:erc4337";
            id: string;
            address: string;
            options: Record<string, import("@metamask/utils").Json>;
            methods: ("personal_sign" | "eth_sign" | "eth_signTransaction" | "eth_signTypedData_v1" | "eth_signTypedData_v3" | "eth_signTypedData_v4" | "eth_prepareUserOperation" | "eth_patchUserOperation" | "eth_signUserOperation")[];
        }, {
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
    }>;
    jsonrpc: import("superstruct").Struct<"2.0", "2.0">;
    id: import("superstruct").Struct<string | number | null, null>;
}>;
export declare type UpdateAccountRequest = Infer<typeof UpdateAccountRequestStruct>;
export declare const UpdateAccountResponseStruct: import("superstruct").Struct<null, null>;
export declare type UpdateAccountResponse = Infer<typeof UpdateAccountResponseStruct>;
export declare const DeleteAccountRequestStruct: import("superstruct").Struct<{
    jsonrpc: "2.0";
    id: string | number | null;
    method: "keyring_deleteAccount";
    params: {
        id: string;
    };
}, {
    method: import("superstruct").Struct<"keyring_deleteAccount", "keyring_deleteAccount">;
    params: import("superstruct").Struct<{
        id: string;
    }, {
        id: import("superstruct").Struct<string, null>;
    }>;
    jsonrpc: import("superstruct").Struct<"2.0", "2.0">;
    id: import("superstruct").Struct<string | number | null, null>;
}>;
export declare type DeleteAccountRequest = Infer<typeof DeleteAccountRequestStruct>;
export declare const DeleteAccountResponseStruct: import("superstruct").Struct<null, null>;
export declare type DeleteAccountResponse = Infer<typeof DeleteAccountResponseStruct>;
export declare const ExportAccountRequestStruct: import("superstruct").Struct<{
    jsonrpc: "2.0";
    id: string | number | null;
    method: "keyring_exportAccount";
    params: {
        id: string;
    };
}, {
    method: import("superstruct").Struct<"keyring_exportAccount", "keyring_exportAccount">;
    params: import("superstruct").Struct<{
        id: string;
    }, {
        id: import("superstruct").Struct<string, null>;
    }>;
    jsonrpc: import("superstruct").Struct<"2.0", "2.0">;
    id: import("superstruct").Struct<string | number | null, null>;
}>;
export declare type ExportAccountRequest = Infer<typeof ExportAccountRequestStruct>;
export declare const ExportAccountResponseStruct: import("superstruct").Struct<Record<string, import("@metamask/utils").Json>, null>;
export declare type ExportAccountResponse = Infer<typeof ExportAccountResponseStruct>;
export declare const ListRequestsRequestStruct: import("superstruct").Struct<{
    jsonrpc: "2.0";
    id: string | number | null;
    method: "keyring_listRequests";
}, {
    method: import("superstruct").Struct<"keyring_listRequests", "keyring_listRequests">;
    jsonrpc: import("superstruct").Struct<"2.0", "2.0">;
    id: import("superstruct").Struct<string | number | null, null>;
}>;
export declare type ListRequestsRequest = Infer<typeof ListRequestsRequestStruct>;
export declare const ListRequestsResponseStruct: import("superstruct").Struct<{
    id: string;
    scope: string;
    account: string;
    request: {
        method: string;
        params?: import("@metamask/utils").Json[] | Record<string, import("@metamask/utils").Json>;
    };
}[], import("superstruct").Struct<{
    id: string;
    scope: string;
    account: string;
    request: {
        method: string;
        params?: import("@metamask/utils").Json[] | Record<string, import("@metamask/utils").Json>;
    };
}, {
    id: import("superstruct").Struct<string, null>;
    scope: import("superstruct").Struct<string, null>;
    account: import("superstruct").Struct<string, null>;
    request: import("superstruct").Struct<{
        method: string;
        params?: import("@metamask/utils").Json[] | Record<string, import("@metamask/utils").Json>;
    }, {
        method: import("superstruct").Struct<string, null>;
        params: import("superstruct").Struct<import("..").ExactOptionalTag | import("@metamask/utils").Json[] | Record<string, import("@metamask/utils").Json>, null>;
    }>;
}>>;
export declare type ListRequestsResponse = Infer<typeof ListRequestsResponseStruct>;
export declare const GetRequestRequestStruct: import("superstruct").Struct<{
    jsonrpc: "2.0";
    id: string | number | null;
    method: "keyring_getRequest";
    params: {
        id: string;
    };
}, {
    method: import("superstruct").Struct<"keyring_getRequest", "keyring_getRequest">;
    params: import("superstruct").Struct<{
        id: string;
    }, {
        id: import("superstruct").Struct<string, null>;
    }>;
    jsonrpc: import("superstruct").Struct<"2.0", "2.0">;
    id: import("superstruct").Struct<string | number | null, null>;
}>;
export declare type GetRequestRequest = Infer<typeof GetRequestRequestStruct>;
export declare const GetRequestResponseStruct: import("superstruct").Struct<{
    id: string;
    scope: string;
    account: string;
    request: {
        method: string;
        params?: import("@metamask/utils").Json[] | Record<string, import("@metamask/utils").Json>;
    };
}, {
    id: import("superstruct").Struct<string, null>;
    scope: import("superstruct").Struct<string, null>;
    account: import("superstruct").Struct<string, null>;
    request: import("superstruct").Struct<{
        method: string;
        params?: import("@metamask/utils").Json[] | Record<string, import("@metamask/utils").Json>;
    }, {
        method: import("superstruct").Struct<string, null>;
        params: import("superstruct").Struct<import("..").ExactOptionalTag | import("@metamask/utils").Json[] | Record<string, import("@metamask/utils").Json>, null>;
    }>;
}>;
export declare type GetRequestResponse = Infer<typeof GetRequestResponseStruct>;
export declare const SubmitRequestRequestStruct: import("superstruct").Struct<{
    jsonrpc: "2.0";
    id: string | number | null;
    method: "keyring_submitRequest";
    params: {
        id: string;
        scope: string;
        account: string;
        request: {
            method: string;
            params?: import("@metamask/utils").Json[] | Record<string, import("@metamask/utils").Json>;
        };
    };
}, {
    method: import("superstruct").Struct<"keyring_submitRequest", "keyring_submitRequest">;
    params: import("superstruct").Struct<{
        id: string;
        scope: string;
        account: string;
        request: {
            method: string;
            params?: import("@metamask/utils").Json[] | Record<string, import("@metamask/utils").Json>;
        };
    }, {
        id: import("superstruct").Struct<string, null>;
        scope: import("superstruct").Struct<string, null>;
        account: import("superstruct").Struct<string, null>;
        request: import("superstruct").Struct<{
            method: string;
            params?: import("@metamask/utils").Json[] | Record<string, import("@metamask/utils").Json>;
        }, {
            method: import("superstruct").Struct<string, null>;
            params: import("superstruct").Struct<import("..").ExactOptionalTag | import("@metamask/utils").Json[] | Record<string, import("@metamask/utils").Json>, null>;
        }>;
    }>;
    jsonrpc: import("superstruct").Struct<"2.0", "2.0">;
    id: import("superstruct").Struct<string | number | null, null>;
}>;
export declare type SubmitRequestRequest = Infer<typeof SubmitRequestRequestStruct>;
export declare const SubmitRequestResponseStruct: import("superstruct").Struct<{
    pending: true;
    redirect?: {
        message?: string;
        url?: string;
    };
} | {
    pending: false;
    result: import("@metamask/utils").Json;
}, null>;
export declare type SubmitRequestResponse = Infer<typeof SubmitRequestResponseStruct>;
export declare const ApproveRequestRequestStruct: import("superstruct").Struct<{
    jsonrpc: "2.0";
    id: string | number | null;
    method: "keyring_approveRequest";
    params: {
        id: string;
        data: Record<string, import("@metamask/utils").Json>;
    };
}, {
    method: import("superstruct").Struct<"keyring_approveRequest", "keyring_approveRequest">;
    params: import("superstruct").Struct<{
        id: string;
        data: Record<string, import("@metamask/utils").Json>;
    }, {
        id: import("superstruct").Struct<string, null>;
        data: import("superstruct").Struct<Record<string, import("@metamask/utils").Json>, null>;
    }>;
    jsonrpc: import("superstruct").Struct<"2.0", "2.0">;
    id: import("superstruct").Struct<string | number | null, null>;
}>;
export declare type ApproveRequestRequest = Infer<typeof ApproveRequestRequestStruct>;
export declare const ApproveRequestResponseStruct: import("superstruct").Struct<null, null>;
export declare type ApproveRequestResponse = Infer<typeof ApproveRequestResponseStruct>;
export declare const RejectRequestRequestStruct: import("superstruct").Struct<{
    jsonrpc: "2.0";
    id: string | number | null;
    method: "keyring_rejectRequest";
    params: {
        id: string;
    };
}, {
    method: import("superstruct").Struct<"keyring_rejectRequest", "keyring_rejectRequest">;
    params: import("superstruct").Struct<{
        id: string;
    }, {
        id: import("superstruct").Struct<string, null>;
    }>;
    jsonrpc: import("superstruct").Struct<"2.0", "2.0">;
    id: import("superstruct").Struct<string | number | null, null>;
}>;
export declare type RejectRequestRequest = Infer<typeof RejectRequestRequestStruct>;
export declare const RejectRequestResponseStruct: import("superstruct").Struct<null, null>;
export declare type RejectRequestResponse = Infer<typeof RejectRequestResponseStruct>;
