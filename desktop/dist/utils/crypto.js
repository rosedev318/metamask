"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashString = exports.randomHex = void 0;
const randomHex = () => {
    const random = global.crypto?.getRandomValues(new Uint8Array(12)) || Buffer.from([]);
    return Buffer.from(random).toString('hex');
};
exports.randomHex = randomHex;
const hashString = async (dataString, { isHex = false } = {}) => {
    const encoding = isHex ? 'hex' : 'utf8';
    const dataBuffer = Buffer.from(dataString, encoding);
    const hashArrayBuffer = await global.crypto.subtle.digest('SHA-512', dataBuffer);
    const hashBuffer = Buffer.from(hashArrayBuffer);
    return hashBuffer.toString('hex');
};
exports.hashString = hashString;
//# sourceMappingURL=crypto.js.map