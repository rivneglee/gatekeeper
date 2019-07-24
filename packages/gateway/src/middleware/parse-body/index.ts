import { Router } from 'express';
import createProxy from './proxy';

export default {
  init: (gatewayRouter: Router, adminRouter: Router) => createProxy(),
};
