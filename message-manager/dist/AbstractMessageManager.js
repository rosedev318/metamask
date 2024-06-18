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
exports.AbstractMessageManager = void 0;
const base_controller_1 = require("@metamask/base-controller");
const events_1 = require("events");
/**
 * Controller in charge of managing - storing, adding, removing, updating - Messages.
 */
class AbstractMessageManager extends base_controller_1.BaseControllerV1 {
    /**
     * Creates an AbstractMessageManager instance.
     *
     * @param config - Initial options used to configure this controller.
     * @param state - Initial state to set on this controller.
     * @param securityProviderRequest - A function for verifying a message, whether it is malicious or not.
     * @param additionalFinishStatuses - Optional list of statuses that are accepted to emit a finished event.
     * @param getCurrentChainId - Optional function to get the current chainId.
     */
    constructor(config, state, securityProviderRequest, additionalFinishStatuses, getCurrentChainId) {
        super(config, state);
        /**
         * EventEmitter instance used to listen to specific message events
         */
        this.hub = new events_1.EventEmitter();
        /**
         * Name of this controller used during composition
         */
        this.name = 'AbstractMessageManager';
        this.defaultState = {
            unapprovedMessages: {},
            unapprovedMessagesCount: 0,
        };
        this.messages = [];
        this.securityProviderRequest = securityProviderRequest;
        this.additionalFinishStatuses = additionalFinishStatuses !== null && additionalFinishStatuses !== void 0 ? additionalFinishStatuses : [];
        this.getCurrentChainId = getCurrentChainId;
        this.initialize();
    }
    /**
     * Saves the unapproved messages, and their count to state.
     *
     * @param emitUpdateBadge - Whether to emit the updateBadge event.
     */
    saveMessageList(emitUpdateBadge = true) {
        const unapprovedMessages = this.getUnapprovedMessages();
        const unapprovedMessagesCount = this.getUnapprovedMessagesCount();
        this.update({ unapprovedMessages, unapprovedMessagesCount });
        if (emitUpdateBadge) {
            this.hub.emit('updateBadge');
        }
    }
    /**
     * Updates the status of a Message in this.messages.
     *
     * @param messageId - The id of the Message to update.
     * @param status - The new status of the Message.
     */
    setMessageStatus(messageId, status) {
        const message = this.getMessage(messageId);
        if (!message) {
            throw new Error(`${this.name}: Message not found for id: ${messageId}.`);
        }
        message.status = status;
        this.updateMessage(message);
        this.hub.emit(`${messageId}:${status}`, message);
        if (status === 'rejected' ||
            status === 'signed' ||
            status === 'errored' ||
            this.additionalFinishStatuses.includes(status)) {
            this.hub.emit(`${messageId}:finished`, message);
        }
    }
    /**
     * Sets a Message in this.messages to the passed Message if the ids are equal.
     * Then saves the unapprovedMessage list to storage.
     *
     * @param message - A Message that will replace an existing Message (with the id) in this.messages.
     * @param emitUpdateBadge - Whether to emit the updateBadge event.
     */
    updateMessage(message, emitUpdateBadge = true) {
        const index = this.messages.findIndex((msg) => message.id === msg.id);
        /* istanbul ignore next */
        if (index !== -1) {
            this.messages[index] = message;
        }
        this.saveMessageList(emitUpdateBadge);
    }
    /**
     * Verifies a message is malicious or not by checking it against a security provider.
     *
     * @param message - The message to verify.
     * @returns A promise that resolves to a secured message with additional security provider response data.
     */
    securityCheck(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.securityProviderRequest) {
                const securityProviderResponse = yield this.securityProviderRequest(message, message.type);
                return Object.assign(Object.assign({}, message), { securityProviderResponse });
            }
            return message;
        });
    }
    /**
     * A getter for the number of 'unapproved' Messages in this.messages.
     *
     * @returns The number of 'unapproved' Messages in this.messages.
     */
    getUnapprovedMessagesCount() {
        return Object.keys(this.getUnapprovedMessages()).length;
    }
    /**
     * A getter for the 'unapproved' Messages in state messages.
     *
     * @returns An index of Message ids to Messages, for all 'unapproved' Messages in this.messages.
     */
    getUnapprovedMessages() {
        return this.messages
            .filter((message) => message.status === 'unapproved')
            .reduce((result, message) => {
            result[message.id] = message;
            return result;
        }, {});
    }
    /**
     * Adds a passed Message to this.messages, and calls this.saveMessageList() to save
     * the unapproved Messages from that list to this.messages.
     *
     * @param message - The Message to add to this.messages.
     */
    addMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const securedMessage = yield this.securityCheck(message);
            this.messages.push(securedMessage);
            this.saveMessageList();
        });
    }
    /**
     * Returns a specified Message.
     *
     * @param messageId - The id of the Message to get.
     * @returns The Message with the id that matches the passed messageId, or undefined
     * if no Message has that id.
     */
    getMessage(messageId) {
        return this.messages.find((message) => message.id === messageId);
    }
    /**
     * Returns all the messages.
     *
     * @returns An array of messages.
     */
    getAllMessages() {
        return this.messages;
    }
    /**
     * Approves a Message. Sets the message status via a call to this.setMessageStatusApproved,
     * and returns a promise with any the message params modified for proper signing.
     *
     * @param messageParams - The messageParams to be used when signing method is called,
     * plus data added by MetaMask.
     * @returns Promise resolving to the messageParams with the metamaskId property removed.
     */
    approveMessage(messageParams) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.setMessageStatusApproved(messageParams.metamaskId);
        return this.prepMessageForSigning(messageParams);
    }
    /**
     * Sets a Message status to 'approved' via a call to this.setMessageStatus.
     *
     * @param messageId - The id of the Message to approve.
     */
    setMessageStatusApproved(messageId) {
        this.setMessageStatus(messageId, 'approved');
    }
    /**
     * Sets message status to inProgress in order to allow users to use extension
     * while waiting for a custodian signature.
     *
     * @param messageId - The id of the message to set to inProgress
     */
    setMessageStatusInProgress(messageId) {
        this.setMessageStatus(messageId, 'inProgress');
    }
    /**
     * Sets a Message status to 'signed' via a call to this.setMessageStatus and updates
     * that Message in this.messages by adding the raw signature data of the signature
     * request to the Message.
     *
     * @param messageId - The id of the Message to sign.
     * @param rawSig - The raw data of the signature request.
     */
    setMessageStatusSigned(messageId, rawSig) {
        this.setMessageStatusAndResult(messageId, rawSig, 'signed');
    }
    /**
     * Sets the message via a call to this.setResult and updates status of the message.
     *
     * @param messageId - The id of the Message to sign.
     * @param rawSig - The data to update rawSig in the message.
     * @param status - The new message status.
     */
    setMessageStatusAndResult(messageId, rawSig, status) {
        this.setResult(messageId, rawSig);
        this.setMessageStatus(messageId, status);
    }
    /**
     * Sets the message result.
     *
     * @param messageId - The id of the Message to sign.
     * @param result - The data to update result in the message.
     */
    setResult(messageId, result) {
        const message = this.getMessage(messageId);
        /* istanbul ignore if */
        if (!message) {
            return;
        }
        message.rawSig = result;
        this.updateMessage(message, false);
    }
    /**
     * Sets the messsage metadata
     *
     * @param messageId - The id of the Message to update
     * @param metadata - The data with which to replace the metadata property in the message
     */
    setMetadata(messageId, metadata) {
        const message = this.getMessage(messageId);
        if (!message) {
            throw new Error(`${this.name}: Message not found for id: ${messageId}.`);
        }
        message.metadata = metadata;
        this.updateMessage(message, false);
    }
    /**
     * Sets a Message status to 'rejected' via a call to this.setMessageStatus.
     *
     * @param messageId - The id of the Message to reject.
     */
    rejectMessage(messageId) {
        this.setMessageStatus(messageId, 'rejected');
    }
    /**
     * Creates a promise which will resolve or reject when the message process is finished.
     *
     * @param messageParamsWithId - The params for the personal_sign call to be made after the message is approved.
     * @param messageName - The name of the message
     * @returns Promise resolving to the raw data of the signature request.
     */
    waitForFinishStatus(messageParamsWithId, messageName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { metamaskId: messageId } = messageParamsWithId, messageParams = __rest(messageParamsWithId, ["metamaskId"]);
            return new Promise((resolve, reject) => {
                this.hub.once(`${messageId}:finished`, (data) => {
                    switch (data.status) {
                        case 'signed':
                            return resolve(data.rawSig);
                        case 'rejected':
                            return reject(new Error(`MetaMask ${messageName} Signature: User denied message signature.`));
                        case 'errored':
                            return reject(new Error(`MetaMask ${messageName} Signature: ${data.error}`));
                        default:
                            return reject(new Error(`MetaMask ${messageName} Signature: Unknown problem: ${JSON.stringify(messageParams)}`));
                    }
                });
            });
        });
    }
}
exports.AbstractMessageManager = AbstractMessageManager;
exports.default = AbstractMessageManager;
//# sourceMappingURL=AbstractMessageManager.js.map