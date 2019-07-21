import { NextFunction, Request, Response } from 'express';
import {
  GatewayConfiguration,
  GatewayEndpoint,
  MiddlewareProxyOption,
  ProxyRouteConfig,
} from '../types';
import { ProxyOptions } from 'express-http-proxy';
import HttpProxyError from '../exception/http-proxy-error';

const resolvePath = (request: Request,
                     gatewayEndpoint: GatewayEndpoint) => {
  const { path } = request;
  const { proxy } = gatewayEndpoint;
  if (proxy.forward.stripPath) {
    const matchedPattern = gatewayEndpoint.paths.find(p => !!path.match(p));
    if (matchedPattern) {
      const prefix = path.match(matchedPattern) || [];
      const strippedPath = path.replace(prefix[0], '/');
      return `${strippedPath}${(request as any)._parsedUrl.search || ''}`;
    }
  }
  if (proxy.forward.ignorePath) {
    return '';
  }
  return path;
};

export const createRoutes = (config: GatewayConfiguration,
                             middlewares: MiddlewareProxyOption[] = []): ProxyRouteConfig[] => {
  const { gatewayEndpoints, servicesEndpoints } = config;
  return Object.entries(gatewayEndpoints).map(([_, endpoint]) => {
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
      target: servicesEndpoints[forward.serviceEndpoint],
    };
  });
};
