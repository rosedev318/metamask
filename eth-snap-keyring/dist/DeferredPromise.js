"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeferredPromise = void 0;
/**
 * A deferred promise can be resolved by a caller different from the one who
 * created it.
 *
 * Example:
 * - "A" creates a deferred promise "P", adds it to a list, and awaits it
 * - "B" gets "P" from the list and resolves it
 * - "A" gets the resolved value
 */
class DeferredPromise {
    constructor() {
        this.resolve = undefined;
        this.reject = undefined;
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        // This is a sanity check to make sure that the promise constructor
        // actually set the `resolve` and `reject` functions.
        /* istanbul ignore next */
        if (!this.resolve || !this.reject) {
            throw new Error('Promise constructor failed');
        }
    }
}
exports.DeferredPromise = DeferredPromise;
//# sourceMappingURL=DeferredPromise.js.map