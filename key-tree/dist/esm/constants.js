export const BYTES_KEY_LENGTH = 32;
export const MIN_BIP_44_DEPTH = 0;
export const MAX_BIP_44_DEPTH = 5;
export const MAX_UNHARDENED_BIP_32_INDEX = 0x7fffffff; // 2^31 - 1
export const MAX_BIP_32_INDEX = 0xffffffff; // 2^32 - 1
export const BIP44PurposeNodeToken = `bip32:44'`;
export const UNPREFIXED_PATH_REGEX = /^\d+$/u;
/**
 * e.g.
 * -  0
 * -  0'
 */ export const UNPREFIXED_BIP_32_PATH_REGEX = RegExp("^(?<index>\\d+)'?$", "u");
/**
 * e.g.
 * -  bip32:0
 * -  bip32:0'
 */ export const BIP_32_PATH_REGEX = /^bip32:\d+'?$/u;
/**
 * e.g.
 * -  slip10:0
 * -  slip10:0'
 */ export const SLIP_10_PATH_REGEX = /^slip10:\d+'?$/u;
/**
 * bip39:<SPACE_DELMITED_SEED_PHRASE>
 *
 * The seed phrase must consist of 12 <= 24 words.
 */ export const BIP_39_PATH_REGEX = /^bip39:([a-z]+){1}( [a-z]+){11,23}$/u;
export const BIP_32_HARDENED_OFFSET = 0x80000000;

//# sourceMappingURL=constants.js.map