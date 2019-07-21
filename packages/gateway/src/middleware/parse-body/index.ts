import { Router } from 'express';
import proxy from './proxy';

export default {
  proxy,
  init: (gatewayRouter: Router, adminRouter: Router) => {},
};
