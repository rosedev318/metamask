import type { EthBaseTransaction, EthBaseUserOperation, EthKeyring, EthUserOperation, EthUserOperationPatch } from '@metamask/keyring-api';
import type { Json, Hex } from '@metamask/utils';
declare class KeyringMockWithInit implements EthKeyring<Json> {
    #private;
    static type: string;
    type: string;
    constructor(options?: Record<string, unknown> | undefined);
    init(): Promise<void>;
    addAccounts(_: number): Promise<Hex[]>;
    getAccounts(): Promise<`0x${string}`[]>;
    serialize(): Promise<{}>;
    deserialize(_: any): Promise<void>;
    removeAccount(_: any): Promise<void>;
    destroy(): Promise<void>;
    prepareUserOperation(_from: string, _txs: EthBaseTransaction[]): Promise<EthBaseUserOperation>;
    patchUserOperation(_from: string, _userOp: EthUserOperation): Promise<EthUserOperationPatch>;
    signUserOperation(_from: string, _userOp: EthUserOperation): Promise<string>;
}
export default KeyringMockWithInit;
