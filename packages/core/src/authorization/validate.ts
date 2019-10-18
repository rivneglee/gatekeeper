import { Effect, Method, Policy, Role, Statement, ValidationResult, VariableContext, When } from '../types';
import match from '../utilities/route-match';
import invoke from './invoke';

const aggregateResults = (results: ValidationResult[]): ValidationResult => {
  const allowOrDeny = results.filter(r => r === ValidationResult.Allow || r === ValidationResult.Deny);
  if (allowOrDeny.length === 0) return ValidationResult.NotMatch;
  if (allowOrDeny.some(r => r === ValidationResult.Deny)) return ValidationResult.Deny;
  return ValidationResult.Allow;
};

export const validateStatement = (statement: Statement,
                                  action: Method,
                                  path: string,
                                  ctx: VariableContext = {}): ValidationResult => {
  const { resources = [], effect } = statement;
  const isMatch = resources
    .some(({ pattern, actions, conditions }) =>
      match(path, pattern)
      && actions.indexOf(action) !== -1
      && (conditions.length === 0 || conditions.some(condition => invoke(condition, ctx))));

  if (!isMatch) return ValidationResult.NotMatch;
  return effect === Effect.Allow  ? ValidationResult.Allow : ValidationResult.Deny;
};

export const validatePolicy = (policy: Policy,
                               action: Method,
                               path: string,
                               when: When,
                               ctx: VariableContext): ValidationResult => {
  const { statements = [] } = policy;
  const knownStatements = statements
    .filter(({ resources }) => resources
      .some(({ pattern, actions }) => match(path, pattern) && actions.indexOf(action) !== -1));
  if (knownStatements.length === 0) return ValidationResult.NotMatch;
  const matched = knownStatements.filter(s => s.when === when);
  if (matched.length === 0) return ValidationResult.Allow;
  const results = matched.map(s => validateStatement(s, action, path, ctx));
  return aggregateResults(results);
};

export const validateRole = (role: Role,
                             action: Method,
                             path: string,
                             when: When,
                             ctx: VariableContext): ValidationResult => {
  const { policies = [] } = role;
  const results = policies.map(p => validatePolicy(p, action, path, when, ctx));
  return aggregateResults(results);
};
