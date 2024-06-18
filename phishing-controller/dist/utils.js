"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDiffs = exports.fetchTimeNow = void 0;
const PhishingController_1 = require("./PhishingController");
/**
 * Fetches current epoch time in seconds.
 *
 * @returns the Date.now() time in seconds instead of miliseconds. backend files rely on timestamps in seconds since epoch.
 */
const fetchTimeNow = () => Math.round(Date.now() / 1000);
exports.fetchTimeNow = fetchTimeNow;
/**
 * Split a string into two pieces, using the first period as the delimiter.
 *
 * @param stringToSplit - The string to split.
 * @returns An array of length two containing the beginning and end of the string.
 */
const splitStringByPeriod = (stringToSplit) => {
    const periodIndex = stringToSplit.indexOf('.');
    return [
        stringToSplit.slice(0, periodIndex),
        stringToSplit.slice(periodIndex + 1),
    ];
};
/**
 * Determines which diffs are applicable to the listState, then applies those diffs.
 *
 * @param listState - the stalelist or the existing liststate that diffs will be applied to.
 * @param hotlistDiffs - the diffs to apply to the listState if valid.
 * @param listKey - the key associated with the input/output phishing list state.
 * @returns the new list state
 */
const applyDiffs = (listState, hotlistDiffs, listKey) => {
    // filter to remove diffs that were added before the lastUpdate time.
    // filter to remove diffs that aren't applicable to the specified list (by listKey).
    const diffsToApply = hotlistDiffs.filter(({ timestamp, targetList }) => timestamp > listState.lastUpdated &&
        splitStringByPeriod(targetList)[0] === listKey);
    // the reason behind using latestDiffTimestamp as the lastUpdated time
    // is so that we can benefit server-side from memoization due to end client's
    // `GET /v1/diffSince/:timestamp` requests lining up with
    // our periodic updates (which create diffs at specific timestamps).
    let latestDiffTimestamp = listState.lastUpdated;
    const listSets = {
        allowlist: new Set(listState.allowlist),
        blocklist: new Set(listState.blocklist),
        fuzzylist: new Set(listState.fuzzylist),
    };
    for (const { isRemoval, targetList, url, timestamp } of diffsToApply) {
        const targetListType = splitStringByPeriod(targetList)[1];
        if (timestamp > latestDiffTimestamp) {
            latestDiffTimestamp = timestamp;
        }
        if (isRemoval) {
            listSets[targetListType].delete(url);
        }
        else {
            listSets[targetListType].add(url);
        }
    }
    return {
        allowlist: Array.from(listSets.allowlist),
        blocklist: Array.from(listSets.blocklist),
        fuzzylist: Array.from(listSets.fuzzylist),
        version: listState.version,
        name: PhishingController_1.phishingListKeyNameMap[listKey],
        tolerance: listState.tolerance,
        lastUpdated: latestDiffTimestamp,
    };
};
exports.applyDiffs = applyDiffs;
//# sourceMappingURL=utils.js.map