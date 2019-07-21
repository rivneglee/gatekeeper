import express from 'express';
import proxy from 'express-http-proxy';
import cors from 'cors';
import { createRoutes } from './routes';
import authorize from '../middleware/authorization';
import parseBody from '../middleware/parse-body';
import { GatewayConfiguration } from '../types';

export const startServer = (config: GatewayConfiguration) => {
  const gatewayPort = config.gateway.port;
  const gateway = express();

  const adminPort = config.admin.port;
  const admin = express();

  [authorize, parseBody].forEach(middleware => middleware.init(gateway, admin));

  gateway.use(cors());

  createRoutes(config, [parseBody.proxy, authorize.proxy])
    .forEach(({ paths, target, proxyOptions }) =>
      gateway.all(paths, proxy(target.url, proxyOptions)));

  admin.listen(adminPort, () => {
    console.log(`Admin Dashboard is running at ${adminPort}`);
    gateway.listen(gatewayPort, () => console.log(`Gateway is running at ${gatewayPort}`));
  });
};
