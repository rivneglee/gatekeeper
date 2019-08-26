import { ProxyOptions } from 'express-http-proxy';
import { Request, Response, Router } from 'express';

export interface GatewayConfiguration {
  gateway: ServerConfig;
  admin: ServerConfig;
  middlewares: {[key: string]: any};
  endpoints: {[key: string]: GatewayEndpoint};
}

export interface ServerConfig {
  protocol: 'http' | 'https';
  port: number;
}

export interface ForwardOptions {
  url: string;
  changeOrigin: boolean;
  ignorePath:   boolean;
  stripPath:    boolean;
}

export interface GatewayProxyOptions {
  additionalProps: {[key: string]: any};
  forward: ForwardOptions;
}

export interface GatewayEndpoint {
  paths: string[];
  proxy: GatewayProxyOptions;
}

export interface ProxyRouteConfig {
  paths: string[];
  proxyOptions: ProxyOptions;
  target: string;
}

export interface MiddlewareProxyOption {
  onRequest: (request: Request, payload: any, endpoint: GatewayEndpoint) => any;
  onResponse: (
    request: Request,
    response: Response,
    payload: any,
    endpoint: GatewayEndpoint,
  ) => any;
}

export interface MiddlewareConfig {
  name: string;
  settings: { [key: string]: any };
}

export interface Middleware {
  init: (gatewayRouter: Router, adminRouter: Router, settings: object) => MiddlewareProxyOption;
}
