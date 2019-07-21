import { Request, Response } from 'express';
import { GatewayEndpoint } from '../../types';

const proxy = (bodyContent: any, contentType: string) => {
  try {
    if (contentType.includes('application/json')) {
      return JSON.parse((bodyContent as Buffer).toString('utf-8'));
    }
  } catch (e) {}
  return bodyContent;
};

export default {
  onRequest: (request: Request, payload: any, endpoint: GatewayEndpoint) => {
    return proxy(payload, request.get('content-type') || '');
  },
  onResponse: (request: Request,
               response: Response,
               payload: any,
               endpoint: GatewayEndpoint) => {
    return proxy(payload, response.get('content-type') || '');
  },
};
