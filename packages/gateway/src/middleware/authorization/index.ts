import { Router } from 'express';
import createProxy from './proxy';
import createRoutes from './route';

export default (config: any = {}) => ({
  init: (gatewayRouter: Router, adminRouter: Router) => {
    const { onInit, ...otherConfig } = config;
    createRoutes(adminRouter, config);
    onInit(adminRouter, otherConfig);
    return createProxy(otherConfig);
  },
});
