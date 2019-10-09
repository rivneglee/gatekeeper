import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import {
  Method,
  Policy,
  validateRole,
  VariableContext,
  When,
} from 'gatekeeper-core';

export const verifyToken = (accessToken: string, privateKey: string) => jwt.verify(accessToken, privateKey);

export const authenticate = (request: Request, config: any) => {
  const { privateKey } = config;
  const accessToken = request.get('Authorization');
  if (!accessToken) return false;
  try {
    const decodedToken = verifyToken(accessToken, privateKey);
    (request as any).jwtToken = decodedToken;
  } catch {
    return false;
  }
  return true;
};

export const authorize = async (request: Request,
                          when: When,
                          payload: any,
                          config: any)  => {
  const { onFetchingPolicies } = config;
  const { jwtToken = {} } = request as any;
  const { roles = [] } = jwtToken;
  if (!roles) return false;
  const context: VariableContext = {
    jwtToken,
    request,
    payload,
  };
  (request as any).variableContext = context;
  const policies: Policy[] = await onFetchingPolicies(roles);
  const { method, path } = request;
  return validateRole({ policies }, method as Method, path, when, context);
};
