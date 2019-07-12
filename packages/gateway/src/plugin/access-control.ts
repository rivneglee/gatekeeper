import { validateRole, VariableContext, When, Method } from 'gatekeeper-core';
import { Request, Response } from 'express';
import { GatewayEndpoint } from '../types';
import HTTPProxyError from '../exception/HTTPProxyError';

const policy = {
  version: '1.0.0',
  name: 'StandardAccess',
  statements: [
    {
      effect: 'allow',
      when: 'onReceive',
      resources: [
        {
          pattern: '/paper-service/papers',
          actions: ['POST'],
          conditions: [
            {
              'fn::equal': [
                { path: 'userId', in: 'jwtToken' },
                { path: 'author', in: 'payload' },
              ],
            },
          ],
        },
      ],
    },
    {
      effect: 'allow',
      when: 'onReturn',
      resources: [
        {
          pattern: '/paper-service/papers',
          actions: ['GET'],
          conditions: [
            {
              'fn::equal': [
                { path: 'userId', in: 'jwtToken' },
                { path: 'author', in: 'payload' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const getPoliciesByRoleName = (roleName: string): any[] => [policy];

const parseToken = (request: Request) => {
  const auth = request.get('Authorization');
  return auth ? {
    userId: 'foo',
    role: 'StandardUser',
  } : '';
};

const checkAuthorization = (role: string,
                            request: Request,
                            when: When,
                            context: VariableContext) => {
  return validateRole({
    name: role,
    policies: getPoliciesByRoleName(role),
  }, request.method as Method, request.path, when, context);
};

export default {
  onRequest: (request: Request, payload: any, endpoint: GatewayEndpoint) => {
    const jwtToken: any = parseToken(request);
    const context: VariableContext = {
      jwtToken,
      request,
      payload,
    };
    (request as any).variableContext = context;
    const authorized = checkAuthorization(jwtToken.role, request, When.OnReceive, context);
    if (!authorized) throw new HTTPProxyError(403, 'Permission Denied');
    return payload;
  },
  onResponse: (request: Request,
               response: Response,
               payload: any,
               endpoint: GatewayEndpoint) => {
    const variableContext =  (request as any).variableContext;
    const { jwtToken } = variableContext;
    variableContext.payload = payload;
    variableContext.response = response;
    const authorized = checkAuthorization(jwtToken, request, When.OnReturn, variableContext);
    if (!authorized) throw new HTTPProxyError(403, 'Permission Denied');
    return payload;
  },
};
