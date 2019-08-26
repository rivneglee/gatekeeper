import { MiddlewareConfig, MiddlewareProxyOption } from '../types';
import { Router } from 'express';

const buildInMiddlewares: any = {
  'body-parser': '../middleware/parse-body',
  authentication: '../middleware/authentication',
  authorization: '../middleware/authorization',
};

export const initMiddlewares = (gatewayRouter: Router,
                                adminRouter: Router,
                                middlewares: {[key: string]: MiddlewareConfig}): MiddlewareProxyOption[] => {
  return Object.keys(middlewares).map((name) => {
    const middleware = buildInMiddlewares[name] ? require(buildInMiddlewares[name]) : require(name);
    const init = middleware.default ? middleware.default.init : middleware.init;
    return init(gatewayRouter, adminRouter, middlewares[name]);
  });
};
