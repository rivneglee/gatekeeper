"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var and_1 = __importDefault(require("./and"));
var or_1 = __importDefault(require("./or"));
var equal_1 = __importDefault(require("./equal"));
var not_1 = __importDefault(require("./not"));
exports.FN_PREFIX = 'fn::';
exports.functions = (_a = {},
    _a[exports.FN_PREFIX + "and"] = and_1.default,
    _a[exports.FN_PREFIX + "or"] = or_1.default,
    _a[exports.FN_PREFIX + "equal"] = equal_1.default,
    _a[exports.FN_PREFIX + "not"] = not_1.default,
    _a);
