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
exports.MessageManager = void 0;
const uuid_1 = require("uuid");
const AbstractMessageManager_1 = require("./AbstractMessageManager");
const utils_1 = require("./utils");
/**
 * Controller in charge of managing - storing, adding, removing, updating - Messages.
 */
class MessageManager extends AbstractMessageManager_1.AbstractMessageManager {
    constructor() {
        super(...arguments);
        /**
         * Name of this controller used during composition
         */
        this.name = 'MessageManager';
    }
    /**
     * Creates a new Message with an 'unapproved' status using the passed messageParams.
     * this.addMessage is called to add the new Message to this.messages, and to save the
     * unapproved Messages.
     *
     * @param messageParams - The params for the eth_sign call to be made after the message
     * is approved.
     * @param req - The original request object possibly containing the origin.
     * @returns The id of the newly created message.
     */
    addUnapprovedMessage(messageParams, req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, utils_1.validateSignMessageData)(messageParams);
            if (req) {
                messageParams.origin = req.origin;
            }
            messageParams.data = (0, utils_1.normalizeMessageData)(messageParams.data);
            const messageId = (0, uuid_1.v1)();
            const messageData = {
                id: messageId,
                messageParams,
                securityAlertResponse: req === null || req === void 0 ? void 0 : req.securityAlertResponse,
                status: 'unapproved',
                time: Date.now(),
                type: 'eth_sign',
            };
            yield this.addMessage(messageData);
            this.hub.emit(`unapprovedMessage`, Object.assign(Object.assign({}, messageParams), { metamaskId: messageId }));
            return messageId;
        });
    }
    /**
     * Removes the metamaskId property from passed messageParams and returns a promise which
     * resolves the updated messageParams.
     *
     * @param messageParams - The messageParams to modify.
     * @returns Promise resolving to the messageParams with the metamaskId property removed.
     */
    prepMessageForSigning(messageParams) {
        // Using delete operation will throw an error on frozen messageParams
        const { metamaskId: _metamaskId } = messageParams, messageParamsWithoutId = __rest(messageParams, ["metamaskId"]);
        return Promise.resolve(messageParamsWithoutId);
    }
}
exports.MessageManager = MessageManager;
exports.default = MessageManager;
//# sourceMappingURL=MessageManager.js.map