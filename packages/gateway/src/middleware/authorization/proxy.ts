import { Request, Response } from 'express';
import { validateRole, VariableContext, When, Method } from '../../../../core/build/src';
import { GatewayEndpoint } from '../../types';
import HttpProxyError from '../../exception/http-proxy-error';

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
                { path: 'username', in: 'jwtToken' },
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
                { path: 'username', in: 'jwtToken' },
                { path: 'author', in: 'payload' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const adminPolicy = {
  version: '1.0.0',
  name: 'AdminAccess',
  statements: [
    {
      effect: 'allow',
      when: 'onReceive',
      resources: [
        {
          pattern: '/admin/*',
          actions: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
          conditions: [
            {
              'fn::equal': [
                { path: 'isAdmin', in: 'jwtToken' },
                true,
              ],
            },
          ],
        },
      ],
    },
  ],
};

const getPoliciesByRoleName = (roleName: string): any[] => [adminPolicy, policy];

const checkAuthorization = (role: string,
                            request: Request,
                            when: When,
                            context: VariableContext) => {
  return validateRole({
    name: role,
    policies: getPoliciesByRoleName(role),
  }, request.method as Method, request.path, when, context);
};

export default () => {
  return  {
    onRequest: (request: Request, payload: any, endpoint: GatewayEndpoint) => {
      const { proxy } = endpoint;
      const { additionalProps = {} } = proxy;
      if (additionalProps.authorization) {
        const { jwtToken = {} } = request as any;
        const context: VariableContext = {
          jwtToken,
          request,
          payload,
        };
        (request as any).variableContext = context;
        const authorized = checkAuthorization(jwtToken.role, request, When.OnReceive, context);
        if (!authorized) throw new HttpProxyError(403, 'Permission Denied');
      }
      return payload;
    },
    onResponse: (request: Request,
                 response: Response,
                 payload: any,
                 endpoint: GatewayEndpoint) => {
      const { proxy } = endpoint;
      const { additionalProps = {} } = proxy;
      if (additionalProps.authorization) {
        const variableContext =  (request as any).variableContext;
        const { jwtToken } = variableContext;
        variableContext.payload = payload;
        variableContext.response = response;
        const authorized = checkAuthorization(jwtToken, request, When.OnReturn, variableContext);
        if (!authorized) throw new HttpProxyError(403, 'Permission Denied');
      }
      return payload;
    },
  };
}
