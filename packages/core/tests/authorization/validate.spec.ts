import { validatePolicy, validateRole, validateStatement } from '../../src/authorization/validate';
import { Effect, Method, Policy, Role, Statement, ValidationResult, When } from '../../src';

fdescribe('validate', () => {
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
  describe('statement', () => {
    describe('not match', () => {
      it('should return `NotMatch` if resources is empty', () => {
        expect(validateStatement(statement,  Method.GET, '')).toBe(ValidationResult.NotMatch);
      });
      it('should return `NotMatch` if no matched route found', () => {
        expect(validateStatement({ ...statement, resources: [
          { pattern: '/bar', conditions: [trueCondition], actions: [Method.GET] },
        ]}, Method.GET, '/foo')).toBe(ValidationResult.NotMatch);
      });
      it('should return `NotMatch` if no matched actions', () => {
        expect(validateStatement({ ...statement, resources: [
          { pattern: '/foo', conditions: [trueCondition], actions: [Method.GET] },
        ]}, Method.POST, '/foo')).toBe(ValidationResult.NotMatch);
      });
      it('should return `NotMatch` if matched route found but condition is empty', () => {
        expect(validateStatement({ ...statement, resources: [
            { pattern: '/foo', conditions: [], actions: [Method.GET] },
        ]}, Method.GET, '/foo')).toBe(ValidationResult.NotMatch);
      });
      it('should return `NotMatch` if all conditions are false', () => {
        expect(validateStatement({ ...statement, resources: [
          { pattern: '/foo', conditions: [falseCondition, falseCondition], actions: [Method.GET] },
        ]}, Method.GET, '/foo')).toBe(ValidationResult.NotMatch);
      });
    });
    describe('match', () => {
      describe('allow', () => {
        it('should return `Allow` if at least one conditions is true', () => {
          expect(validateStatement({ ...statement, resources: [
              { pattern: '/foo', conditions: [trueCondition, falseCondition], actions: [Method.GET] },
          ]}, Method.GET, '/foo')).toBe(ValidationResult.Allow);
        });
        it('should return `Allow` if at least a true conditions and a action matched', () => {
          expect(validateStatement({ ...statement, resources: [
            { pattern: '/foo', conditions: [trueCondition, falseCondition], actions: [
              Method.GET, Method.POST,
            ]},
          ]}, Method.GET, '/foo')).toBe(ValidationResult.Allow);
        });
        it('should return `Allow` if at least a resource matched', () => {
          expect(validateStatement({ ...statement, resources: [
              { pattern: '/foo', conditions: [trueCondition, falseCondition], actions: [Method.GET] },
              { pattern: '/bar', conditions: [trueCondition], actions: [Method.GET] },
          ]}, Method.GET, '/foo')).toBe(ValidationResult.Allow);
        });
      });
      describe('deny', () => {
        it('should return `Deny`if at least one conditions is true', () => {
          expect(validateStatement({ ...statement, effect: Effect.Deny, resources: [
              { pattern: '/foo', conditions: [trueCondition, falseCondition], actions: [Method.GET] },
          ]}, Method.GET, '/foo')).toBe(ValidationResult.Deny);
        });
        it('should return `Deny`if at least a true conditions and a action matched', () => {
          expect(validateStatement({ ...statement, effect: Effect.Deny, resources: [
            { pattern: '/foo', conditions: [trueCondition, falseCondition], actions: [
              Method.GET, Method.POST,
            ]},
          ]}, Method.GET, '/foo')).toBe(ValidationResult.Deny);
        });
        it('should return `Deny`if at least a resource matched', () => {
          expect(validateStatement({ ...statement, effect: Effect.Deny, resources: [
              { pattern: '/foo', conditions: [trueCondition, falseCondition], actions: [Method.GET] },
              { pattern: '/bar', conditions: [trueCondition], actions: [Method.GET] },
          ]}, Method.GET, '/foo')).toBe(ValidationResult.Deny);
        });
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
      it('should return `Allow` if a resource matched but `when` not matched', () => {
        const p = { ...policy, statements: [
          {
            ...statement,
            resources: [{
              pattern: '/foo',
              conditions: [],
              actions: [Method.GET],
            }],
          },
        ]};
        expect(validatePolicy(p,  Method.GET, '/foo', When.OnReturn, {}))
          .toBe(ValidationResult.Allow);
      });
    });
    describe('match', () => {
      describe('allow', () => {
        it('should return `Allow` if has a `Allow` statement and no deny statement found', () => {
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
  });

  describe('validate role', () => {
    describe('not match', () => {
      it('should return `NotMatch` if policies is empty', () => {
        expect(validateRole(role,  Method.GET, '/foo', When.OnReceive, {}))
          .toBe(ValidationResult.NotMatch);
      });
      it('should return `NotMatch` if no matched policies', () => {
        const r = { ...role, policies: [policy] };
        expect(validateRole(r,  Method.GET, '/foo', When.OnReturn, {}))
          .toBe(ValidationResult.NotMatch);
      });
    });
    describe('match', () => {
      describe('allow', () => {
        it('should return `Allow` if there is a policy matched with `Allow` statement', () => {
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
            .toBe(ValidationResult.Allow);
        });
      });
      describe('deny', () => {
        it('should return `Deny` if there is a policy policy matched with `Deny` statement ', () => {
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
            .toBe(ValidationResult.Deny);
        });
      });
    });
  });
});
