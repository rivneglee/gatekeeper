import run from '../../../src/core/authorization/run-statement';
import { Effect, Method, Statement, ValidationResult, When } from '../../../src';

describe('run statement', () => {
  const statement: Statement = {
    effect: Effect.Allow,
    when: When.OnReceive,
    resources: [],
  };
  const trueCondition = { 'fn::equal': [1, 1] };
  const falseCondition = { 'fn::equal': [1, 2] };
  describe('not match', () => {
    it('should return `NotMatch` if resources is empty', () => {
      expect(run(statement,  Method.GET, '')).toBe(ValidationResult.NotMatch);
    });
    it('should return `NotMatch` if no matched route found', () => {
      expect(run({ ...statement, resources: [
          { pattern: '/bar', conditions: [trueCondition], actions: [Method.GET] },
      ]}, Method.GET, '/foo')).toBe(ValidationResult.NotMatch);
    });
    it('should return `NotMatch` if matched route found but condition is empty', () => {
      expect(run({ ...statement, resources: [
          { pattern: '/foo', conditions: [], actions: [Method.GET] },
      ]}, Method.GET, '/foo')).toBe(ValidationResult.NotMatch);
    });
    it('should return `NotMatch` if no matched actions', () => {
      expect(run({ ...statement, resources: [
          { pattern: '/foo', conditions: [trueCondition], actions: [Method.GET] },
      ]}, Method.POST, '/foo')).toBe(ValidationResult.NotMatch);
    });
    it('should return `NotMatch` if all conditions are false', () => {
      expect(run({ ...statement, resources: [
          { pattern: '/foo', conditions: [falseCondition, falseCondition], actions: [Method.GET] },
      ]}, Method.GET, '/foo')).toBe(ValidationResult.NotMatch);
    });
  });
  describe('Allow', () => {
    it('should return `Allow` if at least one conditions is true', () => {
      expect(run({ ...statement, resources: [
          { pattern: '/foo', conditions: [trueCondition, falseCondition], actions: [Method.GET] },
      ]}, Method.GET, '/foo')).toBe(ValidationResult.Allow);
    });
    it('should return `Allow` if at least a true conditions and a action matched', () => {
      expect(run({ ...statement, resources: [
        { pattern: '/foo', conditions: [trueCondition, falseCondition], actions: [
          Method.GET, Method.POST,
        ]},
      ]}, Method.GET, '/foo')).toBe(ValidationResult.Allow);
    });
    it('should return `Allow` if at least a resource matched', () => {
      expect(run({ ...statement, resources: [
          { pattern: '/foo', conditions: [trueCondition], actions: [Method.GET] },
          { pattern: '/bar', conditions: [trueCondition], actions: [Method.GET] },
      ]}, Method.GET, '/foo')).toBe(ValidationResult.Allow);
    });
  });
  describe('Deny', () => {
    it('should return `Deny` if at least one conditions is true', () => {
      expect(run({ ...statement, effect: Effect.Deny, resources: [
          { pattern: '/foo', conditions: [trueCondition, falseCondition], actions: [Method.GET] },
      ]}, Method.GET, '/foo')).toBe(ValidationResult.Deny);
    });
    it('should return `Deny` if at least a true conditions and a action matched', () => {
      expect(run({ ...statement, effect: Effect.Deny, resources: [
        { pattern: '/foo', conditions: [trueCondition, falseCondition], actions: [
          Method.GET, Method.POST,
        ]},
      ]}, Method.GET, '/foo')).toBe(ValidationResult.Deny);
    });
    it('should return `Deny` if at least a resource matched', () => {
      expect(run({ ...statement, effect: Effect.Deny, resources: [
          { pattern: '/foo', conditions: [trueCondition], actions: [Method.GET] },
          { pattern: '/bar', conditions: [trueCondition], actions: [Method.GET] },
      ]}, Method.GET, '/foo')).toBe(ValidationResult.Deny);
    });
  });
});
