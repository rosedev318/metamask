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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TokenBalancesController_handle, _TokenBalancesController_getERC20BalanceOf, _TokenBalancesController_interval, _TokenBalancesController_tokens, _TokenBalancesController_disabled;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBalancesController = exports.getDefaultTokenBalancesState = void 0;
const base_controller_1 = require("@metamask/base-controller");
const controller_utils_1 = require("@metamask/controller-utils");
const DEFAULT_INTERVAL = 180000;
const controllerName = 'TokenBalancesController';
const metadata = {
    contractBalances: { persist: true, anonymous: false },
};
/**
 * Get the default TokenBalancesController state.
 *
 * @returns The default TokenBalancesController state.
 */
function getDefaultTokenBalancesState() {
    return {
        contractBalances: {},
    };
}
exports.getDefaultTokenBalancesState = getDefaultTokenBalancesState;
/**
 * Controller that passively polls on a set interval token balances
 * for tokens stored in the TokensController
 */
class TokenBalancesController extends base_controller_1.BaseController {
    /**
     * Construct a Token Balances Controller.
     *
     * @param options - The controller options.
     * @param options.interval - Polling interval used to fetch new token balances.
     * @param options.tokens - List of tokens to track balances for.
     * @param options.disabled - If set to true, all tracked tokens contract balances updates are blocked.
     * @param options.getERC20BalanceOf - Gets the balance of the given account at the given contract address.
     * @param options.state - Initial state to set on this controller.
     * @param options.messenger - The controller restricted messenger.
     */
    constructor({ interval = DEFAULT_INTERVAL, tokens = [], disabled = false, getERC20BalanceOf, messenger, state = {}, }) {
        super({
            name: controllerName,
            metadata,
            messenger,
            state: Object.assign(Object.assign({}, getDefaultTokenBalancesState()), state),
        });
        _TokenBalancesController_handle.set(this, void 0);
        _TokenBalancesController_getERC20BalanceOf.set(this, void 0);
        _TokenBalancesController_interval.set(this, void 0);
        _TokenBalancesController_tokens.set(this, void 0);
        _TokenBalancesController_disabled.set(this, void 0);
        __classPrivateFieldSet(this, _TokenBalancesController_disabled, disabled, "f");
        __classPrivateFieldSet(this, _TokenBalancesController_interval, interval, "f");
        __classPrivateFieldSet(this, _TokenBalancesController_tokens, tokens, "f");
        this.messagingSystem.subscribe('TokensController:stateChange', ({ tokens: newTokens, detectedTokens }) => {
            __classPrivateFieldSet(this, _TokenBalancesController_tokens, [...newTokens, ...detectedTokens], "f");
            this.updateBalances();
        });
        __classPrivateFieldSet(this, _TokenBalancesController_getERC20BalanceOf, getERC20BalanceOf, "f");
        this.poll();
    }
    /**
     * Allows controller to update tracked tokens contract balances.
     */
    enable() {
        __classPrivateFieldSet(this, _TokenBalancesController_disabled, false, "f");
    }
    /**
     * Blocks controller from updating tracked tokens contract balances.
     */
    disable() {
        __classPrivateFieldSet(this, _TokenBalancesController_disabled, true, "f");
    }
    /**
     * Starts a new polling interval.
     *
     * @param interval - Polling interval used to fetch new token balances.
     */
    poll(interval) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interval) {
                __classPrivateFieldSet(this, _TokenBalancesController_interval, interval, "f");
            }
            if (__classPrivateFieldGet(this, _TokenBalancesController_handle, "f")) {
                clearTimeout(__classPrivateFieldGet(this, _TokenBalancesController_handle, "f"));
            }
            yield (0, controller_utils_1.safelyExecute)(() => this.updateBalances());
            __classPrivateFieldSet(this, _TokenBalancesController_handle, setTimeout(() => {
                this.poll(__classPrivateFieldGet(this, _TokenBalancesController_interval, "f"));
            }, __classPrivateFieldGet(this, _TokenBalancesController_interval, "f")), "f");
        });
    }
    /**
     * Updates balances for all tokens.
     */
    updateBalances() {
        return __awaiter(this, void 0, void 0, function* () {
            if (__classPrivateFieldGet(this, _TokenBalancesController_disabled, "f")) {
                return;
            }
            const newContractBalances = {};
            for (const token of __classPrivateFieldGet(this, _TokenBalancesController_tokens, "f")) {
                const { address } = token;
                const { selectedAddress } = this.messagingSystem.call('PreferencesController:getState');
                try {
                    newContractBalances[address] = (0, controller_utils_1.toHex)(yield __classPrivateFieldGet(this, _TokenBalancesController_getERC20BalanceOf, "f").call(this, address, selectedAddress));
                    token.balanceError = null;
                }
                catch (error) {
                    newContractBalances[address] = (0, controller_utils_1.toHex)(0);
                    token.balanceError = error;
                }
            }
            this.update((state) => {
                state.contractBalances = newContractBalances;
            });
        });
    }
}
exports.TokenBalancesController = TokenBalancesController;
_TokenBalancesController_handle = new WeakMap(), _TokenBalancesController_getERC20BalanceOf = new WeakMap(), _TokenBalancesController_interval = new WeakMap(), _TokenBalancesController_tokens = new WeakMap(), _TokenBalancesController_disabled = new WeakMap();
exports.default = TokenBalancesController;
//# sourceMappingURL=TokenBalancesController.js.map