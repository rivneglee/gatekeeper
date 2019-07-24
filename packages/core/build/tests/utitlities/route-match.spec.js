"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var route_match_1 = __importDefault(require("../../src/utilities/route-match"));
describe('route-match', function () {
    it('should return true if uri absolutely equal to pattern', function () {
        expect(route_match_1.default('/abc/def/xyz', '/abc/def/xyz')).toBe(true);
    });
    it('should return false if uri not equal to pattern', function () {
        expect(route_match_1.default('/abc/def/xyz', '/abc/def/xyy')).toBe(false);
    });
    it('should return true if path variables contained in uri', function () {
        expect(route_match_1.default('/abc/123/xyz/def', '/abc/:id/xyz/:name')).toBe(true);
    });
    it('should return false if uri doesnt match to pattern', function () {
        expect(route_match_1.default('/abc/123/xyz/def', '/abc/:id/xyz/:name/xxx')).toBe(false);
    });
    it('should return true if wildcard is at end of pattern', function () {
        expect(route_match_1.default('/abc/123/xyz/def', '/abc/:id/xyz/:name*')).toBe(true);
    });
    it('should return true if wildcard is at middle of pattern', function () {
        expect(route_match_1.default('/abc/123/xyz/def', '/abc/:id/*/:name')).toBe(true);
    });
});
