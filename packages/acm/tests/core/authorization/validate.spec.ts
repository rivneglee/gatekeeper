import {
  matchStatement,
  validatePolicy,
  validateRole,
} from '../../../src/core/authorization/validate';
import {
  Effect,
  Method,
  Policy,
  Role,
  Statement,
  ValidationResult,
  When,
} from '../../../src';

describe('validate', () => {
  const trueCondition = { 'fn::equal': [1, 1] };
  const falseCondition = { 'fn::equal': [1, 2] };
  const statement: Statement = {
    effect: Effect.Allow,
    when: When.OnReceive,
    resources: [],
  };
  const policy: Policy = {
    version: '1.0.0',
    name: 'mock',
    statements: [],
  };
  const role: Role = {
    name: 'mock',
    policies: [],
  };
  describe('match statement', () => {
    describe('not match', () => {
      it('should return false if resources is empty', () => {
        expect(matchStatement(statement,  Method.GET, '')).toBe(false);
      });
      it('should return false if no matched route found', () => {
        expect(matchStatement({ ...statement, resources: [
          { pattern: '/bar', conditions: [trueCondition], actions: [Method.GET] },
        ]}, Method.GET, '/foo')).toBe(false);
      });
      it('should return false if no matched actions', () => {
        expect(matchStatement({ ...statement, resources: [
          { pattern: '/foo', conditions: [trueCondition], actions: [Method.GET] },
        ]}, Method.POST, '/foo')).toBe(false);
      });
      it('should return false if matched route found but condition is empty', () => {
        expect(matchStatement({ ...statement, resources: [
            { pattern: '/foo', conditions: [], actions: [Method.GET] },
        ]}, Method.GET, '/foo')).toBe(false);
      });
      it('should return false if all conditions are false', () => {
        expect(matchStatement({ ...statement, resources: [
          { pattern: '/foo', conditions: [falseCondition, falseCondition], actions: [Method.GET] },
        ]}, Method.GET, '/foo')).toBe(false);
      });
    });
    describe('match', () => {
      it('should return true if at least one conditions is true', () => {
        expect(matchStatement({ ...statement, resources: [
            { pattern: '/foo', conditions: [trueCondition, falseCondition], actions: [Method.GET] },
        ]}, Method.GET, '/foo')).toBe(true);
      });
      it('should return true if at least a true conditions and a action matched', () => {
        expect(matchStatement({ ...statement, resources: [
          { pattern: '/foo', conditions: [trueCondition, falseCondition], actions: [
            Method.GET, Method.POST,
          ]},
        ]}, Method.GET, '/foo')).toBe(true);
      });
      it('should return true if at least a resource matched', () => {
        expect(matchStatement({ ...statement, resources: [
            { pattern: '/foo', conditions: [trueCondition], actions: [Method.GET] },
            { pattern: '/bar', conditions: [trueCondition], actions: [Method.GET] },
        ]}, Method.GET, '/foo')).toBe(true);
      });
    });
  });

  describe('validate policy', () => {
    describe('no matched', () => {
      it('should return `NotMatch` if statements is empty', () => {
        expect(validatePolicy(policy,  Method.GET, '/foo', When.OnReceive, {}))
          .toBe(ValidationResult.NotMatch);
      });
      it('should return `NotMatch` if has statement but `when` not matched', () => {
        const p = { ...policy, statements: [statement] };
        expect(validatePolicy(p,  Method.GET, '/foo', When.OnReturn, {}))
          .toBe(ValidationResult.NotMatch);
      });
      it('should return `NotMatch` if no resource matched', () => {
        const p = { ...policy, statements: [
          {
            ...statement,
            resources: [{
              pattern: '/bar',
              conditions: [],
              actions: [Method.GET],
            }],
          },
        ]};
        expect(validatePolicy(p,  Method.GET, '/foo', When.OnReceive, {}))
          .toBe(ValidationResult.NotMatch);
      });
    });
    describe('allow', () => {
      it('should return `Allow` if has a allow statement and no deny statement found', () => {
        const p = { ...policy, statements: [
          {
            ...statement,
            resources: [{
              pattern: '/foo',
              conditions: [
                trueCondition,
              ],
              actions: [Method.GET],
            }],
          },
          {
            ...statement,
            resources: [{
              pattern: '/foo',
              conditions: [
                falseCondition,
              ],
              actions: [Method.GET],
            }],
          },
        ]};
        expect(validatePolicy(p,  Method.GET, '/foo', When.OnReceive, {}))
          .toBe(ValidationResult.Allow);
      });
    });
    describe('deny', () => {
      it('should return `Deny` if has a deny statement found', () => {
        const p = { ...policy, statements: [
          {
            ...statement,
            resources: [{
              pattern: '/foo',
              conditions: [
                trueCondition,
              ],
              actions: [Method.GET],
            }],
          },
          {
            ...statement,
            effect: Effect.Deny,
            resources: [{
              pattern: '/foo',
              conditions: [
                trueCondition,
              ],
              actions: [Method.GET],
            }],
          },
        ]};
        expect(validatePolicy(p,  Method.GET, '/foo', When.OnReceive, {}))
          .toBe(ValidationResult.Deny);
      });
    });
  });

  describe('validate role', () => {
    describe('not match', () => {
      it('should return false if policies is empty', () => {
        expect(validateRole(role,  Method.GET, '/foo', When.OnReceive, {}))
          .toBe(false);
      });
      it('should return false if no matched policies', () => {
        const r = { ...role, policies: [policy] };
        expect(validateRole(r,  Method.GET, '/foo', When.OnReturn, {}))
          .toBe(false);
      });
    });
    describe('allow', () => {
      it('should return true if no matched policies', () => {
        const r = { ...role,
          policies: [
            {...policy,
              statements: [
                {
                  ...statement,
                  resources: [{
                    pattern: '/foo',
                    conditions: [
                      trueCondition,
                    ],
                    actions: [Method.GET],
                  }],
                },
              ],
            }],
        };
        expect(validateRole(r,  Method.GET, '/foo', When.OnReceive, {}))
          .toBe(true);
      });
    });

    describe('deny', () => {
      it('should return false if deny policy found', () => {
        const r = { ...role,
          policies: [
            {...policy,
              statements: [
                {
                  ...statement,
                  resources: [{
                    pattern: '/foo',
                    conditions: [
                      trueCondition,
                    ],
                    actions: [Method.GET],
                  }],
                },
              ],
            },
            {...policy,
              statements: [
                {
                  ...statement,
                  effect: Effect.Deny,
                  resources: [{
                    pattern: '/foo',
                    conditions: [
                      trueCondition,
                    ],
                    actions: [Method.GET],
                  }],
                },
              ],
            },
          ],
        };
        expect(validateRole(r,  Method.GET, '/foo', When.OnReceive, {}))
          .toBe(false);
      });
    });
  });
});
