"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var deep_equal_1 = __importDefault(require("deep-equal"));
exports.default = (function (a, b) {
    if (typeof a !== typeof b)
        return false;
    if (typeof a === 'object') {
        return deep_equal_1.default(a, b);
    }
    return a === b;
});
