import { Effect, EffectType, Method, Resource, Statement, When, Policy } from '../types';
import match from '../utils/route-match';
// @ts-ignore
import getRouteParams from 'router-params';

import evaluate from './evaluate';
import { NOTHING_EFFECT, ERROR_EFFECT } from './effects';

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
  const matcher = getRouteParams(resource.pattern);
  const $routeParams = matcher ? matcher(uri) : {};
  for (let i = 0; i < rules.length; i += 1) {
    const effect = evaluate(rules[i], { ...context, $routeParams });
    if (effect.type !==  EffectType.Nothing) {
      return effect;
    }
  }

  return NOTHING_EFFECT;
};

const EFFECT_PRIORITIES = {
  [EffectType.Error]: 0,
  [EffectType.Unauthorized]: 1,
  [EffectType.Deny]: 2,
  [EffectType.Redirect]: 3,
  [EffectType.Custom]: 4,
  [EffectType.Allow]: 5,
  [EffectType.Nothing]: 6,
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
  try {
    const policies = policyOrPolicies instanceof Array ? policyOrPolicies : [policyOrPolicies];
    return validatePolicies(uri, method, when, context, policies);
  } catch (e) {
    console.log(e.message);
    return ERROR_EFFECT;
  }
};
