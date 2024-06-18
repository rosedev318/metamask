import type { Infer } from 'superstruct';
export declare const AuthorStruct: import("superstruct").Struct<{
    name: string;
    website: string;
}, {
    name: import("superstruct").Struct<string, null>;
    website: import("superstruct").Struct<string, null>;
}>;
export declare type Author = Infer<typeof AuthorStruct>;
export declare const AuditStruct: import("superstruct").Struct<{
    report: string;
    auditor: string;
}, {
    auditor: import("superstruct").Struct<string, null>;
    report: import("superstruct").Struct<string, null>;
}>;
export declare type Audit = Infer<typeof AuditStruct>;
export declare const SupportStruct: import("superstruct").Struct<{
    knowledgeBase?: string | undefined;
    faq?: string | undefined;
    contact?: string | undefined;
    keyRecovery?: string | undefined;
}, {
    knowledgeBase: import("superstruct").Struct<string | undefined, null>;
    faq: import("superstruct").Struct<string | undefined, null>;
    contact: import("superstruct").Struct<string | undefined, null>;
    keyRecovery: import("superstruct").Struct<string | undefined, null>;
}>;
export declare type Support = Infer<typeof SupportStruct>;
export declare const AdditionalSourceCodeStruct: import("superstruct").Struct<{
    url: string;
    name: string;
}, {
    name: import("superstruct").Struct<string, null>;
    url: import("superstruct").Struct<string, null>;
}>;
export declare const ImagePathStruct: import("superstruct").Struct<string, null>;
export declare const VerifiedSnapStruct: import("superstruct").Struct<{
    id: string;
    metadata: {
        name: string;
        type?: "account" | undefined;
        hidden?: boolean | undefined;
        summary?: string | undefined;
        description?: string | undefined;
        website?: string | undefined;
        author?: {
            name: string;
            website: string;
        } | undefined;
        onboard?: boolean | undefined;
        audits?: {
            report: string;
            auditor: string;
        }[] | undefined;
        category?: "notifications" | "interoperability" | "transaction insights" | "account management" | undefined;
        tags?: string[] | undefined;
        support?: {
            knowledgeBase?: string | undefined;
            faq?: string | undefined;
            contact?: string | undefined;
            keyRecovery?: string | undefined;
        } | undefined;
        sourceCode?: string | undefined;
        privateCode?: boolean | undefined;
        privacyPolicy?: string | undefined;
        termsOfUse?: string | undefined;
        additionalSourceCode?: {
            url: string;
            name: string;
        }[] | undefined;
        screenshots?: string[] | undefined;
    };
    versions: Record<import("@metamask/utils").SemVerVersion, {
        checksum: string;
    }>;
}, {
    id: import("superstruct").Struct<string, null>;
    metadata: import("superstruct").Struct<{
        name: string;
        type?: "account" | undefined;
        hidden?: boolean | undefined;
        summary?: string | undefined;
        description?: string | undefined;
        website?: string | undefined;
        author?: {
            name: string;
            website: string;
        } | undefined;
        onboard?: boolean | undefined;
        audits?: {
            report: string;
            auditor: string;
        }[] | undefined;
        category?: "notifications" | "interoperability" | "transaction insights" | "account management" | undefined;
        tags?: string[] | undefined;
        support?: {
            knowledgeBase?: string | undefined;
            faq?: string | undefined;
            contact?: string | undefined;
            keyRecovery?: string | undefined;
        } | undefined;
        sourceCode?: string | undefined;
        privateCode?: boolean | undefined;
        privacyPolicy?: string | undefined;
        termsOfUse?: string | undefined;
        additionalSourceCode?: {
            url: string;
            name: string;
        }[] | undefined;
        screenshots?: string[] | undefined;
    }, {
        name: import("superstruct").Struct<string, null>;
        type: import("superstruct").Struct<"account" | undefined, {
            account: "account";
        }>;
        author: import("superstruct").Struct<{
            name: string;
            website: string;
        } | undefined, {
            name: import("superstruct").Struct<string, null>;
            website: import("superstruct").Struct<string, null>;
        }>;
        website: import("superstruct").Struct<string | undefined, null>;
        onboard: import("superstruct").Struct<boolean | undefined, null>;
        summary: import("superstruct").Struct<string | undefined, null>;
        description: import("superstruct").Struct<string | undefined, null>;
        audits: import("superstruct").Struct<{
            report: string;
            auditor: string;
        }[] | undefined, import("superstruct").Struct<{
            report: string;
            auditor: string;
        }, {
            auditor: import("superstruct").Struct<string, null>;
            report: import("superstruct").Struct<string, null>;
        }>>;
        category: import("superstruct").Struct<"notifications" | "interoperability" | "transaction insights" | "account management" | undefined, {
            notifications: "notifications";
            interoperability: "interoperability";
            "transaction insights": "transaction insights";
            "account management": "account management";
        }>;
        tags: import("superstruct").Struct<string[] | undefined, import("superstruct").Struct<string, null>>;
        support: import("superstruct").Struct<{
            knowledgeBase?: string | undefined;
            faq?: string | undefined;
            contact?: string | undefined;
            keyRecovery?: string | undefined;
        } | undefined, {
            knowledgeBase: import("superstruct").Struct<string | undefined, null>;
            faq: import("superstruct").Struct<string | undefined, null>;
            contact: import("superstruct").Struct<string | undefined, null>;
            keyRecovery: import("superstruct").Struct<string | undefined, null>;
        }>;
        sourceCode: import("superstruct").Struct<string | undefined, null>;
        hidden: import("superstruct").Struct<boolean | undefined, null>;
        privateCode: import("superstruct").Struct<boolean | undefined, null>;
        privacyPolicy: import("superstruct").Struct<string | undefined, null>;
        termsOfUse: import("superstruct").Struct<string | undefined, null>;
        additionalSourceCode: import("superstruct").Struct<{
            url: string;
            name: string;
        }[] | undefined, import("superstruct").Struct<{
            url: string;
            name: string;
        }, {
            name: import("superstruct").Struct<string, null>;
            url: import("superstruct").Struct<string, null>;
        }>>;
        screenshots: import("superstruct").Struct<string[] | undefined, import("superstruct").Struct<string, null>>;
    }>;
    versions: import("superstruct").Struct<Record<import("@metamask/utils").SemVerVersion, {
        checksum: string;
    }>, null>;
}>;
export declare type VerifiedSnap = Infer<typeof VerifiedSnapStruct>;
export declare const BlockReasonStruct: import("superstruct").Struct<{
    url?: string | undefined;
    explanation?: string | undefined;
}, {
    explanation: import("superstruct").Struct<string | undefined, null>;
    url: import("superstruct").Struct<string | undefined, null>;
}>;
export declare type BlockReason = Infer<typeof BlockReasonStruct>;
export declare const BlockedSnapStruct: import("superstruct").Struct<{
    id: string;
    versionRange: import("@metamask/utils").SemVerRange;
    reason?: {
        url?: string | undefined;
        explanation?: string | undefined;
    } | undefined;
} | {
    checksum: string;
    reason?: {
        url?: string | undefined;
        explanation?: string | undefined;
    } | undefined;
}, null>;
export declare const SnapsRegistryDatabaseStruct: import("superstruct").Struct<{
    verifiedSnaps: Record<string, {
        id: string;
        metadata: {
            name: string;
            type?: "account" | undefined;
            hidden?: boolean | undefined;
            summary?: string | undefined;
            description?: string | undefined;
            website?: string | undefined;
            author?: {
                name: string;
                website: string;
            } | undefined;
            onboard?: boolean | undefined;
            audits?: {
                report: string;
                auditor: string;
            }[] | undefined;
            category?: "notifications" | "interoperability" | "transaction insights" | "account management" | undefined;
            tags?: string[] | undefined;
            support?: {
                knowledgeBase?: string | undefined;
                faq?: string | undefined;
                contact?: string | undefined;
                keyRecovery?: string | undefined;
            } | undefined;
            sourceCode?: string | undefined;
            privateCode?: boolean | undefined;
            privacyPolicy?: string | undefined;
            termsOfUse?: string | undefined;
            additionalSourceCode?: {
                url: string;
                name: string;
            }[] | undefined;
            screenshots?: string[] | undefined;
        };
        versions: Record<import("@metamask/utils").SemVerVersion, {
            checksum: string;
        }>;
    }>;
    blockedSnaps: ({
        id: string;
        versionRange: import("@metamask/utils").SemVerRange;
        reason?: {
            url?: string | undefined;
            explanation?: string | undefined;
        } | undefined;
    } | {
        checksum: string;
        reason?: {
            url?: string | undefined;
            explanation?: string | undefined;
        } | undefined;
    })[];
}, {
    verifiedSnaps: import("superstruct").Struct<Record<string, {
        id: string;
        metadata: {
            name: string;
            type?: "account" | undefined;
            hidden?: boolean | undefined;
            summary?: string | undefined;
            description?: string | undefined;
            website?: string | undefined;
            author?: {
                name: string;
                website: string;
            } | undefined;
            onboard?: boolean | undefined;
            audits?: {
                report: string;
                auditor: string;
            }[] | undefined;
            category?: "notifications" | "interoperability" | "transaction insights" | "account management" | undefined;
            tags?: string[] | undefined;
            support?: {
                knowledgeBase?: string | undefined;
                faq?: string | undefined;
                contact?: string | undefined;
                keyRecovery?: string | undefined;
            } | undefined;
            sourceCode?: string | undefined;
            privateCode?: boolean | undefined;
            privacyPolicy?: string | undefined;
            termsOfUse?: string | undefined;
            additionalSourceCode?: {
                url: string;
                name: string;
            }[] | undefined;
            screenshots?: string[] | undefined;
        };
        versions: Record<import("@metamask/utils").SemVerVersion, {
            checksum: string;
        }>;
    }>, null>;
    blockedSnaps: import("superstruct").Struct<({
        id: string;
        versionRange: import("@metamask/utils").SemVerRange;
        reason?: {
            url?: string | undefined;
            explanation?: string | undefined;
        } | undefined;
    } | {
        checksum: string;
        reason?: {
            url?: string | undefined;
            explanation?: string | undefined;
        } | undefined;
    })[], import("superstruct").Struct<{
        id: string;
        versionRange: import("@metamask/utils").SemVerRange;
        reason?: {
            url?: string | undefined;
            explanation?: string | undefined;
        } | undefined;
    } | {
        checksum: string;
        reason?: {
            url?: string | undefined;
            explanation?: string | undefined;
        } | undefined;
    }, null>>;
}>;
export declare type SnapsRegistryDatabase = Infer<typeof SnapsRegistryDatabaseStruct>;
export * from './verify';
