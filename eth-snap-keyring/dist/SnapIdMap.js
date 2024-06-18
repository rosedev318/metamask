"use strict";
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
var _SnapIdMap_map;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapIdMap = exports.InvalidSnapIdError = void 0;
const CaseInsensitiveMap_1 = require("./CaseInsensitiveMap");
/**
 * Error thrown when an invalid Snap ID is encountered.
 */
class InvalidSnapIdError extends Error {
    /**
     * Creates an instance of `InvalidSnapIdError`.
     *
     * @param snapId - The invalid Snap ID.
     * @param key - The key associated with the invalid Snap ID.
     */
    constructor(snapId, key) {
        super(`Snap "${snapId}" is not allowed to set "${key}"`);
        this.name = 'InvalidSnapIdError';
        this.snapId = snapId;
        this.key = key;
    }
}
exports.InvalidSnapIdError = InvalidSnapIdError;
/**
 * A map that associates a string key with a value that has a `snapId`
 * property. Note that the key is case-insensitive.
 *
 * The `snapId` property is used to ensure that only the Snap that added an
 * item to the map can modify or delete it.
 */
class SnapIdMap {
    /**
     * Creates a new `SnapIdMap` object.
     *
     * Example:
     *
     * ```ts
     * const items = [
     *   ['foo', { snapId: '1', name: 'foo' }],
     *   ['bar', { snapId: '1', name: 'bar' }],
     * ];
     * const map = new SnapIdMap(items);
     * ```
     *
     * @param iterable - An iterable object whose elements are key-value pairs.
     * Each key-value pair will be added to the new map.
     */
    constructor(iterable) {
        _SnapIdMap_map.set(this, void 0);
        __classPrivateFieldSet(this, _SnapIdMap_map, new CaseInsensitiveMap_1.CaseInsensitiveMap(iterable), "f");
    }
    /**
     * Returns a plain object with the same key-value pairs as this map.
     *
     * Example:
     *
     * ```ts
     * const items = [
     *   ['foo', { snapId: '1', name: 'foo' }],
     *   ['bar', { snapId: '1', name: 'bar' }],
     * ];
     * const map = new SnapIdMap(items);
     * map.toObject();
     * // Returns
     * // {
     * //   foo: { snapId: '1', name: 'foo' },
     * //   bar: { snapId: '1', name: 'bar' },
     * // }
     * ```
     *
     * @returns A plain object with the same key-value pairs as this map.
     */
    toObject() {
        return __classPrivateFieldGet(this, _SnapIdMap_map, "f").toObject();
    }
    /**
     * Returns a new `SnapIdMap` object from an plain object.
     *
     * Example:
     *
     * ```ts
     * const obj = {
     *   foo: { snapId: '1', name: 'foo' },
     *   bar: { snapId: '1', name: 'bar' },
     * };
     * const map = SnapIdMap.fromObject(obj);
     * ```
     *
     * @param obj - A plain object whose elements will be added to the new map.
     * @returns A new `SnapIdMap` containing the elements of the given object.
     */
    static fromObject(obj) {
        return new SnapIdMap(Object.entries(obj));
    }
    /**
     * Gets a value from the map.
     *
     * If the given key is not present in the map or the Snap ID of the value is
     * different from the given Snap ID, returns `undefined`.
     *
     * Example:
     *
     * ```ts
     * const map = new SnapIdMap();
     * map.set('foo', { snapId: '1', name: 'foo' });
     * map.get('1', 'foo'); // Returns { snapId: '1', name: 'foo' }
     * map.get('2', 'foo'); // Returns `undefined`
     * map.get('1', 'bar'); // Returns `undefined`
     * ```
     *
     * @param snapId - Snap ID present in the value to get.
     * @param key - Key of the element to get.
     * @returns The value associated with the given key and Snap ID.
     */
    get(snapId, key) {
        const value = __classPrivateFieldGet(this, _SnapIdMap_map, "f").get(key);
        return value?.snapId === snapId ? value : undefined;
    }
    /**
     * Checks if a key is present in the map.
     *
     * If the given key is not present in the map or the Snap ID of the value is
     * different from the given Snap ID, returns `false`.
     *
     * Example:
     *
     * ```ts
     * const map = new SnapIdMap();
     * map.set('foo', { snapId: '1', name: 'foo' });
     * map.has('1', 'foo'); // Returns `true`
     * map.has('2', 'foo'); // Returns `false`
     * map.has('1', 'bar'); // Returns `false`
     * ```
     *
     * @param snapId - Snap ID present in the value to check.
     * @param key - Key of the element to check.
     * @returns `true` if the key is present in the map and the Snap ID of the
     * value is equal to the given Snap ID, `false` otherwise.
     */
    has(snapId, key) {
        return this.get(snapId, key) !== undefined;
    }
    /**
     * Deletes a key from the map.
     *
     * If the given key is not present in the map or the Snap IDs don't match,
     * returns `false` and does nothing.
     *
     * Example:
     *
     * ```ts
     * const map = new SnapIdMap();
     * map.set('foo', { snapId: '1', name: 'foo' });
     * map.delete('2', 'foo'); // Returns `false`
     * map.delete('1', 'bar'); // Returns `false`
     * map.delete('1', 'foo'); // Returns `true`
     * ```
     *
     * @param snapId - Snap ID present in the value to delete.
     * @param key - Key of the element to delete.
     * @returns `true` if the key was present in the map and the Snap ID of the
     * value was equal to the given Snap ID, `false` otherwise.
     */
    delete(snapId, key) {
        return this.has(snapId, key) && __classPrivateFieldGet(this, _SnapIdMap_map, "f").delete(key);
    }
    /* eslint-disable jsdoc/check-indentation */
    /**
     * Adds or updates a key-value pair in the map.
     *
     * Note that this method has a different behavior from the `Map.set`.
     *
     * - If the given key is not already present in the map, this method adds the
     *   key-value pair to the map.
     *
     * - If the given key is already present in the map and the Snap IDs match,
     *   this method updates the value associated with the key.
     *
     * - However, if the given key is already present in the map but the Snap IDs
     *   do not match, this method throws an error.
     *
     * @param key - Key of the element to add or update.
     * @param value - Value of the element to add or update.
     * @returns The map itself.
     */
    /* eslint-enable jsdoc/check-indentation */
    set(key, value) {
        // If the key is present in the map but isn't associated with the given
        // Snap ID, it means that the item was added to the map by a different
        // Snap. In this case, throw an error.
        if (__classPrivateFieldGet(this, _SnapIdMap_map, "f").has(key) && !this.has(value.snapId, key)) {
            throw new InvalidSnapIdError(value.snapId, key);
        }
        __classPrivateFieldGet(this, _SnapIdMap_map, "f").set(key, value);
        return this;
    }
    /**
     * Returns an iterable of the values in the map.
     *
     * Example:
     *
     * ```ts
     * const map = new SnapIdMap([
     *   ['foo', { snapId: '1', name: 'foo' }],
     *   ['bar', { snapId: '1', name: 'bar' }],
     * ]);
     * const values = [...map.values()];
     * // Returns
     * // [
     * //   { snapId: '1', name: 'foo' },
     * //   { snapId: '1', name: 'bar' },
     * // ]
     * ```
     *
     * @returns An iterable of the values in the map.
     */
    values() {
        return __classPrivateFieldGet(this, _SnapIdMap_map, "f").values();
    }
    /**
     * Returns the number of key-value pairs in the map.
     *
     * @returns The number of key-value pairs in the map.
     */
    get size() {
        return __classPrivateFieldGet(this, _SnapIdMap_map, "f").size;
    }
}
exports.SnapIdMap = SnapIdMap;
_SnapIdMap_map = new WeakMap();
//# sourceMappingURL=SnapIdMap.js.map