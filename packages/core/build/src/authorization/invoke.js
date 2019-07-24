"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var object_path_1 = __importDefault(require("object-path"));
var fn_1 = require("../fn");
var getFnName = function (invocation) { return Object.keys(invocation)[0]; };
var isFnInvocation = function (arg) { return (getFnName(arg) || '').startsWith(fn_1.FN_PREFIX); };
var isVariable = function (variable) { return variable['path'] && variable['in']; };
var invoke = function (fnInvocation, ctx, fnMap) {
    if (fnMap === void 0) { fnMap = fn_1.functions; }
    var fnName = getFnName(fnInvocation);
    var fn = fnMap[fnName];
    if (!fn)
        throw new Error("Invalid fn invocation - " + JSON.stringify(fnInvocation));
    var fnArgs = fnInvocation[fnName];
    var args = fnArgs.map(function (arg) {
        if (typeof arg !== 'object')
            return arg;
        if (isFnInvocation(arg)) {
            return invoke(arg, ctx, fnMap);
        }
        if (isVariable(arg)) {
            return object_path_1.default.get(ctx, arg.in + "." + arg.path);
        }
        return arg;
    });
    return fn.apply(void 0, args);
};
exports.default = invoke;
