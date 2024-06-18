"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedMessageManager = void 0;
const uuid_1 = require("uuid");
const AbstractMessageManager_1 = require("./AbstractMessageManager");
const utils_1 = require("./utils");
/**
 * Controller in charge of managing - storing, adding, removing, updating - TypedMessages.
 */
class TypedMessageManager extends AbstractMessageManager_1.AbstractMessageManager {
    constructor() {
        super(...arguments);
        /**
         * Name of this controller used during composition
         */
        this.name = 'TypedMessageManager';
    }
    /**
     * Creates a new TypedMessage with an 'unapproved' status using the passed messageParams.
     * this.addMessage is called to add the new TypedMessage to this.messages, and to save the
     * unapproved TypedMessages.
     *
     * @param messageParams - The params for the 'eth_signTypedData' call to be made after the message
     * is approved.
     * @param req - The original request object possibly containing the origin.
     * @param version - Compatibility version EIP712.
     * @returns The id of the newly created TypedMessage.
     */
    addUnapprovedMessage(messageParams, req, version) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (version === 'V1') {
                (0, utils_1.validateTypedSignMessageDataV1)(messageParams);
            }
            if (version === 'V3' || version === 'V4') {
                const currentChainId = (_a = this.getCurrentChainId) === null || _a === void 0 ? void 0 : _a.call(this);
                (0, utils_1.validateTypedSignMessageDataV3V4)(messageParams, currentChainId);
            }
            if (typeof messageParams.data !== 'string' &&
                (version === 'V3' || version === 'V4')) {
                messageParams.data = JSON.stringify(messageParams.data);
            }
            const messageId = (0, uuid_1.v1)();
            const messageParamsMetamask = Object.assign(Object.assign({}, messageParams), { metamaskId: messageId, version });
            if (req) {
                messageParams.origin = req.origin;
            }
            const messageData = {
                id: messageId,
                messageParams,
                securityAlertResponse: req === null || req === void 0 ? void 0 : req.securityAlertResponse,
                status: 'unapproved',
                time: Date.now(),
                type: 'eth_signTypedData',
            };
            yield this.addMessage(messageData);
            this.hub.emit(`unapprovedMessage`, messageParamsMetamask);
            return messageId;
        });
    }
    /**
     * Sets a TypedMessage status to 'errored' via a call to this.setMessageStatus.
     *
     * @param messageId - The id of the TypedMessage to error.
     * @param error - The error to be included in TypedMessage.
     */
    setMessageStatusErrored(messageId, error) {
        const message = this.getMessage(messageId);
        /* istanbul ignore if */
        if (!message) {
            return;
        }
        message.error = error;
        this.updateMessage(message);
        this.setMessageStatus(messageId, 'errored');
    }
    /**
     * Removes the metamaskId and version properties from passed messageParams and returns a promise which
     * resolves the updated messageParams.
     *
     * @param messageParams - The messageParams to modify.
     * @returns Promise resolving to the messageParams with the metamaskId and version properties removed.
     */
    prepMessageForSigning(messageParams) {
        // Using delete operation will throw an error on frozen messageParams
        const { metamaskId: _metamaskId, version: _version } = messageParams, messageParamsWithoutId = __rest(messageParams, ["metamaskId", "version"]);
        return Promise.resolve(messageParamsWithoutId);
    }
}
exports.TypedMessageManager = TypedMessageManager;
exports.default = TypedMessageManager;
//# sourceMappingURL=TypedMessageManager.js.map