import parse from 'url-parse';

import { Endpoint } from '../types';
import { Request } from 'express';

export default (request: Request, endpoint: Endpoint) => {
  const { target, forward = {}, resource } = endpoint;
  const { prependPath, ignorePath, stripPath } = forward;
  const { path } = request;

  const { pathname: forwardPath } = parse(target);

  if (prependPath && !ignorePath && !stripPath) {
    return `${forwardPath}${path}`;
  }

  if (prependPath && ignorePath) {
    return forwardPath;
  }

  if (ignorePath) {
    return '/';
  }

  if (stripPath) {
    const matches = path.match(resource.pattern);
    if (matches) {
      const strippedPath = path.replace(matches[0], '/');
      return `${forwardPath}${strippedPath}`;
    }
  }

  return path;
};
