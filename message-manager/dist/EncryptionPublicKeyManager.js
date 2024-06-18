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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionPublicKeyManager = void 0;
const uuid_1 = require("uuid");
const AbstractMessageManager_1 = require("./AbstractMessageManager");
const utils_1 = require("./utils");
/**
 * Controller in charge of managing - storing, adding, removing, updating - Messages.
 */
class EncryptionPublicKeyManager extends AbstractMessageManager_1.AbstractMessageManager {
    constructor() {
        super(...arguments);
        /**
         * Name of this controller used during composition
         */
        this.name = 'EncryptionPublicKeyManager';
    }
    /**
     * Creates a new Message with an 'unapproved' status using the passed messageParams.
     * this.addMessage is called to add the new Message to this.messages, and to save the unapproved Messages.
     *
     * @param messageParams - The params for the eth_getEncryptionPublicKey call to be made after the message is approved.
     * @param req - The original request object possibly containing the origin.
     * @returns Promise resolving to the raw data of the request.
     */
    addUnapprovedMessageAsync(messageParams, req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, utils_1.validateEncryptionPublicKeyMessageData)(messageParams);
            const messageId = yield this.addUnapprovedMessage(messageParams, req);
            return new Promise((resolve, reject) => {
                this.hub.once(`${messageId}:finished`, (data) => {
                    switch (data.status) {
                        case 'received':
                            return resolve(data.rawSig);
                        case 'rejected':
                            return reject(new Error('MetaMask EncryptionPublicKey: User denied message EncryptionPublicKey.'));
                        default:
                            return reject(new Error(`MetaMask EncryptionPublicKey: Unknown problem: ${JSON.stringify(messageParams)}`));
                    }
                });
            });
        });
    }
    /**
     * Creates a new Message with an 'unapproved' status using the passed messageParams.
     * this.addMessage is called to add the new Message to this.messages, and to save the
     * unapproved Messages.
     *
     * @param messageParams - The params for the eth_getEncryptionPublicKey call to be made after the message
     * is approved.
     * @param req - The original request object possibly containing the origin.
     * @returns The id of the newly created message.
     */
    addUnapprovedMessage(messageParams, req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req) {
                messageParams.origin = req.origin;
            }
            const messageId = (0, uuid_1.v1)();
            const messageData = {
                id: messageId,
                messageParams,
                status: 'unapproved',
                time: Date.now(),
                type: 'eth_getEncryptionPublicKey',
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
        delete messageParams.metamaskId;
        return Promise.resolve({ from: messageParams.data });
    }
}
exports.EncryptionPublicKeyManager = EncryptionPublicKeyManager;
exports.default = EncryptionPublicKeyManager;
//# sourceMappingURL=EncryptionPublicKeyManager.js.map