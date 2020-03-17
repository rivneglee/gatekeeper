import express, { Request, Response } from 'express';
import yamljs from 'yamljs';

import createGatekeeperMiddleware from '../../src/authorization';

const app = express();
const policy = yamljs.load(`${__dirname}/policy.yml`);

const gateKeeper = createGatekeeperMiddleware(
  () => [policy],
  () => ({ token: { userId: 'foo' } }),
);

app.use(gateKeeper);

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

app.listen(9000, () => console.log('Example app is running at 9000'));
