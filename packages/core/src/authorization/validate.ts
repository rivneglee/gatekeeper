import { Effect, EffectType, Method, Resource, Statement, When, Policy } from '../types';
import match from './route-match';
import evaluate from './evaluate';
import { NOTHING_EFFECT } from './effects';

const isResourceMatch = (
  resource: Resource,
  uri: string,
  method: Method,
) => match(uri, resource.pattern)
      && (resource.methods === '*' || resource.methods.includes(method));

const validateStatement = (
  uri: string,
  method: Method,
  when: When,
  context: object,
  statement: Statement,
): Effect => {
  const { resource, [when]: rules = [] } = statement;
  if (!isResourceMatch(resource, uri, method) || rules.length === 0) return NOTHING_EFFECT;
  for (let i = 0; i < rules.length; i += 1) {
    const effect = evaluate(rules[i], context);
    if (effect.type !==  EffectType.Nothing) {
      return effect;
    }
  }

  return NOTHING_EFFECT;
};

const EFFECT_PRIORITIES = {
  [EffectType.Unauthorized]: 0,
  [EffectType.Deny]: 1,
  [EffectType.Redirect]: 2,
  [EffectType.Custom]: 3,
  [EffectType.Allow]: 4,
  [EffectType.Nothing]: 5,
};

const validatePolicies = (
  uri: string,
  method: Method,
  when: When,
  context: object,
  policies: Policy[],
): Effect => {
  const effects = policies.flatMap(({ statements }) => (
    statements.map(statement => validateStatement(uri, method, when, context, statement))
  ));

  if (effects.length === 0) return NOTHING_EFFECT;
  effects.sort((a, b) => EFFECT_PRIORITIES[a.type] - EFFECT_PRIORITIES[b.type]);

  return effects[0];
};

export default (
  uri: string,
  method: Method,
  when: When,
  context: object,
  policyOrPolicies: Policy[] | Policy,
): Effect => {
  const policies = policyOrPolicies instanceof Array ? policyOrPolicies : [policyOrPolicies];
  return validatePolicies(uri, method, when, context, policies);
};
