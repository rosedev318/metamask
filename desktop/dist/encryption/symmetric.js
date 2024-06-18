"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = exports.createKey = void 0;
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const KEY_FORMAT = 'raw';
const KEY_USAGES = ['encrypt', 'decrypt'];
const deserializeKey = async (keyBytes) => {
    const keyBuffer = Uint8Array.from(keyBytes);
    const key = await global.crypto.subtle.importKey(KEY_FORMAT, keyBuffer, { name: ALGORITHM }, false, KEY_USAGES);
    return key;
};
const createKey = async () => {
    const key = await global.crypto.subtle.generateKey({
        name: ALGORITHM,
        length: KEY_LENGTH,
    }, true, KEY_USAGES);
    const keyBuffer = await global.crypto.subtle.exportKey(KEY_FORMAT, key);
    const keyBytes = Array.from(new Uint8Array(keyBuffer));
    return keyBytes;
};
exports.createKey = createKey;
const encrypt = async (data, keyBytes) => {
    const iv = global.crypto.getRandomValues(new Uint8Array(12));
    const key = await deserializeKey(keyBytes);
    const dataBuffer = new TextEncoder().encode(data);
    const encrypted = await global.crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, dataBuffer);
    const encryptedBytes = Array.from(new Uint8Array(encrypted));
    const ivBytes = Array.from(iv);
    return { data: encryptedBytes, iv: ivBytes };
};
exports.encrypt = encrypt;
const decrypt = async (dataBytes, keyBytes, ivBytes) => {
    const key = await deserializeKey(keyBytes);
    const data = Uint8Array.from(dataBytes);
    const iv = Uint8Array.from(ivBytes);
    const decrypted = await global.crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, data);
    const decryptedString = new TextDecoder().decode(decrypted);
    return decryptedString;
};
exports.decrypt = decrypt;
//# sourceMappingURL=symmetric.js.map