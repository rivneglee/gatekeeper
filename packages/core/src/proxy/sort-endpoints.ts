import { Endpoint } from '../types';
import match from '../utils/route-match';

export default (arr: Endpoint[]) => {
  const endpoints = [...arr];
  endpoints.sort((a, b) => {
    if (match(a.resource.pattern, b.resource.pattern)) {
      return -1;
    }
    if (match(b.resource.pattern, a.resource.pattern)) {
      return 1;
    }
    return 0;
  });

  return endpoints;
};
