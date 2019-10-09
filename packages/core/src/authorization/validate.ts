import {Effect, Method, Policy, Role, Statement, ValidationResult, VariableContext, When} from '../types';
import match from '../utilities/route-match';
import invoke from './invoke';

export const validateStatement = (statement: Statement,
                                  action: Method,
                                  path: string,
                                  ctx: VariableContext = {}): ValidationResult => {
  const { resources = [], effect } = statement;
  const isMatch = resources
    .some(({ pattern, actions, conditions }) => match(path, pattern)
      && actions.indexOf(action) !== -1
      && conditions.some(condition => invoke(condition, ctx)));
  if (!isMatch) return ValidationResult.NotMatch;
  return effect === Effect.Allow  ? ValidationResult.Allow : ValidationResult.Deny;
};

export const validatePolicy = (policy: Policy,
                               action: Method,
                               path: string,
                               when: When,
                               ctx: VariableContext): ValidationResult => {
  const { statements = [] } = policy;
  const matched = statements.filter(s => s.when === when);
  if (matched.length === 0) return ValidationResult.NotMatch;
  const results = statements.map(s => validateStatement(s, action, path, ctx));
  const allowOrDeny = results.find(r => r === ValidationResult.Allow || r === ValidationResult.Deny);
  if (!allowOrDeny) return ValidationResult.NotMatch;
  return allowOrDeny;
};

export const validateRole = (role: Role,
                             action: Method,
                             path: string,
                             when: When,
                             ctx: VariableContext): ValidationResult => {
  const { policies = [] } = role;
  const results = policies.map(p => validatePolicy(p, action, path, when, ctx));
  const allowOrDeny = results.find(r => r === ValidationResult.Allow || r === ValidationResult.Deny);
  if (!allowOrDeny) return ValidationResult.NotMatch;
  return allowOrDeny;
};
