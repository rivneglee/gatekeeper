export interface Variable {
  path: string;
  in: VariableSource;
}

export enum VariableSource {
 Path = 'pathVariables',
 JwtToken = 'jwtToken',
 Response = 'response',
 Request = 'request',
 Tags = 'tags',
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

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
}

export interface Resource {
  uri: string;
  actions: Method[];
  conditions: FnInvocation[];
}

export interface Statement {
  effect: Effect;
  resources: Resource[];
}

export interface Policy {
  version: string;
  statements: Statement[];
}
