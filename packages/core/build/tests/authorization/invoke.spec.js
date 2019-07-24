"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var invoke_1 = __importDefault(require("../../src/authorization/invoke"));
var types_1 = require("../../src/types");
describe('invoke', function () {
    var fnA = function (a, b) { return a + b; };
    var fnB = function (a, b) { return a + b; };
    var fnMap = {
        'fn::a': fnA,
        'fn::b': fnB,
    };
    describe('with primitive arguments', function () {
        beforeAll(function () {
            jest.spyOn(fnMap, 'fn::a');
            var invocation = {
                'fn::a': [1, 2],
            };
            invoke_1.default(invocation, {}, fnMap);
        });
        it('should call fn with correct arguments', function () {
            expect(fnMap['fn::a']).toHaveBeenCalledWith(1, 2);
        });
        it('should return correct value', function () {
            expect(fnMap['fn::a']).toReturnWith(3);
        });
    });
    describe('with variable arguments', function () {
        beforeAll(function () {
            jest.spyOn(fnMap, 'fn::a');
            var var1 = { path: 'a.b', in: types_1.VariableSource.JwtToken };
            var var2 = { path: 'id', in: types_1.VariableSource.Request };
            var invocation = {
                'fn::a': [
                    var1,
                    var2,
                ],
            };
            invoke_1.default(invocation, { jwtToken: { a: { b: 1 } }, request: { id: '123' } }, fnMap);
        });
        it('should call fn with correct arguments', function () {
            expect(fnMap['fn::a']).toHaveBeenCalledWith(1, '123');
        });
        it('should return correct value', function () {
            expect(fnMap['fn::a']).toReturnWith('1123');
        });
    });
    describe('with nested function invocations', function () {
        beforeAll(function () {
            jest.spyOn(fnMap, 'fn::a');
            jest.spyOn(fnMap, 'fn::b');
            var fn = {
                'fn::b': [
                    {
                        'fn::b': [
                            { 'fn::b': [1, 2] },
                            { 'fn::b': [3, 4] },
                        ],
                    },
                    {
                        'fn::b': [
                            { 'fn::b': [2, 2] },
                            { 'fn::b': [1, 1] },
                        ],
                    },
                ],
            };
            var variable = { path: 'id', in: types_1.VariableSource.Request };
            var invocation = {
                'fn::a': [
                    fn,
                    variable,
                ],
            };
            invoke_1.default(invocation, { request: { id: '123' } }, fnMap);
        });
        it('should call fn with correct arguments', function () {
            expect(fnMap['fn::a']).lastCalledWith(16, '123');
        });
    });
});
