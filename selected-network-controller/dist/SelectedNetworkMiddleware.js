"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSelectedNetworkMiddleware = void 0;
const SelectedNetworkController_1 = require("./SelectedNetworkController");
const createSelectedNetworkMiddleware = (messenger) => {
    const getNetworkClientIdForDomain = (origin) => messenger.call(SelectedNetworkController_1.SelectedNetworkControllerActionTypes.getNetworkClientIdForDomain, origin);
    return (req, _, next) => {
        if (!req.origin) {
            throw new Error("Request object is lacking an 'origin'");
        }
        req.networkClientId = getNetworkClientIdForDomain(req.origin);
        return next();
    };
};
exports.createSelectedNetworkMiddleware = createSelectedNetworkMiddleware;
//# sourceMappingURL=SelectedNetworkMiddleware.js.map