export interface KeyPair {
    privateKey: string;
    publicKey: string;
}
export declare const createKeyPair: () => KeyPair;
export declare const encrypt: (data: string, publicKeyHex: string) => string;
export declare const decrypt: (dataHex: string, privateKeyHex: string) => string;
