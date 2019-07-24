import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { GatewayEndpoint } from '../../types';
import HttpProxyError from '../../exception/http-proxy-error';

const verify = (accessToken: string, privateKey: string = 'foo_key') => jwt.verify(accessToken, privateKey);

export interface Config {
  url: string;
  username?: string;
  password?: string;
}

export default (config: Config) => {
  return {
    onRequest: (request: Request, payload: any, endpoint: GatewayEndpoint) => {
      const { proxy } = endpoint;
      const { additionalProps = {} } = proxy;
      if (additionalProps.authentication) {
        const accessToken = request.get('Authorization');
        if (accessToken) {
          try {
            const decodedToken = verify(accessToken);
            (request as any).jwtToken = decodedToken;
          } catch {
            throw new HttpProxyError(401, 'Unauthorized');
          }
        } else {
          throw new HttpProxyError(401, 'Unauthorized');
        }
      }
      return payload;
    },
    onResponse: (request: Request,
                 response: Response,
                 payload: any,
                 endpoint: GatewayEndpoint) => {
      return payload;
    },
  };
};
