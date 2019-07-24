"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var not_1 = __importDefault(require("../../src/fn/not"));
describe('fn::not', function () {
    describe('with primitive arguments', function () {
        it('should return false when input strings are equal', function () {
            expect(not_1.default('a', 'a')).toBe(false);
        });
        it('should return false when input integers are equal', function () {
            expect(not_1.default(1, 1)).toBe(false);
        });
        it('should return false when input floats are equal', function () {
            expect(not_1.default(1.0, 1.0)).toBe(false);
        });
        it('should return false when input booleans are equal', function () {
            expect(not_1.default(true, true)).toBe(false);
        });
        it('should return true when input strings are not equal', function () {
            expect(not_1.default('a', 'b')).toBe(true);
        });
        it('should return true when input integers are not equal', function () {
            expect(not_1.default(1, 2)).toBe(true);
        });
        it('should return true when input floats are not equal', function () {
            expect(not_1.default(1.0, 2.0)).toBe(true);
        });
        it('should return true when input booleans are not equal', function () {
            expect(not_1.default(true, false)).toBe(true);
        });
    });
    describe('with object arguments', function () {
        it('should return false when input object are equal', function () {
            expect(not_1.default({ a: { b: 1 } }, { a: { b: 1 } })).toBe(false);
        });
        it('should return true when input object are not equal', function () {
            expect(not_1.default({ a: { b: 1 } }, { a: { b: 2 } })).toBe(true);
        });
    });
});
