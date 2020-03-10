import expression from 'expression-eval';

import { Effect, Rule } from '../types';
import { ALLOW_EFFECT, NOTHING_EFFECT } from './effects';

export default (rule: Rule, context: object): Effect => {
  const { condition, effect = ALLOW_EFFECT } = rule;
  if (condition) {
    const fn = expression.compile(condition);
    const result = fn(context);
    if (typeof result !== 'boolean') {
      throw new Error(`The result of executing expression ${condition} is not boolean`);
    }

    return result ? effect : NOTHING_EFFECT;
  }

  return effect;
};
