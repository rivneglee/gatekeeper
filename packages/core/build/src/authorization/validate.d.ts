import { Method, Policy, Role, Statement, ValidationResult, VariableContext, When } from '../types';
export declare const matchStatement: (statement: Statement, action: Method, path: string, ctx?: VariableContext) => boolean;
export declare const validatePolicy: (policy: Policy, action: Method, path: string, when: When, ctx: VariableContext) => ValidationResult;
export declare const validateRole: (role: Role, action: Method, path: string, when: When, ctx: VariableContext) => boolean;
