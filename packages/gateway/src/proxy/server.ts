import express from 'express';
import bodyParser from 'body-parser';
import proxy from 'express-http-proxy';
import cors from 'cors';
import { createRoutes } from './routes';
import { GatewayConfiguration } from '../types';
import { initMiddlewares } from './middlewares';

export const startServer = (config: GatewayConfiguration) => {
  const gatewayPort = config.gateway.port;
  const gateway = express();

  const adminPort = config.admin.port;
  const admin = express();
  admin.use(bodyParser.json());
  const middlewares = initMiddlewares(gateway, admin, config.middlewares);
  gateway.use(cors());

  createRoutes(config, middlewares)
    .forEach(({ paths, target, proxyOptions }) =>
      gateway.all(paths, proxy(target, proxyOptions)));

  admin.listen(adminPort, () => {
    console.log(`Admin Dashboard is running at ${adminPort}`);
    gateway.listen(gatewayPort, () => console.log(`Gateway is running at ${gatewayPort}`));
  });
};
