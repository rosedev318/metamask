import type { Curve } from '../curves';
import type { SLIP10Node } from '../SLIP10Node';
import * as bip32 from './bip32';
import * as bip39 from './bip39';
import * as slip10 from './slip10';
export declare type DerivedKeys = {
    /**
     * The derived private key, can be undefined if public key derivation was used.
     */
    privateKey?: Uint8Array;
    publicKey: Uint8Array;
    chainCode: Uint8Array;
};
export declare type DeriveChildKeyArgs = {
    path: Uint8Array | string;
    curve: Curve;
    node?: SLIP10Node;
};
export declare type Deriver = {
    deriveChildKey: (args: DeriveChildKeyArgs) => Promise<SLIP10Node>;
};
export declare const derivers: {
    bip32: typeof bip32;
    bip39: typeof bip39;
    slip10: typeof slip10;
};
export { createBip39KeyFromSeed } from './bip39';
//# sourceMappingURL=index.d.ts.map