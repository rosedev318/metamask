/**
 * A deferred promise can be resolved by a caller different from the one who
 * created it.
 *
 * Example:
 * - "A" creates a deferred promise "P", adds it to a list, and awaits it
 * - "B" gets "P" from the list and resolves it
 * - "A" gets the resolved value
 */
export declare class DeferredPromise<Type> {
    promise: Promise<Type>;
    resolve: (value: Type | PromiseLike<Type>) => void;
    reject: (reason?: any) => void;
    constructor();
}
