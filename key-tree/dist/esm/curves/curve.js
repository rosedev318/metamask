import { utils } from '@noble/secp256k1';
import * as ed25519 from './ed25519';
import * as secp256k1 from './secp256k1';
export const curves = {
    secp256k1,
    ed25519
};
/**
 * Get a curve by name.
 *
 * @param curveName - The name of the curve to get.
 * @returns The curve.
 */ export function getCurveByName(curveName) {
    return curves[curveName];
}
// As long as both parameters are specified, this function is the same for all curves.
export const { mod } = utils;

//# sourceMappingURL=curve.js.map