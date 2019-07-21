import { ProxyOptions } from 'express-http-proxy';
import { Request, Response, Router } from 'express';

export interface GatewayConfiguration {
  gateway: ServerConfig;
  admin: ServerConfig;
  servicesEndpoints: {[key: string]: ServiceEndpoint};
  gatewayEndpoints: {[key: string]: GatewayEndpoint};
}

export interface ServerConfig {
  protocol: 'http' | 'https';
  port: number;
}

export interface ServiceEndpoint {
  url: string;
}

export interface Authentication {
  enabled: boolean;
}

export interface Authorization {
  enabled: boolean;
}

export interface ValidationOptions {
  authentication: Authentication;
  authorization: Authorization;
}

export interface ForwardOptions {
  serviceEndpoint: string;
  changeOrigin: boolean;
  ignorePath:   boolean;
  stripPath:    boolean;
}

export interface GatewayProxyOptions {
  validate: ValidationOptions;
  forward: ForwardOptions;
}

export interface GatewayEndpoint {
  paths: string[];
  proxy: GatewayProxyOptions;
}

export interface ProxyRouteConfig {
  paths: string[];
  proxyOptions: ProxyOptions;
  target: ServiceEndpoint;
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

export interface Middleware {
  init: (gatewayRouter: Router, adminRouter: Router) => void;
  proxy: MiddlewareProxyOption;
}
