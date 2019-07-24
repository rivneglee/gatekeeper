export interface Variable {
    path: string;
    in: VariableSource;
}
export declare enum VariableSource {
    JwtToken = "jwtToken",
    Tags = "tags",
    Request = "request",
    Response = "response",
    Payload = "payload"
}
export interface VariableContext {
    jwtToken?: any;
    request?: any;
    response?: any;
    tags?: any;
    payload?: any;
}
export declare type FnArg = Variable | number | boolean | string | undefined | null;
export interface FnInvocation {
    [key: string]: Array<FnArg | FnInvocation>;
}
export declare enum Effect {
    Allow = "allow",
    Deny = "deny"
}
export declare enum When {
    OnReceive = "onReceive",
    OnReturn = "onReturn"
}
export declare enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    OPTIONS = "OPTIONS"
}
export interface Condition extends FnInvocation {
}
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
export declare enum ValidationResult {
    Allow = 0,
    Deny = 1,
    NotMatch = 2
}
export interface Policy {
    version: string;
    name: string;
    statements: Statement[];
}
export interface Role {
    name: string;
    policies: Policy[];
}
