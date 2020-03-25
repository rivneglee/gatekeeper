import proxy from 'express-http-proxy';
import parse from 'url-parse';

import { Request } from 'express';
import { Endpoint, Proxy } from '../types';
import match from '../utils/route-match';
import sort from './sort-endpoints';
import resolve from './resolve-path';
import HttpProxyError from './http-proxy-error';

const findEndpoint = (request: Request, endpoints: Endpoint[]) => {
  const { path } = request;
  const endpoint = endpoints.find(({ resource }) => match(path, resource.pattern));
  if (!endpoint) {
    throw new HttpProxyError(404, `Proxy endpoint for ${path} was not found`);
  }
  return endpoint;
};

export default (proxyOptions: Proxy) => {

  const endpoints: Endpoint[] = sort(proxyOptions.endpoints);

  return proxy((request: Request) => {
    const endpoint = findEndpoint(request, endpoints);
    const { target } = endpoint;
    const { origin } = parse(target);
    return origin;
  }, {
    proxyReqPathResolver: (request: Request) => {
      const endpoint = findEndpoint(request, endpoints);
      return resolve(request, endpoint);
    },
    proxyErrorHandler: (err, response, next) => {
      if (err instanceof HttpProxyError) {
        response.header('content-type', 'application/json');
        response.status(err.statusCode).send(JSON.stringify({ message: err.message }));
      } else {
        next(err);
      }
    },
  });
};
