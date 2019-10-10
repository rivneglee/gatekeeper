import pathToRegexp from 'path-to-regexp';

export default (uri: string, pattern: string) => {
  const regEx = pathToRegexp(pattern.replace(/\*/g, '([^/]+)'));
  return new RegExp(pattern).test(uri) || new RegExp(regEx).test(uri);
};
