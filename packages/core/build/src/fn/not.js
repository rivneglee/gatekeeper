"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var equal_1 = __importDefault(require("./equal"));
exports.default = (function (a, b) { return !equal_1.default(a, b); });
