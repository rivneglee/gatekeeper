"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var or_1 = __importDefault(require("../../src/fn/or"));
describe('fn::or', function () {
    it('should return true when all arguments are true', function () {
        expect(or_1.default(true, true, true)).toBe(true);
    });
    it('should return false when one argument is false', function () {
        expect(or_1.default(true, false, false)).toBe(true);
    });
    it('should return false when all arguments are false', function () {
        expect(or_1.default(false, false, false)).toBe(false);
    });
});
