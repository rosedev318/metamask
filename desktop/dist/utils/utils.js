"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid = exports.timeoutPromise = exports.flattenMessage = void 0;
const uuid_1 = require("uuid");
const flattenMessage = (data) => {
    let output;
    try {
        const stream = data.name;
        const multiplexData = data.data;
        const nestedStream = multiplexData?.name;
        const nestedData = multiplexData?.data;
        const method = nestedData?.method;
        const result = nestedData?.result;
        output = {};
        output = { ...output, ...(stream ? { stream } : {}) };
        output = { ...output, ...(nestedStream ? { type: nestedStream } : {}) };
        output = { ...output, ...(method ? { method } : {}) };
        output = { ...output, ...(result ? { isResult: true } : {}) };
    }
    catch {
        output = data;
    }
    return output;
};
exports.flattenMessage = flattenMessage;
const timeoutPromise = (promise, timeout, options = {}) => {
    return new Promise((resolve, reject) => {
        let complete = false;
        const timeoutInstance = setTimeout(() => {
            complete = true;
            options.cleanUp?.();
            reject(new Error(options.errorMessage || `Promise timeout after ${timeout}ms`));
        }, timeout);
        promise
            .then((value) => {
            if (complete) {
                return;
            }
            clearTimeout(timeoutInstance);
            resolve(value);
        })
            .catch(reject);
    });
};
exports.timeoutPromise = timeoutPromise;
exports.uuid = uuid_1.v4;
//# sourceMappingURL=utils.js.map