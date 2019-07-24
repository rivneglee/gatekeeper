"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var route_match_1 = __importDefault(require("../utilities/route-match"));
var invoke_1 = __importDefault(require("./invoke"));
exports.matchStatement = function (statement, action, path, ctx) {
    if (ctx === void 0) { ctx = {}; }
    var _a = statement.resources, resources = _a === void 0 ? [] : _a;
    var matched = resources
        .filter(function (_a) {
        var pattern = _a.pattern, actions = _a.actions;
        return route_match_1.default(path, pattern) && actions.indexOf(action) !== -1;
    });
    var conditionMatched = matched.some(function (_a) {
        var conditions = _a.conditions;
        return conditions.some(function (condition) { return invoke_1.default(condition, ctx); });
    });
    return !!conditionMatched;
};
exports.validatePolicy = function (policy, action, path, when, ctx) {
    var _a = policy.statements, statements = _a === void 0 ? [] : _a;
    var matched = statements
        .filter(function (s) { return s.when === when
        && s.resources.some(function (_a) {
            var pattern = _a.pattern, actions = _a.actions;
            return route_match_1.default(path, pattern) && actions.indexOf(action) !== -1;
        }); });
    if (matched.length === 0)
        return types_1.ValidationResult.NotMatch;
    matched = matched.filter(function (s) { return s.when === when && exports.matchStatement(s, action, path, ctx); });
    if (matched.length === 0)
        return types_1.ValidationResult.Deny;
    return matched.some(function (s) { return s.effect === types_1.Effect.Deny; })
        ? types_1.ValidationResult.Deny : types_1.ValidationResult.Allow;
};
exports.validateRole = function (role, action, path, when, ctx) {
    var _a = role.policies, policies = _a === void 0 ? [] : _a;
    var results = policies.map(function (p) { return exports.validatePolicy(p, action, path, when, ctx); });
    return results.some(function (r) { return r === types_1.ValidationResult.Deny; }) ?
        false : (results.some(function (r) { return r === types_1.ValidationResult.Allow; }) || results.every(function (r) { return r === types_1.ValidationResult.NotMatch; }));
};
