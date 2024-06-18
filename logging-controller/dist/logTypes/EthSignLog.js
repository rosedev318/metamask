"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigningStage = exports.SigningMethod = void 0;
/**
 * An enum of the signing method types that we are interested in logging.
 */
var SigningMethod;
(function (SigningMethod) {
    SigningMethod["EthSign"] = "eth_sign";
    SigningMethod["PersonalSign"] = "personal_sign";
    SigningMethod["EthSignTypedData"] = "eth_signTypedData";
    SigningMethod["EthSignTypedDataV3"] = "eth_signTypedData_v3";
    SigningMethod["EthSignTypedDataV4"] = "eth_signTypedData_v4";
})(SigningMethod = exports.SigningMethod || (exports.SigningMethod = {}));
/**
 * An enum of the various stages of the signing request
 */
var SigningStage;
(function (SigningStage) {
    SigningStage["Proposed"] = "proposed";
    SigningStage["Rejected"] = "rejected";
    SigningStage["Signed"] = "signed";
})(SigningStage = exports.SigningStage || (exports.SigningStage = {}));
//# sourceMappingURL=EthSignLog.js.map