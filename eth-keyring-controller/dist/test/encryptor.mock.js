"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockEncryptor = exports.MOCK_HEX = exports.MOCK_HARDCODED_KEY = exports.MOCK_ENCRYPTION_SALT = exports.MOCK_ENCRYPTION_KEY = exports.PASSWORD = void 0;
exports.PASSWORD = 'password123';
exports.MOCK_ENCRYPTION_KEY = JSON.stringify({
    alg: 'A256GCM',
    ext: true,
    k: 'wYmxkxOOFBDP6F6VuuYFcRt_Po-tSLFHCWVolsHs4VI',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    key_ops: ['encrypt', 'decrypt'],
    kty: 'oct',
});
exports.MOCK_ENCRYPTION_SALT = 'HQ5sfhsb8XAQRJtD+UqcImT7Ve4n3YMagrh05YTOsjk=';
exports.MOCK_HARDCODED_KEY = 'key';
exports.MOCK_HEX = '0xabcdef0123456789';
// eslint-disable-next-line no-restricted-globals
const MOCK_KEY = Buffer.alloc(32);
const INVALID_PASSWORD_ERROR = 'Incorrect password.';
let cacheVal;
class MockEncryptor {
    async encrypt(password, dataObj) {
        return JSON.stringify(Object.assign(Object.assign({}, (await this.encryptWithKey(password, dataObj))), { salt: this.generateSalt() }));
    }
    async decrypt(_password, _text) {
        if (_password && _password !== exports.PASSWORD) {
            throw new Error(INVALID_PASSWORD_ERROR);
        }
        return cacheVal !== null && cacheVal !== void 0 ? cacheVal : {};
    }
    async encryptWithKey(_key, dataObj) {
        cacheVal = dataObj;
        return {
            data: exports.MOCK_HEX,
            iv: 'anIv',
        };
    }
    async encryptWithDetail(key, dataObj) {
        return {
            vault: await this.encrypt(key, dataObj),
            exportedKeyString: exports.MOCK_HARDCODED_KEY,
        };
    }
    async decryptWithDetail(key, text) {
        return {
            vault: await this.decrypt(key, text),
            salt: exports.MOCK_ENCRYPTION_SALT,
            exportedKeyString: exports.MOCK_ENCRYPTION_KEY,
        };
    }
    async decryptWithKey(key, text) {
        return this.decrypt(key, text);
    }
    async keyFromPassword(_password) {
        return MOCK_KEY;
    }
    async importKey(key) {
        if (key === '{}') {
            throw new TypeError(`Failed to execute 'importKey' on 'SubtleCrypto': The provided value is not of type '(ArrayBuffer or ArrayBufferView or JsonWebKey)'.`);
        }
        return null;
    }
    async updateVault(_vault, _password) {
        return _vault;
    }
    isVaultUpdated(_vault) {
        return true;
    }
    generateSalt() {
        return exports.MOCK_ENCRYPTION_SALT;
    }
}
exports.MockEncryptor = MockEncryptor;
//# sourceMappingURL=encryptor.mock.js.map