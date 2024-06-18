"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapsRegistryDatabaseStruct = exports.BlockedSnapStruct = exports.BlockReasonStruct = exports.VerifiedSnapStruct = exports.ImagePathStruct = exports.AdditionalSourceCodeStruct = exports.SupportStruct = exports.AuditStruct = exports.AuthorStruct = void 0;
const utils_1 = require("@metamask/utils");
const superstruct_1 = require("superstruct");
// For now, validate that each snap is using an NPM id.
const NpmIdStruct = (0, superstruct_1.refine)((0, superstruct_1.string)(), 'Npm ID', (value) => value.startsWith('npm:'));
const VerifiedSnapVersionStruct = (0, superstruct_1.object)({
    checksum: utils_1.ChecksumStruct,
});
exports.AuthorStruct = (0, superstruct_1.object)({
    name: (0, superstruct_1.string)(),
    website: (0, superstruct_1.string)(),
});
exports.AuditStruct = (0, superstruct_1.object)({
    auditor: (0, superstruct_1.string)(),
    report: (0, superstruct_1.string)(),
});
exports.SupportStruct = (0, superstruct_1.object)({
    knowledgeBase: (0, superstruct_1.optional)((0, superstruct_1.string)()),
    faq: (0, superstruct_1.optional)((0, superstruct_1.string)()),
    contact: (0, superstruct_1.optional)((0, superstruct_1.string)()),
    keyRecovery: (0, superstruct_1.optional)((0, superstruct_1.string)()),
});
exports.AdditionalSourceCodeStruct = (0, superstruct_1.object)({
    name: (0, superstruct_1.string)(),
    url: (0, superstruct_1.string)(),
});
exports.ImagePathStruct = (0, superstruct_1.pattern)((0, superstruct_1.string)(), /\.\/images\/.*\/\d+\.(?:png|jpe?g)$/u);
exports.VerifiedSnapStruct = (0, superstruct_1.object)({
    id: NpmIdStruct,
    metadata: (0, superstruct_1.object)({
        name: (0, superstruct_1.string)(),
        type: (0, superstruct_1.optional)((0, superstruct_1.enums)(['account'])),
        author: (0, superstruct_1.optional)(exports.AuthorStruct),
        website: (0, superstruct_1.optional)((0, superstruct_1.string)()),
        onboard: (0, superstruct_1.optional)((0, superstruct_1.boolean)()),
        summary: (0, superstruct_1.optional)((0, superstruct_1.string)()),
        description: (0, superstruct_1.optional)((0, superstruct_1.string)()),
        audits: (0, superstruct_1.optional)((0, superstruct_1.array)(exports.AuditStruct)),
        category: (0, superstruct_1.optional)((0, superstruct_1.enums)([
            'interoperability',
            'notifications',
            'transaction insights',
            'account management',
        ])),
        tags: (0, superstruct_1.optional)((0, superstruct_1.array)((0, superstruct_1.string)())),
        support: (0, superstruct_1.optional)(exports.SupportStruct),
        sourceCode: (0, superstruct_1.optional)((0, superstruct_1.string)()),
        hidden: (0, superstruct_1.optional)((0, superstruct_1.boolean)()),
        privateCode: (0, superstruct_1.optional)((0, superstruct_1.boolean)()),
        privacyPolicy: (0, superstruct_1.optional)((0, superstruct_1.string)()),
        termsOfUse: (0, superstruct_1.optional)((0, superstruct_1.string)()),
        additionalSourceCode: (0, superstruct_1.optional)((0, superstruct_1.array)(exports.AdditionalSourceCodeStruct)),
        screenshots: (0, superstruct_1.optional)((0, superstruct_1.size)((0, superstruct_1.array)(exports.ImagePathStruct), 3, 3)),
    }),
    versions: (0, superstruct_1.record)(utils_1.VersionStruct, VerifiedSnapVersionStruct),
});
exports.BlockReasonStruct = (0, superstruct_1.object)({
    explanation: (0, superstruct_1.optional)((0, superstruct_1.string)()),
    url: (0, superstruct_1.optional)((0, superstruct_1.string)()),
});
exports.BlockedSnapStruct = (0, superstruct_1.union)([
    (0, superstruct_1.object)({
        id: NpmIdStruct,
        versionRange: utils_1.VersionRangeStruct,
        reason: (0, superstruct_1.optional)(exports.BlockReasonStruct),
    }),
    (0, superstruct_1.object)({ checksum: utils_1.ChecksumStruct, reason: (0, superstruct_1.optional)(exports.BlockReasonStruct) }),
]);
exports.SnapsRegistryDatabaseStruct = (0, superstruct_1.object)({
    verifiedSnaps: (0, superstruct_1.record)(NpmIdStruct, exports.VerifiedSnapStruct),
    blockedSnaps: (0, superstruct_1.array)(exports.BlockedSnapStruct),
});
__exportStar(require("./verify"), exports);
//# sourceMappingURL=index.js.map