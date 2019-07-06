export interface Variable {
  path: string;
  in: VariableSource;
}

export enum VariableSource {
 Path = 'pathVariables',
 JwtToken = 'jwtToken',
 Payload = 'payload',
 Tags = 'tags',
 QueryParams = 'queryParams',
}

export interface VariableContext {
  jwtToken?: any;
  response?: any;
  request?: any;
  pathVariables?: any;
  tags?: any;
}

export type FnArg = Variable | number | boolean | string | undefined | null;

export interface FnInvocation {
  [key: string]: Array<FnArg | FnInvocation>;
}

export enum Effect {
  Allow = 'allow', Deny = 'deny',
}

export enum When {
  OnReceive = 'onReceive', OnReturn = 'onReturn',
}

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
}

export interface Condition extends FnInvocation {}

export interface Resource {
  pattern: string;
  actions: Method[];
  conditions: Condition[];
}

export interface Statement {
  effect: Effect;
  when: When;
  resources: Resource[];
}

export enum ValidationResult  {
  Allow, Deny, NotMatch,
}

export interface Policy {
  version: string;
  statements: Statement[];
}
