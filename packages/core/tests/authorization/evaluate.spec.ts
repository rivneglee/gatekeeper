import evaluate from '../../src/authorization/evaluate';
import { Rule } from '../../src/types';
import { ALLOW_EFFECT, DENY_EFFECT, NOTHING_EFFECT } from '../../src/authorization/effects';

describe('evaluate', () => {
  const context = {
    foo: 'foo',
    bar: 'bar',
  };

  it('should return given effect if condition is true', () => {
    const rule: Rule = {
      effect: ALLOW_EFFECT,
    };
    expect(evaluate(rule, context)).toEqual(ALLOW_EFFECT);
  });

  it('should return given effect if condition is not given', () => {
    const rule: Rule = {
      effect: DENY_EFFECT,
    };
    expect(evaluate(rule, context)).toEqual(DENY_EFFECT);
  });

  it('should return `Allow` if condition is true and effect is not given', () => {
    const rule: Rule = {
      condition: 'bar!=foo',
    };
    expect(evaluate(rule, context)).toEqual(ALLOW_EFFECT);
  });

  it('should return `Nothing` if condition is false', () => {
    const rule: Rule = {
      condition: 'bar==foo',
      effect: ALLOW_EFFECT,
    };
    expect(evaluate(rule, context)).toEqual(NOTHING_EFFECT);
  });
});
