import { TypedTransaction } from '@ethereumjs/tx';
import { SignTypedDataVersion } from '@metamask/eth-sig-util';
import { Eip1024EncryptedData, Hex, Keyring } from '@metamask/utils';
declare type KeyringOpt = {
    withAppKeyOrigin?: string;
    version?: SignTypedDataVersion | string;
};
export default class SimpleKeyring implements Keyring<string[]> {
    #private;
    readonly type: string;
    static type: string;
    constructor(privateKeys?: string[]);
    serialize(): Promise<string[]>;
    deserialize(privateKeys?: string[]): Promise<void>;
    addAccounts(numAccounts?: number): Promise<`0x${string}`[]>;
    getAccounts(): Promise<`0x${string}`[]>;
    signTransaction(address: Hex, transaction: TypedTransaction, opts?: KeyringOpt): Promise<TypedTransaction>;
    signMessage(address: Hex, data: string, opts?: {
        withAppKeyOrigin: string;
        validateMessage: boolean;
    }): Promise<string>;
    signPersonalMessage(address: Hex, msgHex: Hex, opts?: {
        withAppKeyOrigin: string;
    }): Promise<string>;
    decryptMessage(withAccount: Hex, encryptedData: Eip1024EncryptedData): Promise<string>;
    signTypedData(address: Hex, typedData: any, opts?: KeyringOpt): Promise<string>;
    getEncryptionPublicKey(withAccount: Hex, opts?: KeyringOpt): Promise<string>;
    getAppKeyAddress(address: Hex, origin: string): Promise<`0x${string}`>;
    exportAccount(address: Hex, opts?: {
        withAppKeyOrigin: string;
    }): Promise<string>;
    removeAccount(address: string): void;
}
export {};
