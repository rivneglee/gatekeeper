import { Request } from 'express';
import { GatewayEndpoint } from '../types';

const replacePathVariables = (pattern: string) => pattern.replace(/:[^\/]+/g, '*');

export const resolvePath = (request: Request,
                     gatewayEndpoint: GatewayEndpoint) => {
  const { path } = request;
  const { proxy } = gatewayEndpoint;
  if (proxy.forward.stripPath) {
    const matchedPattern = gatewayEndpoint.paths.find(p => !!path.match(replacePathVariables(p)));
    if (matchedPattern) {
      const prefix = path.match(replacePathVariables(matchedPattern)) || [];
      const strippedPath = path.replace(prefix[0], '/');
      return `${strippedPath}${(request as any)._parsedUrl.search || ''}`;
    }
  }
  if (proxy.forward.ignorePath) {
    return '';
  }
  return path;
};
