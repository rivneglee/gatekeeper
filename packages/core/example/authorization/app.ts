import express, { Request, Response } from 'express';
import yamljs from 'yamljs';

import createAuthorizationMiddleware from '../../src/authorization';

const app = express();
const policy = yamljs.load(`${__dirname}/policy.yml`);

const authorizer = createAuthorizationMiddleware(
  () => [policy],
  () => ({ token: { userId: 'foo' } }),
);

app.use(authorizer);

const orders: any = {
  123: { userId: 'others', amount: 123.00 },
  321: { userId: 'foo', amount: 100.00 },
};

const users: any[] = [
  { userId: 'foo', name: 'Normal user' },
  { userId: 'gateKeeper', name: 'Admin' },
];

app.get('/:userId/orders/:orderId', (request: Request, response: Response) => {
  response.json(orders[request.params.orderId]);
});

app.get('/admin/users', (request: Request, response: Response) => {
  response.json(users);
});

app.listen(9000, () => console.log('Gatekeeper example is running at 9000'));
