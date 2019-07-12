import deepEqual from 'deep-equal';

export default (a: any, b: any) => {
  if (typeof a !== typeof b) return false;
  if (typeof a === 'object') {
    return deepEqual(a, b);
  }
  return a === b;
};
