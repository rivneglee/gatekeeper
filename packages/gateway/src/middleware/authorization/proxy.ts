import { Request, Response } from 'express';
import { When } from '../../../../core/build/src';
import { GatewayEndpoint } from '../../types';
import HttpProxyError from '../../exception/http-proxy-error';
import { authenticate, authorize } from './auth';

export default () => ({
  onRequest: (request: Request, payload: any, endpoint: GatewayEndpoint) => {
    const { proxy } = endpoint;
    const { additionalProps = {} } = proxy;
    if (additionalProps.authentication && !authenticate(request)) {
      throw new HttpProxyError(401, 'Unauthorized');
    }
    if (additionalProps.authorization) {
      return authorize(request, When.OnReceive, payload)
        .then(() => Promise.resolve(payload))
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
    if (additionalProps.authorization) {
      return authorize(request, When.OnReturn, payload)
        .then(() => Promise.resolve(payload))
        .catch(() => Promise.reject(new HttpProxyError(403, 'Permission Denied')),
      );
    }
    return Promise.resolve(payload);
  },
});
