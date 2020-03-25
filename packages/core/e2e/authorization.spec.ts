import request from 'supertest';
import Server, { StubServer } from './utils/StubServer';
import policy from './fixtures/policy';
import createAuthorizationMiddleware from '../src/authorization';

describe('authorization', () => {
  const authorizer = createAuthorizationMiddleware(
    () => [policy],
    () => ({ token: { userId: 'foo' } }),
  );
  const server: StubServer = new Server(authorizer);

  afterAll(() => server.close());

  it('should return 200 if request is valid on policy', (done) => {
    server.stub('/:userId/orders/:orderId', 'get', { userId: 'foo', amount: 123.00 });
    request(server.getApp())
      .get('/foo/orders/123')
      .expect(200, done);
  });

  it('should return 401 if request is invalid for ingress rule', (done) => {
    server.stub('/:userId/orders/:orderId', 'get', { userId: 'foo', amount: 123.00 });
    request(server.getApp())
      .get('/123/orders/123')
      .expect(401, done);
  });

  it('should return 401 if request is invalid for egress rule', (done) => {
    server.stub('/:userId/orders/:orderId', 'get', { userId: '123', amount: 123.00 });
    request(server.getApp())
      .get('/foo/orders/123')
      .expect(401, done);
  });

  it('should return 401 when visit restrict path', (done) => {
    server.stub('/admin/users', 'get', []);
    request(server.getApp())
      .get('/admin/users')
      .expect(401, done);
  });

  it('should return 200 if visit unconfigured path', (done) => {
    server.stub('/test', 'get', {});
    request(server.getApp())
      .get('/test')
      .expect(200, done);
  });
});
