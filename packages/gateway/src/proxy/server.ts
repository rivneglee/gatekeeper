import express from 'express';
import proxy from 'express-http-proxy';
import cors from 'cors';
import { createRoutes } from './routes';
import authorize from '../plugin/access-control';
import parseBody from '../plugin/parse-body';
import { GatewayConfiguration } from '../types';

export const startServer = (config: GatewayConfiguration) => {
  const port = config.server.port;
  const gateway = express();

  gateway.use(cors());

  createRoutes(config, [parseBody, authorize])
    .forEach(({ paths, target, proxyOptions }) =>
      gateway.all(paths, proxy(target.url, proxyOptions)));

  gateway.listen(port, () => console.log(`Gateway is running at ${port}`));
};
