import {
  Effect,
  Method,
  Resource,
  Statement,
  ValidationResult,
  VariableContext,
} from '../types';
import match from '../utilities/route-match';
import invoke from './invoke';

export default (statement: Statement,
                action: Method,
                path: string,
                ctx: VariableContext = {}): ValidationResult => {
  const resources: Resource[] = statement.resources || [];
  const matched = resources
    .filter(({ pattern, actions }) => match(path, pattern) && actions.indexOf(action) !== -1);
  const conditionMatched = matched.some(({ conditions }) =>
      conditions.some(condition => invoke(condition, ctx)));
  if (!conditionMatched) return ValidationResult.NotMatch;
  return statement.effect === Effect.Allow ? ValidationResult.Allow : ValidationResult.Deny;
};
