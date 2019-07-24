"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VariableSource;
(function (VariableSource) {
    VariableSource["JwtToken"] = "jwtToken";
    VariableSource["Tags"] = "tags";
    VariableSource["Request"] = "request";
    VariableSource["Response"] = "response";
    VariableSource["Payload"] = "payload";
})(VariableSource = exports.VariableSource || (exports.VariableSource = {}));
var Effect;
(function (Effect) {
    Effect["Allow"] = "allow";
    Effect["Deny"] = "deny";
})(Effect = exports.Effect || (exports.Effect = {}));
var When;
(function (When) {
    When["OnReceive"] = "onReceive";
    When["OnReturn"] = "onReturn";
})(When = exports.When || (exports.When = {}));
var Method;
(function (Method) {
    Method["GET"] = "GET";
    Method["POST"] = "POST";
    Method["PUT"] = "PUT";
    Method["DELETE"] = "DELETE";
    Method["PATCH"] = "PATCH";
    Method["OPTIONS"] = "OPTIONS";
})(Method = exports.Method || (exports.Method = {}));
var ValidationResult;
(function (ValidationResult) {
    ValidationResult[ValidationResult["Allow"] = 0] = "Allow";
    ValidationResult[ValidationResult["Deny"] = 1] = "Deny";
    ValidationResult[ValidationResult["NotMatch"] = 2] = "NotMatch";
})(ValidationResult = exports.ValidationResult || (exports.ValidationResult = {}));
