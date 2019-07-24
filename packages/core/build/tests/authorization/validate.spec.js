"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var validate_1 = require("../../src/authorization/validate");
var src_1 = require("../../src");
describe('validate', function () {
    var trueCondition = { 'fn::equal': [1, 1] };
    var falseCondition = { 'fn::equal': [1, 2] };
    var statement = {
        effect: src_1.Effect.Allow,
        when: src_1.When.OnReceive,
        resources: [],
    };
    var policy = {
        version: '1.0.0',
        name: 'mock',
        statements: [],
    };
    var role = {
        name: 'mock',
        policies: [],
    };
    describe('match statement', function () {
        describe('not match', function () {
            it('should return false if resources is empty', function () {
                expect(validate_1.matchStatement(statement, src_1.Method.GET, '')).toBe(false);
            });
            it('should return false if no matched route found', function () {
                expect(validate_1.matchStatement(__assign({}, statement, { resources: [
                        { pattern: '/bar', conditions: [trueCondition], actions: [src_1.Method.GET] },
                    ] }), src_1.Method.GET, '/foo')).toBe(false);
            });
            it('should return false if no matched actions', function () {
                expect(validate_1.matchStatement(__assign({}, statement, { resources: [
                        { pattern: '/foo', conditions: [trueCondition], actions: [src_1.Method.GET] },
                    ] }), src_1.Method.POST, '/foo')).toBe(false);
            });
            it('should return false if matched route found but condition is empty', function () {
                expect(validate_1.matchStatement(__assign({}, statement, { resources: [
                        { pattern: '/foo', conditions: [], actions: [src_1.Method.GET] },
                    ] }), src_1.Method.GET, '/foo')).toBe(false);
            });
            it('should return false if all conditions are false', function () {
                expect(validate_1.matchStatement(__assign({}, statement, { resources: [
                        { pattern: '/foo', conditions: [falseCondition, falseCondition], actions: [src_1.Method.GET] },
                    ] }), src_1.Method.GET, '/foo')).toBe(false);
            });
        });
        describe('match', function () {
            it('should return true if at least one conditions is true', function () {
                expect(validate_1.matchStatement(__assign({}, statement, { resources: [
                        { pattern: '/foo', conditions: [trueCondition, falseCondition], actions: [src_1.Method.GET] },
                    ] }), src_1.Method.GET, '/foo')).toBe(true);
            });
            it('should return true if at least a true conditions and a action matched', function () {
                expect(validate_1.matchStatement(__assign({}, statement, { resources: [
                        { pattern: '/foo', conditions: [trueCondition, falseCondition], actions: [
                                src_1.Method.GET, src_1.Method.POST,
                            ] },
                    ] }), src_1.Method.GET, '/foo')).toBe(true);
            });
            it('should return true if at least a resource matched', function () {
                expect(validate_1.matchStatement(__assign({}, statement, { resources: [
                        { pattern: '/foo', conditions: [trueCondition, falseCondition], actions: [src_1.Method.GET] },
                        { pattern: '/bar', conditions: [trueCondition], actions: [src_1.Method.GET] },
                    ] }), src_1.Method.GET, '/foo')).toBe(true);
            });
        });
    });
    describe('validate policy', function () {
        describe('no matched', function () {
            it('should return `NotMatch` if statements is empty', function () {
                expect(validate_1.validatePolicy(policy, src_1.Method.GET, '/foo', src_1.When.OnReceive, {}))
                    .toBe(src_1.ValidationResult.NotMatch);
            });
            it('should return `NotMatch` if has statement but `when` not matched', function () {
                var p = __assign({}, policy, { statements: [statement] });
                expect(validate_1.validatePolicy(p, src_1.Method.GET, '/foo', src_1.When.OnReturn, {}))
                    .toBe(src_1.ValidationResult.NotMatch);
            });
            it('should return `NotMatch` if no resource matched', function () {
                var p = __assign({}, policy, { statements: [
                        __assign({}, statement, { resources: [{
                                    pattern: '/bar',
                                    conditions: [],
                                    actions: [src_1.Method.GET],
                                }] }),
                    ] });
                expect(validate_1.validatePolicy(p, src_1.Method.GET, '/foo', src_1.When.OnReceive, {}))
                    .toBe(src_1.ValidationResult.NotMatch);
            });
        });
        describe('allow', function () {
            it('should return `Allow` if has a allow statement and no deny statement found', function () {
                var p = __assign({}, policy, { statements: [
                        __assign({}, statement, { resources: [{
                                    pattern: '/foo',
                                    conditions: [
                                        trueCondition,
                                    ],
                                    actions: [src_1.Method.GET],
                                }] }),
                        __assign({}, statement, { resources: [{
                                    pattern: '/foo',
                                    conditions: [
                                        falseCondition,
                                    ],
                                    actions: [src_1.Method.GET],
                                }] }),
                    ] });
                expect(validate_1.validatePolicy(p, src_1.Method.GET, '/foo', src_1.When.OnReceive, {}))
                    .toBe(src_1.ValidationResult.Allow);
            });
        });
        describe('deny', function () {
            it('should return `Deny` if has a deny statement found', function () {
                var p = __assign({}, policy, { statements: [
                        __assign({}, statement, { resources: [{
                                    pattern: '/foo',
                                    conditions: [
                                        trueCondition,
                                    ],
                                    actions: [src_1.Method.GET],
                                }] }),
                        __assign({}, statement, { effect: src_1.Effect.Deny, resources: [{
                                    pattern: '/foo',
                                    conditions: [
                                        trueCondition,
                                    ],
                                    actions: [src_1.Method.GET],
                                }] }),
                    ] });
                expect(validate_1.validatePolicy(p, src_1.Method.GET, '/foo', src_1.When.OnReceive, {}))
                    .toBe(src_1.ValidationResult.Deny);
            });
        });
    });
    describe('validate role', function () {
        describe('not match', function () {
            it('should return false if policies is empty', function () {
                expect(validate_1.validateRole(role, src_1.Method.GET, '/foo', src_1.When.OnReceive, {}))
                    .toBe(false);
            });
            it('should return false if no matched policies', function () {
                var r = __assign({}, role, { policies: [policy] });
                expect(validate_1.validateRole(r, src_1.Method.GET, '/foo', src_1.When.OnReturn, {}))
                    .toBe(false);
            });
        });
        describe('allow', function () {
            it('should return true if no matched policies', function () {
                var r = __assign({}, role, { policies: [
                        __assign({}, policy, { statements: [
                                __assign({}, statement, { resources: [{
                                            pattern: '/foo',
                                            conditions: [
                                                trueCondition,
                                            ],
                                            actions: [src_1.Method.GET],
                                        }] }),
                            ] })
                    ] });
                expect(validate_1.validateRole(r, src_1.Method.GET, '/foo', src_1.When.OnReceive, {}))
                    .toBe(true);
            });
        });
        describe('deny', function () {
            it('should return false if deny policy found', function () {
                var r = __assign({}, role, { policies: [
                        __assign({}, policy, { statements: [
                                __assign({}, statement, { resources: [{
                                            pattern: '/foo',
                                            conditions: [
                                                trueCondition,
                                            ],
                                            actions: [src_1.Method.GET],
                                        }] }),
                            ] }),
                        __assign({}, policy, { statements: [
                                __assign({}, statement, { effect: src_1.Effect.Deny, resources: [{
                                            pattern: '/foo',
                                            conditions: [
                                                trueCondition,
                                            ],
                                            actions: [src_1.Method.GET],
                                        }] }),
                            ] }),
                    ] });
                expect(validate_1.validateRole(r, src_1.Method.GET, '/foo', src_1.When.OnReceive, {}))
                    .toBe(false);
            });
        });
    });
});
