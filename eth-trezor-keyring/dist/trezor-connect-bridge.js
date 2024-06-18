"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrezorConnectBridge = void 0;
const connect_web_1 = __importStar(require("@trezor/connect-web"));
class TrezorConnectBridge {
    constructor() {
        this.trezorConnectInitiated = false;
    }
    async init(settings) {
        connect_web_1.default.on(connect_web_1.DEVICE_EVENT, (event) => {
            var _a;
            if (event.type !== connect_web_1.DEVICE.CONNECT) {
                return;
            }
            this.model = (_a = event.payload.features) === null || _a === void 0 ? void 0 : _a.model;
        });
        if (this.trezorConnectInitiated) {
            return;
        }
        await connect_web_1.default.init(settings);
        this.trezorConnectInitiated = true;
    }
    dispose() {
        // This removes the Trezor Connect iframe from the DOM
        // This method is not well documented, but the code it calls can be seen
        // here: https://github.com/trezor/connect/blob/dec4a56af8a65a6059fb5f63fa3c6690d2c37e00/src/js/iframe/builder.js#L181
        connect_web_1.default.dispose();
        return Promise.resolve();
    }
    getPublicKey(params) {
        return connect_web_1.default.getPublicKey(params);
    }
    ethereumSignTransaction(params) {
        return connect_web_1.default.ethereumSignTransaction(params);
    }
    ethereumSignMessage(params) {
        return connect_web_1.default.ethereumSignMessage(params);
    }
    ethereumSignTypedData(params) {
        return connect_web_1.default.ethereumSignTypedData(params);
    }
}
exports.TrezorConnectBridge = TrezorConnectBridge;
//# sourceMappingURL=trezor-connect-bridge.js.map