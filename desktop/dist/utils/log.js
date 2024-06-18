"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loglevel_1 = __importDefault(require("loglevel"));
const config_1 = require("./config");
loglevel_1.default.setDefaultLevel((0, config_1.cfg)().isDebug ? 'debug' : 'info');
exports.default = loglevel_1.default;
//# sourceMappingURL=log.js.map