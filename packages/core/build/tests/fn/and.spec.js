"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var and_1 = __importDefault(require("../../src/fn/and"));
describe('fn::and', function () {
    it('should return true when all arguments are true', function () {
        expect(and_1.default(true, true, true)).toBe(true);
    });
    it('should return false when one argument is false', function () {
        expect(and_1.default(true, false, true)).toBe(false);
    });
    it('should return false when all arguments are false', function () {
        expect(and_1.default(false, false, false)).toBe(false);
    });
});
