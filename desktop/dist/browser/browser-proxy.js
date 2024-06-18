"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerResponseStream = void 0;
const log_1 = __importDefault(require("../utils/log"));
const _1 = require(".");
let responseStream;
const getBrowserMethod = async (key) => {
    let method = _1.browser;
    const isManifestV3 = (await _1.browser?.runtime?.getManifest())?.manifest_version === 3;
    for (let keyPart of key) {
        // replace browserAction to action to support MV3
        if (isManifestV3) {
            keyPart = keyPart.replace('browserAction', 'action');
        }
        method = method[keyPart];
        if (!method) {
            return undefined;
        }
    }
    return method;
};
const onBrowserRequest = async (data) => {
    log_1.default.debug('Received browser request', data);
    const method = await getBrowserMethod(data.key);
    if (!method) {
        log_1.default.error(`Cannot find browser method - ${data.key.join('.')}`);
        return;
    }
    const result = await method(...data.args);
    const response = { id: data.id, result };
    log_1.default.debug('Sending browser response', response);
    responseStream?.write(response);
};
const registerResponseStream = (stream) => {
    responseStream = stream;
    responseStream.on('data', (data) => onBrowserRequest(data));
};
exports.registerResponseStream = registerResponseStream;
//# sourceMappingURL=browser-proxy.js.map