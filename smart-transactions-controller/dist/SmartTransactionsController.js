"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_INTERVAL = void 0;
const base_controller_1 = require("@metamask/base-controller");
const controller_utils_1 = require("@metamask/controller-utils");
const bignumber_js_1 = require("bignumber.js");
const bignumber_1 = require("@ethersproject/bignumber");
const providers_1 = require("@ethersproject/providers");
const bytes_1 = require("@ethersproject/bytes");
const mapValues_1 = __importDefault(require("lodash/mapValues"));
const cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
const types_1 = require("./types");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const SECOND = 1000;
exports.DEFAULT_INTERVAL = SECOND * 5;
class SmartTransactionsController extends base_controller_1.BaseController {
    constructor({ onNetworkStateChange, getNonceLock, provider, confirmExternalTransaction, trackMetaMetricsEvent, }, config, state) {
        super(config, state);
        this.defaultConfig = {
            interval: exports.DEFAULT_INTERVAL,
            chainId: constants_1.CHAIN_IDS.ETHEREUM,
            clientId: 'default',
            supportedChainIds: [constants_1.CHAIN_IDS.ETHEREUM, constants_1.CHAIN_IDS.RINKEBY],
        };
        this.defaultState = {
            smartTransactionsState: {
                smartTransactions: {},
                userOptIn: undefined,
                userOptInV2: undefined,
                fees: {
                    approvalTxFees: undefined,
                    tradeTxFees: undefined,
                },
                liveness: true,
            },
        };
        this.getNonceLock = getNonceLock;
        this.ethersProvider = new providers_1.Web3Provider(provider);
        this.confirmExternalTransaction = confirmExternalTransaction;
        this.trackMetaMetricsEvent = trackMetaMetricsEvent;
        this.initialize();
        this.initializeSmartTransactionsForChainId();
        onNetworkStateChange(({ providerConfig: newProvider }) => {
            const { chainId } = newProvider;
            this.configure({ chainId });
            this.initializeSmartTransactionsForChainId();
            this.checkPoll(this.state);
            this.ethersProvider = new providers_1.Web3Provider(provider);
        });
        this.subscribe((currentState) => this.checkPoll(currentState));
    }
    /* istanbul ignore next */
    async fetch(request, options) {
        const { clientId } = this.config;
        const fetchOptions = Object.assign(Object.assign({}, options), { headers: Object.assign({ 'Content-Type': 'application/json' }, (clientId && { 'X-Client-Id': clientId })) });
        return (0, utils_1.handleFetch)(request, fetchOptions);
    }
    checkPoll(state) {
        const { smartTransactions } = state.smartTransactionsState;
        const currentSmartTransactions = smartTransactions[this.config.chainId];
        const pendingTransactions = currentSmartTransactions === null || currentSmartTransactions === void 0 ? void 0 : currentSmartTransactions.filter(utils_1.isSmartTransactionPending);
        if (!this.timeoutHandle && (pendingTransactions === null || pendingTransactions === void 0 ? void 0 : pendingTransactions.length) > 0) {
            this.poll();
        }
        else if (this.timeoutHandle && (pendingTransactions === null || pendingTransactions === void 0 ? void 0 : pendingTransactions.length) === 0) {
            this.stop();
        }
    }
    initializeSmartTransactionsForChainId() {
        var _a;
        if (this.config.supportedChainIds.includes(this.config.chainId)) {
            const { smartTransactionsState } = this.state;
            this.update({
                smartTransactionsState: Object.assign(Object.assign({}, smartTransactionsState), { smartTransactions: Object.assign(Object.assign({}, smartTransactionsState.smartTransactions), { [this.config.chainId]: (_a = smartTransactionsState.smartTransactions[this.config.chainId]) !== null && _a !== void 0 ? _a : [] }) }),
            });
        }
    }
    async poll(interval) {
        const { chainId, supportedChainIds } = this.config;
        interval && this.configure({ interval }, false, false);
        this.timeoutHandle && clearInterval(this.timeoutHandle);
        if (!supportedChainIds.includes(chainId)) {
            return;
        }
        await (0, controller_utils_1.safelyExecute)(() => this.updateSmartTransactions());
        this.timeoutHandle = setInterval(() => {
            (0, controller_utils_1.safelyExecute)(() => this.updateSmartTransactions());
        }, this.config.interval);
    }
    async stop() {
        this.timeoutHandle && clearInterval(this.timeoutHandle);
        this.timeoutHandle = undefined;
    }
    setOptInState(state) {
        this.update({
            smartTransactionsState: Object.assign(Object.assign({}, this.state.smartTransactionsState), { userOptInV2: state }),
        });
    }
    trackStxStatusChange(smartTransaction, prevSmartTransaction) {
        if (!prevSmartTransaction) {
            return; // Don't track the first STX, because it doesn't have all necessary params.
        }
        let updatedSmartTransaction = (0, cloneDeep_1.default)(smartTransaction);
        updatedSmartTransaction = Object.assign(Object.assign({}, (0, cloneDeep_1.default)(prevSmartTransaction)), updatedSmartTransaction);
        if (!updatedSmartTransaction.swapMetaData ||
            (updatedSmartTransaction.status === prevSmartTransaction.status &&
                prevSmartTransaction.swapMetaData)) {
            return; // If status hasn't changed, don't track it again.
        }
        const sensitiveProperties = {
            stx_status: updatedSmartTransaction.status,
            token_from_symbol: updatedSmartTransaction.sourceTokenSymbol,
            token_to_symbol: updatedSmartTransaction.destinationTokenSymbol,
            processing_time: (0, utils_1.getStxProcessingTime)(updatedSmartTransaction.time),
            stx_enabled: true,
            current_stx_enabled: true,
            stx_user_opt_in: true,
        };
        this.trackMetaMetricsEvent({
            event: 'STX Status Updated',
            category: 'swaps',
            sensitiveProperties,
        });
    }
    isNewSmartTransaction(smartTransactionUuid) {
        const { chainId } = this.config;
        const { smartTransactionsState } = this.state;
        const { smartTransactions } = smartTransactionsState;
        const currentSmartTransactions = smartTransactions[chainId];
        const currentIndex = currentSmartTransactions === null || currentSmartTransactions === void 0 ? void 0 : currentSmartTransactions.findIndex((stx) => stx.uuid === smartTransactionUuid);
        return currentIndex === -1 || currentIndex === undefined;
    }
    updateSmartTransaction(smartTransaction) {
        const { chainId } = this.config;
        const { smartTransactionsState } = this.state;
        const { smartTransactions } = smartTransactionsState;
        const currentSmartTransactions = smartTransactions[chainId];
        const currentIndex = currentSmartTransactions === null || currentSmartTransactions === void 0 ? void 0 : currentSmartTransactions.findIndex((stx) => stx.uuid === smartTransaction.uuid);
        const isNewSmartTransaction = this.isNewSmartTransaction(smartTransaction.uuid);
        this.trackStxStatusChange(smartTransaction, isNewSmartTransaction
            ? undefined
            : currentSmartTransactions[currentIndex]);
        if (isNewSmartTransaction) {
            // add smart transaction
            const cancelledNonceIndex = currentSmartTransactions.findIndex((stx) => {
                var _a, _b, _c;
                return ((_a = stx.txParams) === null || _a === void 0 ? void 0 : _a.nonce) === ((_b = smartTransaction.txParams) === null || _b === void 0 ? void 0 : _b.nonce) &&
                    ((_c = stx.status) === null || _c === void 0 ? void 0 : _c.startsWith('cancelled'));
            });
            const snapshot = (0, cloneDeep_1.default)(smartTransaction);
            const history = [snapshot];
            const historifiedSmartTransaction = Object.assign(Object.assign({}, smartTransaction), { history });
            const nextSmartTransactions = cancelledNonceIndex > -1
                ? currentSmartTransactions
                    .slice(0, cancelledNonceIndex)
                    .concat(currentSmartTransactions.slice(cancelledNonceIndex + 1))
                    .concat(historifiedSmartTransaction)
                : currentSmartTransactions.concat(historifiedSmartTransaction);
            this.update({
                smartTransactionsState: Object.assign(Object.assign({}, smartTransactionsState), { smartTransactions: Object.assign(Object.assign({}, smartTransactionsState.smartTransactions), { [chainId]: nextSmartTransactions }) }),
            });
            return;
        }
        if ((smartTransaction.status === types_1.SmartTransactionStatuses.SUCCESS ||
            smartTransaction.status === types_1.SmartTransactionStatuses.REVERTED) &&
            !smartTransaction.confirmed) {
            // confirm smart transaction
            const currentSmartTransaction = currentSmartTransactions[currentIndex];
            const nextSmartTransaction = Object.assign(Object.assign({}, currentSmartTransaction), smartTransaction);
            this.confirmSmartTransaction(nextSmartTransaction);
        }
        this.update({
            smartTransactionsState: Object.assign(Object.assign({}, smartTransactionsState), { smartTransactions: Object.assign(Object.assign({}, smartTransactionsState.smartTransactions), { [chainId]: smartTransactionsState.smartTransactions[chainId].map((item, index) => {
                        return index === currentIndex
                            ? Object.assign(Object.assign({}, item), smartTransaction) : item;
                    }) }) }),
        });
    }
    async updateSmartTransactions() {
        const { smartTransactions } = this.state.smartTransactionsState;
        const { chainId } = this.config;
        const currentSmartTransactions = smartTransactions === null || smartTransactions === void 0 ? void 0 : smartTransactions[chainId];
        const transactionsToUpdate = currentSmartTransactions
            .filter(utils_1.isSmartTransactionPending)
            .map((smartTransaction) => smartTransaction.uuid);
        if (transactionsToUpdate.length > 0) {
            this.fetchSmartTransactionsStatus(transactionsToUpdate);
        }
    }
    async confirmSmartTransaction(smartTransaction) {
        var _a, _b, _c;
        const txHash = (_a = smartTransaction.statusMetadata) === null || _a === void 0 ? void 0 : _a.minedHash;
        try {
            const transactionReceipt = await this.ethersProvider.getTransactionReceipt(txHash);
            const transaction = await this.ethersProvider.getTransaction(txHash);
            const maxFeePerGas = (_b = transaction.maxFeePerGas) === null || _b === void 0 ? void 0 : _b.toHexString();
            const maxPriorityFeePerGas = (_c = transaction.maxPriorityFeePerGas) === null || _c === void 0 ? void 0 : _c.toHexString();
            if (transactionReceipt === null || transactionReceipt === void 0 ? void 0 : transactionReceipt.blockNumber) {
                const blockData = await this.ethersProvider.getBlock(transactionReceipt === null || transactionReceipt === void 0 ? void 0 : transactionReceipt.blockNumber, false);
                const baseFeePerGas = blockData === null || blockData === void 0 ? void 0 : blockData.baseFeePerGas.toHexString();
                const txReceipt = (0, mapValues_1.default)(transactionReceipt, (value) => {
                    if (value instanceof bignumber_1.BigNumber) {
                        return value.toHexString();
                    }
                    return value;
                });
                const updatedTxParams = Object.assign(Object.assign({}, smartTransaction.txParams), { maxFeePerGas,
                    maxPriorityFeePerGas });
                // call confirmExternalTransaction
                const originalTxMeta = Object.assign(Object.assign({}, smartTransaction), { id: smartTransaction.uuid, status: 'confirmed', hash: txHash, txParams: updatedTxParams });
                // create txMeta snapshot for history
                const snapshot = (0, utils_1.snapshotFromTxMeta)(originalTxMeta);
                // recover previous tx state obj
                const previousState = (0, utils_1.replayHistory)(originalTxMeta.history);
                // generate history entry and add to history
                const entry = (0, utils_1.generateHistoryEntry)(previousState, snapshot, 'txStateManager: setting status to confirmed');
                const txMeta = entry.length > 0
                    ? Object.assign(Object.assign({}, originalTxMeta), { history: originalTxMeta.history.concat(entry) }) : originalTxMeta;
                this.confirmExternalTransaction(txMeta, txReceipt, baseFeePerGas);
                this.trackMetaMetricsEvent({
                    event: 'STX Confirmed',
                    category: 'swaps',
                });
                this.updateSmartTransaction(Object.assign(Object.assign({}, smartTransaction), { confirmed: true }));
            }
        }
        catch (e) {
            this.trackMetaMetricsEvent({
                event: 'STX Confirmation Failed',
                category: 'swaps',
            });
            console.error('confirm error', e);
        }
    }
    // ! Ask backend API to accept list of uuids as params
    async fetchSmartTransactionsStatus(uuids) {
        const { chainId } = this.config;
        const params = new URLSearchParams({
            uuids: uuids.join(','),
        });
        const url = `${(0, utils_1.getAPIRequestURL)(types_1.APIType.BATCH_STATUS, chainId)}?${params.toString()}`;
        const data = await this.fetch(url);
        Object.entries(data).forEach(([uuid, stxStatus]) => {
            this.updateSmartTransaction({
                statusMetadata: stxStatus,
                status: (0, utils_1.calculateStatus)(stxStatus),
                cancellable: (0, utils_1.isSmartTransactionCancellable)(stxStatus),
                uuid,
            });
        });
        return data;
    }
    async addNonceToTransaction(transaction) {
        const nonceLock = await this.getNonceLock(transaction.from);
        const nonce = nonceLock.nextNonce;
        nonceLock.releaseLock();
        return Object.assign(Object.assign({}, transaction), { nonce: `0x${nonce.toString(16)}` });
    }
    clearFees() {
        const fees = {
            approvalTxFees: undefined,
            tradeTxFees: undefined,
        };
        this.update({
            smartTransactionsState: Object.assign(Object.assign({}, this.state.smartTransactionsState), { fees }),
        });
        return fees;
    }
    async getFees(tradeTx, approvalTx) {
        const { chainId } = this.config;
        const transactions = [];
        let unsignedTradeTransactionWithNonce;
        if (approvalTx) {
            const unsignedApprovalTransactionWithNonce = await this.addNonceToTransaction(approvalTx);
            transactions.push(unsignedApprovalTransactionWithNonce);
            unsignedTradeTransactionWithNonce = Object.assign(Object.assign({}, tradeTx), { 
                // If there is an approval tx, the trade tx's nonce is increased by 1.
                nonce: (0, utils_1.incrementNonceInHex)(unsignedApprovalTransactionWithNonce.nonce) });
        }
        else {
            unsignedTradeTransactionWithNonce = await this.addNonceToTransaction(tradeTx);
        }
        transactions.push(unsignedTradeTransactionWithNonce);
        const data = await this.fetch((0, utils_1.getAPIRequestURL)(types_1.APIType.GET_FEES, chainId), {
            method: 'POST',
            body: JSON.stringify({
                txs: transactions,
            }),
        });
        let approvalTxFees;
        let tradeTxFees;
        if (approvalTx) {
            approvalTxFees = data === null || data === void 0 ? void 0 : data.txs[0];
            tradeTxFees = data === null || data === void 0 ? void 0 : data.txs[1];
        }
        else {
            tradeTxFees = data === null || data === void 0 ? void 0 : data.txs[0];
        }
        this.update({
            smartTransactionsState: Object.assign(Object.assign({}, this.state.smartTransactionsState), { fees: {
                    approvalTxFees,
                    tradeTxFees,
                } }),
        });
        return {
            approvalTxFees,
            tradeTxFees,
        };
    }
    // * After this successful call client must add a nonce representative to
    // * transaction controller external transactions list
    async submitSignedTransactions({ txParams, signedTransactions, signedCanceledTransactions, }) {
        const { chainId } = this.config;
        const data = await this.fetch((0, utils_1.getAPIRequestURL)(types_1.APIType.SUBMIT_TRANSACTIONS, chainId), {
            method: 'POST',
            body: JSON.stringify({
                rawTxs: signedTransactions,
                rawCancelTxs: signedCanceledTransactions,
            }),
        });
        const time = Date.now();
        let preTxBalance;
        try {
            const preTxBalanceBN = await this.ethersProvider.getBalance(txParams === null || txParams === void 0 ? void 0 : txParams.from);
            preTxBalance = new bignumber_js_1.BigNumber(preTxBalanceBN.toHexString()).toString(16);
        }
        catch (e) {
            console.error('ethers error', e);
        }
        const nonceLock = await this.getNonceLock(txParams === null || txParams === void 0 ? void 0 : txParams.from);
        try {
            const nonce = (0, bytes_1.hexlify)(nonceLock.nextNonce);
            if (txParams && !(txParams === null || txParams === void 0 ? void 0 : txParams.nonce)) {
                txParams.nonce = nonce;
            }
            const { nonceDetails } = nonceLock;
            this.updateSmartTransaction({
                chainId,
                nonceDetails,
                preTxBalance,
                status: types_1.SmartTransactionStatuses.PENDING,
                time,
                txParams,
                uuid: data.uuid,
                cancellable: true,
            });
        }
        finally {
            nonceLock.releaseLock();
        }
        return data;
    }
    // TODO: This should return if the cancellation was on chain or not (for nonce management)
    // After this successful call client must update nonce representative
    // in transaction controller external transactions list
    async cancelSmartTransaction(uuid) {
        const { chainId } = this.config;
        await this.fetch((0, utils_1.getAPIRequestURL)(types_1.APIType.CANCEL, chainId), {
            method: 'POST',
            body: JSON.stringify({ uuid }),
        });
    }
    async fetchLiveness() {
        const { chainId } = this.config;
        let liveness = false;
        try {
            const response = await this.fetch((0, utils_1.getAPIRequestURL)(types_1.APIType.LIVENESS, chainId));
            liveness = Boolean(response.lastBlock);
        }
        catch (e) {
            console.log('"fetchLiveness" API call failed');
        }
        this.update({
            smartTransactionsState: Object.assign(Object.assign({}, this.state.smartTransactionsState), { liveness }),
        });
        return liveness;
    }
    async setStatusRefreshInterval(interval) {
        if (interval !== this.config.interval) {
            this.configure({ interval }, false, false);
        }
    }
    getTransactions({ addressFrom, status, }) {
        const { smartTransactions } = this.state.smartTransactionsState;
        const { chainId } = this.config;
        const currentSmartTransactions = smartTransactions === null || smartTransactions === void 0 ? void 0 : smartTransactions[chainId];
        if (!currentSmartTransactions || currentSmartTransactions.length === 0) {
            return [];
        }
        return currentSmartTransactions.filter((stx) => {
            var _a;
            return stx.status === status && ((_a = stx.txParams) === null || _a === void 0 ? void 0 : _a.from) === addressFrom;
        });
    }
}
exports.default = SmartTransactionsController;
//# sourceMappingURL=SmartTransactionsController.js.map