import { pathToRegexp } from 'path-to-regexp';

const replacePathVariables = (pattern: string) => pattern.replace(/:[^\/]+/g, '*');

export default (uri: string, pattern: string) => {
  const regEx = pathToRegexp(pattern.replace(/\*/g, '([^\.]+)'));
  return new RegExp(pattern).test(uri)
    || new RegExp(regEx).test(uri)
    || new RegExp(replacePathVariables(pattern)).test(uri);
};
