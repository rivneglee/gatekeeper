import validate from './validate';
import { CustomResponse, Effect, EffectType, When } from '../types';

const EFFECT_RESOLVERS = {
  [EffectType.Custom]: (request: any, response: any, next: any, effect: Effect) => {
    const data = effect.data as CustomResponse;
    const { statusCode, body } = data;
    response
      .status(statusCode)
      .send(body)
      .end();
  },
  [EffectType.Deny]: (request: any, response: any) => {
    response
      .status(401)
      .json({
        message: 'Permission denied',
      })
      .end();
  },
  [EffectType.Unauthorized]: (request: any, response: any) => {
    response
      .status(403)
      .json(
      {
        message: 'Unauthorized',
      })
      .end();
  },
  [EffectType.Error]: (request: any, response: any) => {
    response
      .status(500)
      .json(
      {
        message: 'Gatekeeper internal error',
      })
      .end();
  },
};

const setBodyForResponse = (response: any, data: any) => {
  if (!data) return;

  if (response.getHeader('content-type').includes('json')) {
    response.body = JSON.parse(data);
  } else {
    response.body = data;
  }
};

export default (getPolicies: any, getContext: any) => (request: any, response: any, next: any) => {
  const context = {
    ...getContext(request, response),
    $request: request,
    $response: response,
  };
  const policies = getPolicies(request, response);
  const { send: originalSend } = response;
  const ingressEffect = validate(request.path, request.method, When.Ingress, context, policies);

  // @ts-ignore
  const ingressEffectResolver = EFFECT_RESOLVERS[ingressEffect.type];

  if (ingressEffectResolver) {
    ingressEffectResolver(request, response, next, ingressEffect);
  } else {
    response.send = (...args: any) => {
      response.send = originalSend;
      setBodyForResponse(response, args[0]);
      const egressEffect = validate(request.path, request.method, When.Egress, context, policies);

      // @ts-ignore
      const egressEffectResolver = EFFECT_RESOLVERS[egressEffect.type];
      if (egressEffectResolver) {
        egressEffectResolver(request, response, next, egressEffect);
      } else {
        response.send.apply(response, args);
      }
    };

    next();
  }
};
