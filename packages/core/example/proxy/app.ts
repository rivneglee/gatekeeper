import express from 'express';

import createProxyMiddleware from '../../src/proxy';
import yamljs from 'yamljs';

const proxyOptions = yamljs.load(`${__dirname}/proxy.yml`);

const proxy = express();

const app = express();

app.get('/private/api/:userId/quotes/:quoteId', (request, response) => {
  response.json({
    url: 'http://localhost:9001/private/api/:userId/quotes/:quoteId',
    method: 'GET',
    params: request.params,
    query: request.query,
  });
});

app.get('/api/:userId/orders/:orderId', (request, response) => {
  response.json({
    url: 'http://localhost:9001/api/:userId/orders/:orderId',
    method: 'GET',
    params: request.params,
    query: request.query,
  });
});

const proxyMiddleware = createProxyMiddleware(proxyOptions);

proxy.use(proxyMiddleware);

proxy.listen(9000, () => {
  app.listen(9001, () => {
    console.log('proxy is running at 9000 and app is running at 9001');
  });
});
