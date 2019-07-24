import { NextFunction, Request, Response } from 'express';
import {
  GatewayConfiguration,
  MiddlewareProxyOption,
  ProxyRouteConfig,
} from '../types';
import { ProxyOptions } from 'express-http-proxy';
import HttpProxyError from '../exception/http-proxy-error';
import { resolvePath } from './resolve-path';

export const createRoutes = (config: GatewayConfiguration,
                             middlewares: MiddlewareProxyOption[] = []): ProxyRouteConfig[] => {
  const { endpoints } = config;
  return Object.entries(endpoints).map(([_, endpoint]) => {
    const { paths, proxy } = endpoint;
    const { forward } = proxy;
    const proxyOptions: ProxyOptions = {
      proxyReqPathResolver: (request: Request) => resolvePath(request, endpoint),
      proxyReqBodyDecorator: (bodyContent: any, srcReq: Request) => {
        return middlewares.reduce((acc, { onRequest }) =>
          onRequest(srcReq, acc, endpoint), bodyContent);
      },
      userResDecorator: (proxyRes: Response,
                         proxyResData: any,
                         userReq: Request,
                         userRes: Response) => {
        return middlewares.reduce((acc, { onResponse }) =>
          onResponse(userReq, userRes, acc, endpoint), proxyResData);
      },
      proxyErrorHandler: (err: any, res: Response, next: NextFunction) => {
        if (err instanceof HttpProxyError) {
          res.header('content-type', 'application/json');
          res.status(err.statusCode).send(JSON.stringify({ message: err.message }));
        } else {
          next(err);
        }
      },
    };

    return {
      paths,
      proxyOptions,
      target: forward.url,
    };
  });
};
