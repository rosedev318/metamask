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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _PhishingController_instances, _PhishingController_detector, _PhishingController_stalelistRefreshInterval, _PhishingController_hotlistRefreshInterval, _PhishingController_inProgressHotlistUpdate, _PhishingController_inProgressStalelistUpdate, _PhishingController_registerMessageHandlers, _PhishingController_updateStalelist, _PhishingController_updateHotlist, _PhishingController_queryConfig;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhishingController = exports.phishingListKeyNameMap = exports.ListNames = exports.ListKeys = exports.METAMASK_HOTLIST_DIFF_URL = exports.METAMASK_STALELIST_URL = exports.STALELIST_REFRESH_INTERVAL = exports.HOTLIST_REFRESH_INTERVAL = exports.METAMASK_HOTLIST_DIFF_FILE = exports.METAMASK_STALELIST_FILE = exports.PHISHING_CONFIG_BASE_URL = void 0;
const base_controller_1 = require("@metamask/base-controller");
const controller_utils_1 = require("@metamask/controller-utils");
const detector_1 = __importDefault(require("eth-phishing-detect/src/detector"));
const punycode_1 = require("punycode/");
const utils_1 = require("./utils");
exports.PHISHING_CONFIG_BASE_URL = 'https://phishing-detection.metafi.codefi.network';
exports.METAMASK_STALELIST_FILE = '/v1/stalelist';
exports.METAMASK_HOTLIST_DIFF_FILE = '/v1/diffsSince';
exports.HOTLIST_REFRESH_INTERVAL = 30 * 60; // 30 mins in seconds
exports.STALELIST_REFRESH_INTERVAL = 4 * 24 * 60 * 60; // 4 days in seconds
exports.METAMASK_STALELIST_URL = `${exports.PHISHING_CONFIG_BASE_URL}${exports.METAMASK_STALELIST_FILE}`;
exports.METAMASK_HOTLIST_DIFF_URL = `${exports.PHISHING_CONFIG_BASE_URL}${exports.METAMASK_HOTLIST_DIFF_FILE}`;
/**
 * Enum containing upstream data provider source list keys.
 * These are the keys denoting lists consumed by the upstream data provider.
 */
var ListKeys;
(function (ListKeys) {
    ListKeys["PhishfortHotlist"] = "phishfort_hotlist";
    ListKeys["EthPhishingDetectConfig"] = "eth_phishing_detect_config";
})(ListKeys = exports.ListKeys || (exports.ListKeys = {}));
/**
 * Enum containing downstream client attribution names.
 */
var ListNames;
(function (ListNames) {
    ListNames["MetaMask"] = "MetaMask";
    ListNames["Phishfort"] = "Phishfort";
})(ListNames = exports.ListNames || (exports.ListNames = {}));
/**
 * Maps from downstream client attribution name
 * to list key sourced from upstream data provider.
 */
const phishingListNameKeyMap = {
    [ListNames.Phishfort]: ListKeys.PhishfortHotlist,
    [ListNames.MetaMask]: ListKeys.EthPhishingDetectConfig,
};
/**
 * Maps from list key sourced from upstream data
 * provider to downstream client attribution name.
 */
exports.phishingListKeyNameMap = {
    [ListKeys.EthPhishingDetectConfig]: ListNames.MetaMask,
    [ListKeys.PhishfortHotlist]: ListNames.Phishfort,
};
const controllerName = 'PhishingController';
const metadata = {
    phishingLists: { persist: true, anonymous: false },
    whitelist: { persist: true, anonymous: false },
    hotlistLastFetched: { persist: true, anonymous: false },
    stalelistLastFetched: { persist: true, anonymous: false },
};
/**
 * Get a default empty state for the controller.
 * @returns The default empty state.
 */
const getDefaultState = () => {
    return {
        phishingLists: [],
        whitelist: [],
        hotlistLastFetched: 0,
        stalelistLastFetched: 0,
    };
};
/**
 * Controller that manages community-maintained lists of approved and unapproved website origins.
 */
class PhishingController extends base_controller_1.BaseController {
    /**
     * Construct a Phishing Controller.
     *
     * @param config - Initial options used to configure this controller.
     * @param config.stalelistRefreshInterval - Polling interval used to fetch stale list.
     * @param config.hotlistRefreshInterval - Polling interval used to fetch hotlist diff list.
     * @param config.messenger - The controller restricted messenger.
     * @param config.state - Initial state to set on this controller.
     */
    constructor({ stalelistRefreshInterval = exports.STALELIST_REFRESH_INTERVAL, hotlistRefreshInterval = exports.HOTLIST_REFRESH_INTERVAL, messenger, state = {}, }) {
        super({
            name: controllerName,
            metadata,
            messenger,
            state: Object.assign(Object.assign({}, getDefaultState()), state),
        });
        _PhishingController_instances.add(this);
        // TODO: Replace `any` with type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _PhishingController_detector.set(this, void 0);
        _PhishingController_stalelistRefreshInterval.set(this, void 0);
        _PhishingController_hotlistRefreshInterval.set(this, void 0);
        _PhishingController_inProgressHotlistUpdate.set(this, void 0);
        _PhishingController_inProgressStalelistUpdate.set(this, void 0);
        __classPrivateFieldSet(this, _PhishingController_stalelistRefreshInterval, stalelistRefreshInterval, "f");
        __classPrivateFieldSet(this, _PhishingController_hotlistRefreshInterval, hotlistRefreshInterval, "f");
        __classPrivateFieldGet(this, _PhishingController_instances, "m", _PhishingController_registerMessageHandlers).call(this);
        this.updatePhishingDetector();
    }
    /**
     * Updates this.detector with an instance of PhishingDetector using the current state.
     */
    updatePhishingDetector() {
        __classPrivateFieldSet(this, _PhishingController_detector, new detector_1.default(this.state.phishingLists), "f");
    }
    /**
     * Set the interval at which the stale phishing list will be refetched.
     * Fetching will only occur on the next call to test/bypass.
     * For immediate update to the phishing list, call {@link updateStalelist} directly.
     *
     * @param interval - the new interval, in ms.
     */
    setStalelistRefreshInterval(interval) {
        __classPrivateFieldSet(this, _PhishingController_stalelistRefreshInterval, interval, "f");
    }
    /**
     * Set the interval at which the hot list will be refetched.
     * Fetching will only occur on the next call to test/bypass.
     * For immediate update to the phishing list, call {@link updateHotlist} directly.
     *
     * @param interval - the new interval, in ms.
     */
    setHotlistRefreshInterval(interval) {
        __classPrivateFieldSet(this, _PhishingController_hotlistRefreshInterval, interval, "f");
    }
    /**
     * Determine if an update to the stalelist configuration is needed.
     *
     * @returns Whether an update is needed
     */
    isStalelistOutOfDate() {
        return ((0, utils_1.fetchTimeNow)() - this.state.stalelistLastFetched >=
            __classPrivateFieldGet(this, _PhishingController_stalelistRefreshInterval, "f"));
    }
    /**
     * Determine if an update to the hotlist configuration is needed.
     *
     * @returns Whether an update is needed
     */
    isHotlistOutOfDate() {
        return ((0, utils_1.fetchTimeNow)() - this.state.hotlistLastFetched >=
            __classPrivateFieldGet(this, _PhishingController_hotlistRefreshInterval, "f"));
    }
    /**
     * Conditionally update the phishing configuration.
     *
     * If the stalelist configuration is out of date, this function will call `updateStalelist`
     * to update the configuration. This will automatically grab the hotlist,
     * so it isn't necessary to continue on to download the hotlist.
     *
     */
    maybeUpdateState() {
        return __awaiter(this, void 0, void 0, function* () {
            const staleListOutOfDate = this.isStalelistOutOfDate();
            if (staleListOutOfDate) {
                yield this.updateStalelist();
                return;
            }
            const hotlistOutOfDate = this.isHotlistOutOfDate();
            if (hotlistOutOfDate) {
                yield this.updateHotlist();
            }
        });
    }
    /**
     * Determines if a given origin is unapproved.
     *
     * It is strongly recommended that you call {@link maybeUpdateState} before calling this,
     * to check whether the phishing configuration is up-to-date. It will be updated if necessary
     * by calling {@link updateStalelist} or {@link updateHotlist}.
     *
     * @param origin - Domain origin of a website.
     * @returns Whether the origin is an unapproved origin.
     */
    test(origin) {
        const punycodeOrigin = (0, punycode_1.toASCII)(origin);
        if (this.state.whitelist.includes(punycodeOrigin)) {
            return { result: false, type: 'all' }; // Same as whitelisted match returned by detector.check(...).
        }
        return __classPrivateFieldGet(this, _PhishingController_detector, "f").check(punycodeOrigin);
    }
    /**
     * Temporarily marks a given origin as approved.
     *
     * @param origin - The origin to mark as approved.
     */
    bypass(origin) {
        const punycodeOrigin = (0, punycode_1.toASCII)(origin);
        const { whitelist } = this.state;
        if (whitelist.includes(punycodeOrigin)) {
            return;
        }
        this.update((draftState) => {
            draftState.whitelist.push(punycodeOrigin);
        });
    }
    /**
     * Update the hotlist.
     *
     * If an update is in progress, no additional update will be made. Instead this will wait until
     * the in-progress update has finished.
     */
    updateHotlist() {
        return __awaiter(this, void 0, void 0, function* () {
            if (__classPrivateFieldGet(this, _PhishingController_inProgressHotlistUpdate, "f")) {
                yield __classPrivateFieldGet(this, _PhishingController_inProgressHotlistUpdate, "f");
                return;
            }
            try {
                __classPrivateFieldSet(this, _PhishingController_inProgressHotlistUpdate, __classPrivateFieldGet(this, _PhishingController_instances, "m", _PhishingController_updateHotlist).call(this), "f");
                yield __classPrivateFieldGet(this, _PhishingController_inProgressHotlistUpdate, "f");
            }
            finally {
                __classPrivateFieldSet(this, _PhishingController_inProgressHotlistUpdate, undefined, "f");
            }
        });
    }
    /**
     * Update the stalelist.
     *
     * If an update is in progress, no additional update will be made. Instead this will wait until
     * the in-progress update has finished.
     */
    updateStalelist() {
        return __awaiter(this, void 0, void 0, function* () {
            if (__classPrivateFieldGet(this, _PhishingController_inProgressStalelistUpdate, "f")) {
                yield __classPrivateFieldGet(this, _PhishingController_inProgressStalelistUpdate, "f");
                return;
            }
            try {
                __classPrivateFieldSet(this, _PhishingController_inProgressStalelistUpdate, __classPrivateFieldGet(this, _PhishingController_instances, "m", _PhishingController_updateStalelist).call(this), "f");
                yield __classPrivateFieldGet(this, _PhishingController_inProgressStalelistUpdate, "f");
            }
            finally {
                __classPrivateFieldSet(this, _PhishingController_inProgressStalelistUpdate, undefined, "f");
            }
        });
    }
}
exports.PhishingController = PhishingController;
_PhishingController_detector = new WeakMap(), _PhishingController_stalelistRefreshInterval = new WeakMap(), _PhishingController_hotlistRefreshInterval = new WeakMap(), _PhishingController_inProgressHotlistUpdate = new WeakMap(), _PhishingController_inProgressStalelistUpdate = new WeakMap(), _PhishingController_instances = new WeakSet(), _PhishingController_registerMessageHandlers = function _PhishingController_registerMessageHandlers() {
    this.messagingSystem.registerActionHandler(`${controllerName}:maybeUpdateState`, this.maybeUpdateState.bind(this));
    this.messagingSystem.registerActionHandler(`${controllerName}:testOrigin`, this.test.bind(this));
}, _PhishingController_updateStalelist = function _PhishingController_updateStalelist() {
    return __awaiter(this, void 0, void 0, function* () {
        let stalelistResponse;
        let hotlistDiffsResponse;
        try {
            stalelistResponse = yield __classPrivateFieldGet(this, _PhishingController_instances, "m", _PhishingController_queryConfig).call(this, exports.METAMASK_STALELIST_URL).then((d) => d);
            // Fetching hotlist diffs relies on having a lastUpdated timestamp to do `GET /v1/diffsSince/:timestamp`,
            // so it doesn't make sense to call if there is not a timestamp to begin with.
            if ((stalelistResponse === null || stalelistResponse === void 0 ? void 0 : stalelistResponse.data) && stalelistResponse.data.lastUpdated > 0) {
                hotlistDiffsResponse = yield __classPrivateFieldGet(this, _PhishingController_instances, "m", _PhishingController_queryConfig).call(this, `${exports.METAMASK_HOTLIST_DIFF_URL}/${stalelistResponse.data.lastUpdated}`);
            }
        }
        finally {
            // Set `stalelistLastFetched` and `hotlistLastFetched` even for failed requests to prevent server
            // from being overwhelmed with traffic after a network disruption.
            const timeNow = (0, utils_1.fetchTimeNow)();
            this.update((draftState) => {
                draftState.stalelistLastFetched = timeNow;
                draftState.hotlistLastFetched = timeNow;
            });
        }
        if (!stalelistResponse || !hotlistDiffsResponse) {
            return;
        }
        const _a = stalelistResponse.data, { phishfort_hotlist, eth_phishing_detect_config } = _a, partialState = __rest(_a, ["phishfort_hotlist", "eth_phishing_detect_config"]);
        const phishfortListState = Object.assign(Object.assign(Object.assign({}, phishfort_hotlist), partialState), { fuzzylist: [], allowlist: [], name: exports.phishingListKeyNameMap.phishfort_hotlist });
        const metamaskListState = Object.assign(Object.assign(Object.assign({}, eth_phishing_detect_config), partialState), { name: exports.phishingListKeyNameMap.eth_phishing_detect_config });
        // Correctly shaping eth-phishing-detect state by applying hotlist diffs to the stalelist.
        const newPhishfortListState = (0, utils_1.applyDiffs)(phishfortListState, hotlistDiffsResponse.data, ListKeys.PhishfortHotlist);
        const newMetaMaskListState = (0, utils_1.applyDiffs)(metamaskListState, hotlistDiffsResponse.data, ListKeys.EthPhishingDetectConfig);
        this.update((draftState) => {
            draftState.phishingLists = [newMetaMaskListState, newPhishfortListState];
        });
        this.updatePhishingDetector();
    });
}, _PhishingController_updateHotlist = function _PhishingController_updateHotlist() {
    return __awaiter(this, void 0, void 0, function* () {
        const lastDiffTimestamp = Math.max(...this.state.phishingLists.map(({ lastUpdated }) => lastUpdated));
        let hotlistResponse;
        try {
            hotlistResponse = yield __classPrivateFieldGet(this, _PhishingController_instances, "m", _PhishingController_queryConfig).call(this, `${exports.METAMASK_HOTLIST_DIFF_URL}/${lastDiffTimestamp}`);
        }
        finally {
            // Set `hotlistLastFetched` even for failed requests to prevent server from being overwhelmed with
            // traffic after a network disruption.
            this.update((draftState) => {
                draftState.hotlistLastFetched = (0, utils_1.fetchTimeNow)();
            });
        }
        if (!(hotlistResponse === null || hotlistResponse === void 0 ? void 0 : hotlistResponse.data)) {
            return;
        }
        const hotlist = hotlistResponse.data;
        const newPhishingLists = this.state.phishingLists.map((phishingList) => (0, utils_1.applyDiffs)(phishingList, hotlist, phishingListNameKeyMap[phishingList.name]));
        this.update((draftState) => {
            draftState.phishingLists = newPhishingLists;
        });
        this.updatePhishingDetector();
    });
}, _PhishingController_queryConfig = function _PhishingController_queryConfig(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, controller_utils_1.safelyExecute)(() => fetch(input, { cache: 'no-cache' }), true);
        switch (response === null || response === void 0 ? void 0 : response.status) {
            case 200: {
                return yield response.json();
            }
            default: {
                return null;
            }
        }
    });
};
exports.default = PhishingController;
//# sourceMappingURL=PhishingController.js.map