import invoke from '../../../src/core/authorization/invoke';
import { FnInvocation, Variable, VariableSource } from '../../../src/core/types';

describe('invoke', () => {
  const fnA = (a: any, b: any) => a + b;
  const fnB = (a: any, b: any) => a + b;
  const fnMap = {
    'fn::a': fnA,
    'fn::b': fnB,
  };

  describe('with primitive arguments', () => {
    beforeAll(() => {
      jest.spyOn(fnMap, 'fn::a');
      const invocation: FnInvocation = {
        'fn::a': [1, 2],
      };
      invoke(invocation, {}, fnMap);
    });

    it('should call fn with correct arguments', () => {
      expect(fnMap['fn::a']).toHaveBeenCalledWith(1, 2);
    });

    it('should return correct value', () => {
      expect(fnMap['fn::a']).toReturnWith(3);
    });
  });

  describe('with variable arguments', () => {
    beforeAll(() => {
      jest.spyOn(fnMap, 'fn::a');
      const var1: Variable = { path: 'a.b', in: VariableSource.JwtToken };
      const var2: Variable = { path: 'id', in: VariableSource.Path };
      const invocation: FnInvocation = {
        'fn::a': [
          var1,
          var2,
        ],
      };
      invoke(invocation, { jwtToken: { a: { b: 1 } }, pathVariables: { id: '123' } }, fnMap);
    });

    it('should call fn with correct arguments', () => {
      expect(fnMap['fn::a']).toHaveBeenCalledWith(1, '123');
    });

    it('should return correct value', () => {
      expect(fnMap['fn::a']).toReturnWith('1123');
    });
  });

  describe('with nested function invocations', () => {
    beforeAll(() => {
      jest.spyOn(fnMap, 'fn::a');
      jest.spyOn(fnMap, 'fn::b');
      const fn: FnInvocation = {
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
      const variable: Variable = { path: 'id', in: VariableSource.Path };
      const invocation: FnInvocation = {
        'fn::a': [
          fn,
          variable,
        ],
      };
      invoke(invocation, { pathVariables: { id: '123' } }, fnMap);
    });

    it('should call fn with correct arguments', () => {
      expect(fnMap['fn::a']).lastCalledWith(16, '123');
    });
  });
});
