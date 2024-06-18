import type { Hotlist, ListKeys, PhishingListState } from './PhishingController';
/**
 * Fetches current epoch time in seconds.
 *
 * @returns the Date.now() time in seconds instead of miliseconds. backend files rely on timestamps in seconds since epoch.
 */
export declare const fetchTimeNow: () => number;
/**
 * Determines which diffs are applicable to the listState, then applies those diffs.
 *
 * @param listState - the stalelist or the existing liststate that diffs will be applied to.
 * @param hotlistDiffs - the diffs to apply to the listState if valid.
 * @param listKey - the key associated with the input/output phishing list state.
 * @returns the new list state
 */
export declare const applyDiffs: (listState: PhishingListState, hotlistDiffs: Hotlist, listKey: ListKeys) => PhishingListState;
//# sourceMappingURL=utils.d.ts.map