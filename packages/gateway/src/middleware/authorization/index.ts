import { Router } from 'express';
import createProxy from './proxy';
import createRoute from './route';
import shortId from 'shortid';
import { configureStorage } from './repository/factory';

export default {
  init: (gatewayRouter: Router, adminRouter: Router, config: any = {}) => {
    const rootClient = {
      clientId: shortId.generate(),
      clientSecret: shortId.generate(),
      roles: ['Root', 'Admin'],
    };
    console.info('Random Root Access', rootClient.clientId, '/', rootClient.clientSecret);
    configureStorage(config);
    createRoute(adminRouter, { ...config, rootClient });
    return createProxy();
  },
};
