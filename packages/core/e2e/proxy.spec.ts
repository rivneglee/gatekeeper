import request from 'supertest';
import express from 'express';

import createProxyMiddleware from '../src/proxy';
import Server, { StubServer } from './utils/StubServer';
import proxyConfig from './fixtures/proxy';
import { Proxy } from '../src/types';

describe('proxy', () => {
  const proxy = createProxyMiddleware(proxyConfig as Proxy);

  const proxyServer = express().use(proxy).listen(9002);

  const appServer: StubServer = new Server();

  afterAll(() => {
    proxyServer.close();
    appServer.close();
  });

  it('should forward to right upstream endpoint when no forward option set', (done) => {
    const expectedBody = {
      path: '/api/:userId/orders/:orderId',
    };
    appServer.stub('/api/:userId/orders/:orderId', 'get', expectedBody);
    request(proxyServer)
      .get('/api/123/orders/321')
      .expect(expectedBody)
      .expect(200, done);
  });

  it('should forward to right upstream endpoint when forward option set', (done) => {
    const expectedBody = {
      path: '/private/api/:userId/quotes/:orderId',
    };
    appServer.stub('/private/api/:userId/quotes/:orderId', 'get', expectedBody);
    request(proxyServer)
      .get('/api/123/quotes/321')
      .expect(expectedBody)
      .expect(200, done);
  });
});
