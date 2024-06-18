export declare const createKey: () => Promise<number[]>;
export declare const encrypt: (data: string, keyBytes: number[]) => Promise<{
    data: number[];
    iv: number[];
}>;
export declare const decrypt: (dataBytes: number[], keyBytes: number[], ivBytes: number[]) => Promise<string>;
