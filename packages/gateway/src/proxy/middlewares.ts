import { Middleware, MiddlewareConfig } from '../types';

const buildInMiddlewares: any = {
  'body-parser': '../middleware/parse-body',
  authentication: '../middleware/authentication',
  authorization: '../middleware/authorization',
};

export const loadMiddlewares = (middlewares: {[key: string]: MiddlewareConfig}): Middleware[] => {
  return Object.keys(middlewares).map((name) => {
    const middleware = buildInMiddlewares[name] ? require(buildInMiddlewares[name]) : require(name);
    return middleware.default ? middleware.default : middleware;
  });
};
