import { Router } from 'express';
import proxy from './proxy';
import route from './route';

export default {
  proxy,
  init: (gatewayRouter: Router, adminRouter: Router) => route(adminRouter),
};
