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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _EnsController_instances, _EnsController_ethProvider, _EnsController_getChainEnsSupport;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnsController = void 0;
const providers_1 = require("@ethersproject/providers");
const base_controller_1 = require("@metamask/base-controller");
const controller_utils_1 = require("@metamask/controller-utils");
const utils_1 = require("@metamask/utils");
const ethereum_ens_network_map_1 = __importDefault(require("ethereum-ens-network-map"));
const punycode_1 = require("punycode/");
const log = (0, utils_1.createProjectLogger)('ens-controller');
const name = 'EnsController';
const metadata = {
    ensEntries: { persist: true, anonymous: false },
    ensResolutionsByAddress: { persist: true, anonymous: false },
};
const defaultState = {
    ensEntries: {},
    ensResolutionsByAddress: {},
};
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const ZERO_X_ERROR_ADDRESS = '0x';
/**
 * Controller that manages a list ENS names and their resolved addresses
 * by chainId. A null address indicates an unresolved ENS name.
 */
class EnsController extends base_controller_1.BaseController {
    /**
     * Creates an EnsController instance.
     *
     * @param options - Constructor options.
     * @param options.messenger - A reference to the messaging system.
     * @param options.state - Initial state to set on this controller.
     * @param options.provider - Provider instance.
     * @param options.onNetworkDidChange - Allows subscribing to network controller networkDidChange events.
     */
    constructor({ messenger, state = {}, provider, onNetworkDidChange, }) {
        super({
            name,
            metadata,
            messenger,
            state: Object.assign(Object.assign({}, defaultState), state),
        });
        _EnsController_instances.add(this);
        _EnsController_ethProvider.set(this, null);
        if (provider && onNetworkDidChange) {
            onNetworkDidChange((networkState) => {
                this.resetState();
                const currentChainId = networkState.providerConfig.chainId;
                if (__classPrivateFieldGet(this, _EnsController_instances, "m", _EnsController_getChainEnsSupport).call(this, currentChainId)) {
                    __classPrivateFieldSet(this, _EnsController_ethProvider, new providers_1.Web3Provider(provider, {
                        chainId: (0, controller_utils_1.convertHexToDecimal)(currentChainId),
                        name: controller_utils_1.CHAIN_ID_TO_ETHERS_NETWORK_NAME_MAP[currentChainId],
                        ensAddress: ethereum_ens_network_map_1.default[parseInt(currentChainId, 16)],
                    }), "f");
                }
                else {
                    __classPrivateFieldSet(this, _EnsController_ethProvider, null, "f");
                }
            });
        }
    }
    /**
     * Clears ensResolutionsByAddress state property.
     */
    resetState() {
        this.update((currentState) => {
            currentState.ensResolutionsByAddress = {};
        });
    }
    /**
     * Remove all chain Ids and ENS entries from state.
     */
    clear() {
        this.update((state) => {
            state.ensEntries = {};
        });
    }
    /**
     * Delete an ENS entry.
     *
     * @param chainId - Parent chain of the ENS entry to delete.
     * @param ensName - Name of the ENS entry to delete.
     * @returns Boolean indicating if the entry was deleted.
     */
    delete(chainId, ensName) {
        const normalizedEnsName = (0, controller_utils_1.normalizeEnsName)(ensName);
        if (!normalizedEnsName ||
            !this.state.ensEntries[chainId] ||
            !this.state.ensEntries[chainId][normalizedEnsName]) {
            return false;
        }
        this.update((state) => {
            delete state.ensEntries[chainId][normalizedEnsName];
            if (Object.keys(state.ensEntries[chainId]).length === 0) {
                delete state.ensEntries[chainId];
            }
        });
        return true;
    }
    /**
     * Retrieve a DNS entry.
     *
     * @param chainId - Parent chain of the ENS entry to retrieve.
     * @param ensName - Name of the ENS entry to retrieve.
     * @returns The EnsEntry or null if it does not exist.
     */
    get(chainId, ensName) {
        const normalizedEnsName = (0, controller_utils_1.normalizeEnsName)(ensName);
        // TODO Explicitly handle the case where `normalizedEnsName` is `null`
        // eslint-disable-next-line no-implicit-coercion
        return !!normalizedEnsName && this.state.ensEntries[chainId]
            ? this.state.ensEntries[chainId][normalizedEnsName] || null
            : null;
    }
    /**
     * Add or update an ENS entry by chainId and ensName.
     *
     * A null address indicates that the ENS name does not resolve.
     *
     * @param chainId - Id of the associated chain.
     * @param ensName - The ENS name.
     * @param address - Associated address (or null) to add or update.
     * @returns Boolean indicating if the entry was set.
     */
    set(chainId, ensName, address) {
        if (!Number.isInteger(Number.parseInt(chainId, 10)) ||
            !ensName ||
            typeof ensName !== 'string' ||
            (address && !(0, controller_utils_1.isValidHexAddress)(address))) {
            throw new Error(`Invalid ENS entry: { chainId:${chainId}, ensName:${ensName}, address:${address}}`);
        }
        const normalizedEnsName = (0, controller_utils_1.normalizeEnsName)(ensName);
        if (!normalizedEnsName) {
            throw new Error(`Invalid ENS name: ${ensName}`);
        }
        const normalizedAddress = address ? (0, controller_utils_1.toChecksumHexAddress)(address) : null;
        const subState = this.state.ensEntries[chainId];
        if ((subState === null || subState === void 0 ? void 0 : subState[normalizedEnsName]) &&
            subState[normalizedEnsName].address === normalizedAddress) {
            return false;
        }
        this.update((state) => {
            state.ensEntries = Object.assign(Object.assign({}, this.state.ensEntries), { [chainId]: Object.assign(Object.assign({}, this.state.ensEntries[chainId]), { [normalizedEnsName]: {
                        address: normalizedAddress,
                        chainId,
                        ensName: normalizedEnsName,
                    } }) });
        });
        return true;
    }
    /**
     * Resolve ens by address.
     *
     * @param nonChecksummedAddress - address
     * @returns ens resolution
     */
    reverseResolveAddress(nonChecksummedAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!__classPrivateFieldGet(this, _EnsController_ethProvider, "f")) {
                return undefined;
            }
            const address = (0, controller_utils_1.toChecksumHexAddress)(nonChecksummedAddress);
            if (this.state.ensResolutionsByAddress[address]) {
                return this.state.ensResolutionsByAddress[address];
            }
            let domain;
            try {
                domain = yield __classPrivateFieldGet(this, _EnsController_ethProvider, "f").lookupAddress(address);
            }
            catch (error) {
                log(error);
                return undefined;
            }
            if (!domain) {
                return undefined;
            }
            let registeredAddress;
            try {
                registeredAddress = yield __classPrivateFieldGet(this, _EnsController_ethProvider, "f").resolveName(domain);
            }
            catch (error) {
                log(error);
                return undefined;
            }
            if (!registeredAddress) {
                return undefined;
            }
            if (registeredAddress === ZERO_ADDRESS ||
                registeredAddress === ZERO_X_ERROR_ADDRESS) {
                return undefined;
            }
            if ((0, controller_utils_1.toChecksumHexAddress)(registeredAddress) !== address) {
                return undefined;
            }
            this.update((state) => {
                state.ensResolutionsByAddress[address] = (0, punycode_1.toASCII)(domain);
            });
            return domain;
        });
    }
}
exports.EnsController = EnsController;
_EnsController_ethProvider = new WeakMap(), _EnsController_instances = new WeakSet(), _EnsController_getChainEnsSupport = function _EnsController_getChainEnsSupport(chainId) {
    return Boolean(ethereum_ens_network_map_1.default[parseInt(chainId, 16)]);
};
exports.default = EnsController;
//# sourceMappingURL=EnsController.js.map