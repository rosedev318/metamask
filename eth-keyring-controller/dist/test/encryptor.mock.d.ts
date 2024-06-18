/// <reference types="node" />
import type { Json } from '@metamask/utils';
import type { ExportableKeyEncryptor } from '../types';
export declare const PASSWORD = "password123";
export declare const MOCK_ENCRYPTION_KEY: string;
export declare const MOCK_ENCRYPTION_SALT = "HQ5sfhsb8XAQRJtD+UqcImT7Ve4n3YMagrh05YTOsjk=";
export declare const MOCK_HARDCODED_KEY = "key";
export declare const MOCK_HEX = "0xabcdef0123456789";
export declare class MockEncryptor implements ExportableKeyEncryptor {
    encrypt(password: string, dataObj: any): Promise<string>;
    decrypt(_password: string, _text: string): Promise<string | number | boolean | Json[] | {
        [prop: string]: Json;
    }>;
    encryptWithKey(_key: unknown, dataObj: any): Promise<{
        data: string;
        iv: string;
    }>;
    encryptWithDetail(key: string, dataObj: any): Promise<{
        vault: string;
        exportedKeyString: string;
    }>;
    decryptWithDetail(key: string, text: string): Promise<{
        vault: string | number | boolean | Json[] | {
            [prop: string]: Json;
        };
        salt: string;
        exportedKeyString: string;
    }>;
    decryptWithKey(key: unknown, text: string): Promise<string | number | boolean | Json[] | {
        [prop: string]: Json;
    }>;
    keyFromPassword(_password: string): Promise<Buffer>;
    importKey(key: string): Promise<null>;
    updateVault(_vault: string, _password: string): Promise<string>;
    isVaultUpdated(_vault: string): boolean;
    generateSalt(): string;
}
