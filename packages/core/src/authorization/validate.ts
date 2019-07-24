import {Effect, Method, Policy, Role, Statement, ValidationResult, VariableContext, When} from '../types';
import match from '../utilities/route-match';
import invoke from './invoke';

export const matchStatement = (statement: Statement,
                               action: Method,
                               path: string,
                               ctx: VariableContext = {}): boolean => {
  const { resources = [] } = statement;
  const matched = resources
    .filter(({ pattern, actions }) => match(path, pattern) && actions.indexOf(action) !== -1);
  const conditionMatched = matched.some(({ conditions }) =>
      conditions.some(condition => invoke(condition, ctx)));
  return !!conditionMatched;
};

export const validatePolicy = (policy: Policy,
                               action: Method,
                               path: string,
                               when: When,
                               ctx: VariableContext): ValidationResult => {
  const { statements = [] } = policy;
  let matched = statements
    .filter(s => s.when === when
      && s.resources.some(({ pattern, actions }) => match(path, pattern) && actions.indexOf(action) !== -1));
  if (matched.length === 0) return ValidationResult.NotMatch;
  matched = matched.filter(s => s.when === when && matchStatement(s, action, path, ctx));
  if (matched.length === 0) return ValidationResult.Deny;
  return matched.some(s => s.effect === Effect.Deny)
    ? ValidationResult.Deny : ValidationResult.Allow;
};

export const validateRole = (role: Role,
                             action: Method,
                             path: string,
                             when: When,
                             ctx: VariableContext): boolean => {
  const { policies = [] } = role;
  const results = policies.map(p => validatePolicy(p, action, path, when, ctx));
  return results.some(r => r === ValidationResult.Deny) ?
    false : (results.some(r => r === ValidationResult.Allow) || results.every(r => r === ValidationResult.NotMatch));
};
