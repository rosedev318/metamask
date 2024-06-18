export declare const flattenMessage: (data: any) => any;
export declare const timeoutPromise: <T>(promise: Promise<T>, timeout: number, options?: {
    errorMessage?: string;
    cleanUp?: () => void;
}) => Promise<T>;
export declare const uuid: (<T extends ArrayLike<number>>(options: import("uuid").V4Options | null | undefined, buffer: T, offset?: number | undefined) => T) & ((options?: import("uuid").V4Options | undefined) => string);
