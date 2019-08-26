import and from './and';
import or from './or';
import equal from './equal';
import not from './not';
import contains from './contains';

export const FN_PREFIX = 'fn::';

export const functions = {
  [`${FN_PREFIX}and`]: and,
  [`${FN_PREFIX}or`]: or,
  [`${FN_PREFIX}equal`]: equal,
  [`${FN_PREFIX}not`]: not,
  [`${FN_PREFIX}contains`]: contains,
};
