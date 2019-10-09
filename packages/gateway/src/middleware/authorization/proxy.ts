import { Request, Response } from 'express';
import { ValidationResult } from 'gatekeeper-core';
import { When } from '../../../../core/build/src';
import { GatewayEndpoint } from '../../types';
import HttpProxyError from '../../exception/http-proxy-error';
import { authenticate, authorize } from './auth';

export default (config: any = {}) => ({
  onRequest: (request: Request, payload: any, endpoint: GatewayEndpoint) => {
    const { proxy } = endpoint;
    const { authentication, authorization } = config;
    const { additionalProps = {} } = proxy;
    if (additionalProps.authentication && !authenticate(request, authentication)) {
      throw new HttpProxyError(401, 'Unauthorized');
    }
    if (additionalProps.authorization) {
      return authorize(request, When.OnReceive, payload, authorization)
        .then((result) => {
          if (result === ValidationResult.Allow) {
            return Promise.resolve(payload);
          }
          return Promise.reject(new HttpProxyError(403, 'Permission Denied'));
        })
        .catch(() => Promise.reject(new HttpProxyError(403, 'Permission Denied')),
      );
    }
    return Promise.resolve(payload);
  },
  onResponse: (request: Request,
               response: Response,
               payload: any,
               endpoint: GatewayEndpoint) => {
    const { proxy } = endpoint;
    const { additionalProps = {} } = proxy;
    const { authorization } = config;
    if (additionalProps.authorization) {
      return authorize(request, When.OnReturn, payload, authorization)
        .then((result) => {
          if (result === ValidationResult.Allow) {
            return Promise.resolve(payload);
          }
          return Promise.reject(new HttpProxyError(403, 'Permission Denied'));
        })
        .catch(() => Promise.reject(new HttpProxyError(403, 'Permission Denied')),
      );
    }
    return Promise.resolve(payload);
  },
});
