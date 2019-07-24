"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_to_regexp_1 = __importDefault(require("path-to-regexp"));
exports.default = (function (uri, pattern) {
    var regEx = path_to_regexp_1.default(pattern.replace(/\*/g, '([^/]+)'));
    return new RegExp(regEx).test(uri);
});
