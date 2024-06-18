"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LedgerIframeBridge_instances, _LedgerIframeBridge_deviceActionMessage, _LedgerIframeBridge_setupIframe, _LedgerIframeBridge_getOrigin, _LedgerIframeBridge_eventListener, _LedgerIframeBridge_sendMessage;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerIframeBridge = exports.IFrameMessageAction = void 0;
const LEDGER_IFRAME_ID = 'LEDGER-IFRAME';
var IFrameMessageAction;
(function (IFrameMessageAction) {
    IFrameMessageAction["LedgerConnectionChange"] = "ledger-connection-change";
    IFrameMessageAction["LedgerUnlock"] = "ledger-unlock";
    IFrameMessageAction["LedgerMakeApp"] = "ledger-make-app";
    IFrameMessageAction["LedgerUpdateTransport"] = "ledger-update-transport";
    IFrameMessageAction["LedgerSignTransaction"] = "ledger-sign-transaction";
    IFrameMessageAction["LedgerSignPersonalMessage"] = "ledger-sign-personal-message";
    IFrameMessageAction["LedgerSignTypedData"] = "ledger-sign-typed-data";
})(IFrameMessageAction = exports.IFrameMessageAction || (exports.IFrameMessageAction = {}));
class LedgerIframeBridge {
    constructor() {
        _LedgerIframeBridge_instances.add(this);
        this.iframeLoaded = false;
        this.isDeviceConnected = false;
        this.currentMessageId = 0;
        this.messageCallbacks = {};
    }
    async init(bridgeUrl) {
        __classPrivateFieldGet(this, _LedgerIframeBridge_instances, "m", _LedgerIframeBridge_setupIframe).call(this, bridgeUrl);
        this.eventListener = __classPrivateFieldGet(this, _LedgerIframeBridge_instances, "m", _LedgerIframeBridge_eventListener).bind(this, bridgeUrl);
        window.addEventListener('message', this.eventListener);
    }
    async destroy() {
        if (this.eventListener) {
            window.removeEventListener('message', this.eventListener);
        }
    }
    async attemptMakeApp() {
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _LedgerIframeBridge_instances, "m", _LedgerIframeBridge_sendMessage).call(this, {
                action: IFrameMessageAction.LedgerMakeApp,
            }, (response) => {
                if (response.success) {
                    resolve(true);
                }
                else {
                    reject(response.error);
                }
            });
        });
    }
    async updateTransportMethod(transportType) {
        return new Promise((resolve, reject) => {
            // If the iframe isn't loaded yet, let's store the desired transportType value and
            // optimistically return a successful promise
            if (!this.iframeLoaded) {
                this.delayedPromise = {
                    resolve,
                    reject,
                    transportType,
                };
                return;
            }
            __classPrivateFieldGet(this, _LedgerIframeBridge_instances, "m", _LedgerIframeBridge_sendMessage).call(this, {
                action: IFrameMessageAction.LedgerUpdateTransport,
                params: { transportType },
            }, ({ success }) => {
                if (success) {
                    return resolve(true);
                }
                return reject(new Error('Ledger transport could not be updated'));
            });
        });
    }
    async getPublicKey(params) {
        return __classPrivateFieldGet(this, _LedgerIframeBridge_instances, "m", _LedgerIframeBridge_deviceActionMessage).call(this, IFrameMessageAction.LedgerUnlock, params);
    }
    async deviceSignTransaction(params) {
        return __classPrivateFieldGet(this, _LedgerIframeBridge_instances, "m", _LedgerIframeBridge_deviceActionMessage).call(this, IFrameMessageAction.LedgerSignTransaction, params);
    }
    async deviceSignMessage(params) {
        return __classPrivateFieldGet(this, _LedgerIframeBridge_instances, "m", _LedgerIframeBridge_deviceActionMessage).call(this, IFrameMessageAction.LedgerSignPersonalMessage, params);
    }
    async deviceSignTypedData(params) {
        return __classPrivateFieldGet(this, _LedgerIframeBridge_instances, "m", _LedgerIframeBridge_deviceActionMessage).call(this, IFrameMessageAction.LedgerSignTypedData, params);
    }
}
exports.LedgerIframeBridge = LedgerIframeBridge;
_LedgerIframeBridge_instances = new WeakSet(), _LedgerIframeBridge_deviceActionMessage = async function _LedgerIframeBridge_deviceActionMessage(...[action, params]) {
    return new Promise((resolve, reject) => {
        __classPrivateFieldGet(this, _LedgerIframeBridge_instances, "m", _LedgerIframeBridge_sendMessage).call(this, {
            action,
            params,
        }, ({ success, payload }) => {
            if (success) {
                return resolve(payload);
            }
            return reject(payload.error);
        });
    });
}, _LedgerIframeBridge_setupIframe = function _LedgerIframeBridge_setupIframe(bridgeUrl) {
    this.iframe = document.createElement('iframe');
    this.iframe.src = bridgeUrl;
    this.iframe.allow = `hid 'src'`;
    this.iframe.onload = async () => {
        // If the ledger live preference was set before the iframe is loaded,
        // set it after the iframe has loaded
        this.iframeLoaded = true;
        if (this.delayedPromise) {
            try {
                const result = await this.updateTransportMethod(this.delayedPromise.transportType);
                this.delayedPromise.resolve(result);
            }
            catch (error) {
                this.delayedPromise.reject(error);
            }
            finally {
                delete this.delayedPromise;
            }
        }
    };
    document.head.appendChild(this.iframe);
}, _LedgerIframeBridge_getOrigin = function _LedgerIframeBridge_getOrigin(bridgeUrl) {
    const tmp = bridgeUrl.split('/');
    tmp.splice(-1, 1);
    return tmp.join('/');
}, _LedgerIframeBridge_eventListener = function _LedgerIframeBridge_eventListener(bridgeUrl, eventMessage) {
    if (eventMessage.origin !== __classPrivateFieldGet(this, _LedgerIframeBridge_instances, "m", _LedgerIframeBridge_getOrigin).call(this, bridgeUrl)) {
        return;
    }
    if (eventMessage.data) {
        const messageCallback = this.messageCallbacks[eventMessage.data.messageId];
        if (messageCallback) {
            messageCallback(eventMessage.data);
        }
        else if (eventMessage.data.action === IFrameMessageAction.LedgerConnectionChange) {
            this.isDeviceConnected = eventMessage.data.payload.connected;
        }
    }
}, _LedgerIframeBridge_sendMessage = function _LedgerIframeBridge_sendMessage(message, callback) {
    this.currentMessageId += 1;
    const postMsg = Object.assign(Object.assign({}, message), { messageId: this.currentMessageId, target: LEDGER_IFRAME_ID });
    this.messageCallbacks[this.currentMessageId] = callback;
    if (!this.iframeLoaded || !this.iframe || !this.iframe.contentWindow) {
        throw new Error('The iframe is not loaded yet');
    }
    this.iframe.contentWindow.postMessage(postMsg, '*');
};
//# sourceMappingURL=ledger-iframe-bridge.js.map