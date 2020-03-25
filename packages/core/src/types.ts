export interface CustomResponse {
  statusCode: number;
  body?: any;
}

export interface RedirectTo {
  to: string;
}

export enum EffectType {
  Allow = 'allow',
  Deny = 'deny',
  Unauthorized = 'unauthorized',
  Custom = 'custom',
  Redirect = 'redirect',
  Nothing = 'nothing',
  Error = 'error',
}

export interface Effect {
  type: EffectType;
  data?: CustomResponse | RedirectTo;
}

export enum When {
  Ingress = 'ingress', Egress = 'egress',
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
  pattern: string;
  methods: Method[] | '*';
}

export interface Rule {
  effect?: Effect;
  condition?: string;
}

export interface Statement {
  resource: Resource;
  ingress?: Rule[];
  egress?: Rule[];
}

export interface Policy {
  name: string;
  statements: Statement[];
}

export interface ForwardOptions {
  ignorePath?: boolean;
  stripPath?: boolean;
  prependPath?: boolean;
}

export interface Endpoint {
  resource: Resource;
  target: string;
  forward?: ForwardOptions;
}

export interface Proxy {
  endpoints: Endpoint[];
}
