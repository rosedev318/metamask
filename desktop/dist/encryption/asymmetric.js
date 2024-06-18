"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = exports.createKeyPair = void 0;
const eciesjs = __importStar(require("eciesjs"));
const createKeyPair = () => {
    const privateKeyObject = new eciesjs.PrivateKey();
    const publicKeyObject = privateKeyObject.publicKey;
    const privateKey = privateKeyObject.toHex();
    const publicKey = publicKeyObject.toHex();
    return { privateKey, publicKey };
};
exports.createKeyPair = createKeyPair;
const encrypt = (data, publicKeyHex) => {
    const dataBuffer = Buffer.from(data, 'utf8');
    const encryptedBuffer = eciesjs.encrypt(publicKeyHex, dataBuffer);
    return encryptedBuffer.toString('hex');
};
exports.encrypt = encrypt;
const decrypt = (dataHex, privateKeyHex) => {
    const dataBuffer = Buffer.from(dataHex, 'hex');
    const decryptedBuffer = eciesjs.decrypt(privateKeyHex, dataBuffer);
    return decryptedBuffer.toString('utf8');
};
exports.decrypt = decrypt;
//# sourceMappingURL=asymmetric.js.map