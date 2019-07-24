import { Router } from 'express';
import createProxy from './proxy';
import createRoute from './route';

export default {
  init: (gatewayRouter: Router, adminRouter: Router, config: any = {}) => {
    createRoute(adminRouter);
    return createProxy(config);
  },
};
