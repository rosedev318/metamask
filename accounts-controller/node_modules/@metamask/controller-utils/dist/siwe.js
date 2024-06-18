"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectSIWE = exports.isValidSIWEOrigin = exports.parseDomainParts = void 0;
const utils_1 = require("@metamask/utils");
const siwe_parser_1 = require("@spruceid/siwe-parser");
const logger_1 = require("./logger");
const log = (0, logger_1.createModuleLogger)(logger_1.projectLogger, 'detect-siwe');
/**
 * This function strips the hex prefix from a string if it has one.
 * If the input is not a string, return it unmodified.
 *
 * @param str - The string to check
 * @returns The string without the hex prefix
 */
function safeStripHexPrefix(str) {
    if (typeof str !== 'string') {
        return str;
    }
    return (0, utils_1.remove0x)(str);
}
/**
 * This function converts a hex string to text if it's not a 32 byte hex string.
 *
 * @param hex - The hex string to convert to text
 * @returns The text representation of the hex string
 */
function msgHexToText(hex) {
    try {
        const stripped = safeStripHexPrefix(hex);
        const buff = Buffer.from(stripped, 'hex');
        return buff.length === 32 ? hex : buff.toString('utf8');
    }
    catch (e) {
        log(e);
        return hex;
    }
}
const DEFAULT_PORTS_BY_PROTOCOL = {
    'http:': '80',
    'https:': '443',
};
/**
 * Parses parts from RFC 3986 authority from EIP-4361 `domain` field.
 *
 * @param domain - input string
 * @param originProtocol - implied protocol from origin
 * @returns parsed parts
 */
const parseDomainParts = (domain, originProtocol) => {
    if (domain.match(/^[^/:]*:\/\//u)) {
        return new URL(domain);
    }
    return new URL(`${originProtocol}//${domain}`);
};
exports.parseDomainParts = parseDomainParts;
/**
 * Validates origin of a Sign-In With Ethereum (SIWE)(EIP-4361) request.
 * As per spec:
 * hostname must match.
 * port and username must match iff specified.
 * Protocol binding and full same-origin are currently not performed.
 *
 * @param req - Signature request
 * @returns true if origin matches domain; false otherwise
 */
const isValidSIWEOrigin = (req) => {
    var _a;
    try {
        const { origin, siwe } = req;
        // origin = scheme://[user[:password]@]domain[:port]
        // origin is supplied by environment and must match domain claim in message
        if (!origin || !((_a = siwe === null || siwe === void 0 ? void 0 : siwe.parsedMessage) === null || _a === void 0 ? void 0 : _a.domain)) {
            return false;
        }
        const originParts = new URL(origin);
        const domainParts = (0, exports.parseDomainParts)(siwe.parsedMessage.domain, originParts.protocol);
        if (domainParts.hostname.localeCompare(originParts.hostname, undefined, {
            sensitivity: 'accent',
        }) !== 0) {
            return false;
        }
        if (domainParts.port !== '' && domainParts.port !== originParts.port) {
            // If origin port is not specified, protocol default is implied
            return (originParts.port === '' &&
                domainParts.port === DEFAULT_PORTS_BY_PROTOCOL[originParts.protocol]);
        }
        if (domainParts.username !== '' &&
            domainParts.username !== originParts.username) {
            return false;
        }
        return true;
    }
    catch (e) {
        log(e);
        return false;
    }
};
exports.isValidSIWEOrigin = isValidSIWEOrigin;
/**
 * This function intercepts a sign message, detects if it's a
 * Sign-In With Ethereum (SIWE)(EIP-4361) message, and returns an object with
 * relevant SIWE data.
 *
 * {@see {@link https://eips.ethereum.org/EIPS/eip-4361}}
 *
 * @param msgParams - The params of the message to sign
 * @param msgParams.data - The data of the message to sign
 * @returns An object with the relevant SIWE data
 */
const detectSIWE = (msgParams) => {
    try {
        const { data } = msgParams;
        const message = msgHexToText(data);
        const parsedMessage = new siwe_parser_1.ParsedMessage(message);
        return {
            isSIWEMessage: true,
            parsedMessage,
        };
    }
    catch (error) {
        // ignore error, it's not a valid SIWE message
        return {
            isSIWEMessage: false,
            parsedMessage: null,
        };
    }
};
exports.detectSIWE = detectSIWE;
//# sourceMappingURL=siwe.js.map