import objectPath from 'object-path';
import { VariableContext, FnInvocation, Variable } from '../types';
import { FN_PREFIX, functions } from '../fn';

const getFnName = (invocation: FnInvocation) => Object.keys(invocation)[0];

const isFnInvocation = (arg: FnInvocation) => (getFnName(arg) || '').startsWith(FN_PREFIX);

const isVariable = (variable: Variable) => variable['path'] && variable['in'];

const invoke = (fnInvocation: FnInvocation, ctx: VariableContext, fnMap: any = functions) => {
  const fnName = getFnName(fnInvocation);
  const fn = fnMap[fnName];
  if (!fn) throw new Error(`Invalid fn invocation - ${JSON.stringify(fnInvocation)}`);
  const fnArgs: any[] = fnInvocation[fnName];
  const args: any[] = fnArgs.map((arg: any) => {
    if (typeof arg !== 'object') return arg;
    if (isFnInvocation(arg)) {
      return invoke(arg, ctx, fnMap);
    }
    if (isVariable(arg)) {
      return String(objectPath.get(ctx, `${arg.in}.${arg.path}`));
    }
    return arg;
  });
  return fn(...args);
};

export default invoke;
