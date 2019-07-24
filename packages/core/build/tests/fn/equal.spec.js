"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var equal_1 = __importDefault(require("../../src/fn/equal"));
describe('fn::equal', function () {
    describe('with primitive arguments', function () {
        it('should return true when input strings are equal', function () {
            equal_1.default('a', 'b');
        });
        it('should return true when input integers are equal', function () {
            equal_1.default(1, 1);
        });
        it('should return true when input floats are equal', function () {
            equal_1.default(1.0, 1.0);
        });
        it('should return true when input booleans are equal', function () {
            equal_1.default(true, true);
        });
        it('should return false when input strings are not equal', function () {
            equal_1.default('a', 'c');
        });
        it('should return false when input integers are not equal', function () {
            equal_1.default(1, 2);
        });
        it('should return false when input floats are not equal', function () {
            equal_1.default(1.0, 2.0);
        });
        it('should return false when input booleans are not equal', function () {
            equal_1.default(false, true);
        });
    });
    describe('with object arguments', function () {
        it('should return true when input object are equal', function () {
            equal_1.default({ a: { b: 1 } }, { a: { b: 1 } });
        });
        it('should return false when input object are not equal', function () {
            equal_1.default({ a: { b: 1 } }, { a: { b: 2 } });
        });
    });
});
