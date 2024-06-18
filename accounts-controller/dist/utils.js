"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUUIDFromAddressOfNormalAccount = exports.keyringTypeToName = void 0;
const util_1 = require("@ethereumjs/util");
const keyring_controller_1 = require("@metamask/keyring-controller");
const sha256_1 = require("ethereum-cryptography/sha256");
const uuid_1 = require("uuid");
/**
 * Returns the name of the keyring type.
 *
 * @param keyringType - The type of the keyring.
 * @returns The name of the keyring type.
 */
function keyringTypeToName(keyringType) {
    // Custody keyrings are a special case, as they are not a single type
    // they just start with the prefix `Custody`
    if ((0, keyring_controller_1.isCustodyKeyring)(keyringType)) {
        return 'Custody';
    }
    switch (keyringType) {
        case keyring_controller_1.KeyringTypes.simple: {
            return 'Account';
        }
        case keyring_controller_1.KeyringTypes.hd: {
            return 'Account';
        }
        case keyring_controller_1.KeyringTypes.trezor: {
            return 'Trezor';
        }
        case keyring_controller_1.KeyringTypes.ledger: {
            return 'Ledger';
        }
        case keyring_controller_1.KeyringTypes.lattice: {
            return 'Lattice';
        }
        case keyring_controller_1.KeyringTypes.qr: {
            return 'QR';
        }
        case "Remote": {
            return 'Remote';
        }
        case keyring_controller_1.KeyringTypes.snap: {
            return 'Snap Account';
        }
        default: {
            throw new Error(`Unknown keyring ${keyringType}`);
        }
    }
}
exports.keyringTypeToName = keyringTypeToName;
/**
 * Generates a UUID from a given Ethereum address.
 * @param address - The Ethereum address to generate the UUID from.
 * @returns The generated UUID.
 */
function getUUIDFromAddressOfNormalAccount(address) {
    const v4options = {
        random: (0, sha256_1.sha256)((0, util_1.toBuffer)(address)).slice(0, 16),
    };
    return (0, uuid_1.v4)(v4options);
}
exports.getUUIDFromAddressOfNormalAccount = getUUIDFromAddressOfNormalAccount;
//# sourceMappingURL=utils.js.map