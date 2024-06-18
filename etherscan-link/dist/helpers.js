"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPathToUrl = void 0;
exports.addPathToUrl = (customNetworkUrl, linkType, suffixType) => {
    const { username, password, protocol, host, pathname, search, hash } = new URL(customNetworkUrl);
    const newPath = pathname.endsWith('/') ? `${pathname}${linkType}/${suffixType}` : `${pathname}/${linkType}/${suffixType}`;
    const auth = username ? `${username}:${password}` : '';
    const parsedUrl = new URL(`${protocol}//${auth}${host}${newPath}${search}${hash}`);
    return parsedUrl.toString();
};
//# sourceMappingURL=helpers.js.map