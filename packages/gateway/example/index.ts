import { Request, Response, Router } from 'express';
import { Policy, Role } from 'gatekeeper-core';
import { startServer, createBodyParserMiddleware, createAuthMiddleware, GatewayConfiguration } from '../src';
import HttpProxyError from '../src/exception/http-proxy-error';

const users: any[] = require('./data/user.json');
const roles: Role[] = require('./data/role.json') as Role[];
const policies: Policy[] = require('./data/policy.json') as Policy[];

const bodyParser = createBodyParserMiddleware();
const auth = createAuthMiddleware({
  onInit: (adminRouter: Router) => {
    adminRouter.get('/roles', (req: Request, res: Response) => res.json(roles));
    adminRouter.get('/policies', (req: Request, res: Response) => res.json(policies));
    adminRouter.get('/users', (req: Request, res: Response) => res.json(users));
  },
  authorization: {
    onFetchingPolicies: (roleNames: string[]) => {
      const userRoles: any = roleNames.map(roleName => roles.find(({ name }) => name === roleName));
      const policyNames: string[] = userRoles.flatMap((role: Role) => role.policies);
      return policyNames.map(policyName => policies.find(({ name }) => name === policyName));
    },
  },
  authentication: {
    onVerifyCredential: async (payload: any) => {
      const { username, password } = payload;
      const user = users.find(user => user.username === username);
      if (!user || user.password !== password) {
        throw new HttpProxyError(400, 'Incorrect Credentials');
      }
      return user;
    },
    privateKey: 'foo_key',
    authUrl: '/auth/token',
    expiresIn: 60000,
  },
});

const config: GatewayConfiguration = {
  admin: { protocol: 'http', port: 8280 },
  gateway: { protocol: 'http', port: 8180 },
  middlewares: [
    bodyParser,
    auth,
  ],
  endpoints: {
    login: { paths: ['/auth/token'], proxy: { forward: { url: 'http://localhost:8280', stripPath: false } } },
    admin: {
      paths: ['/admin/*'],
      proxy: {
        forward: { url: 'http://localhost:8280', stripPath: true },
        additionalProps: { authorization: true, authentication: true },
      },
    },
    paperwork: {
      paths: ['/paper-service/*'],
      proxy: {
        forward: { url: 'http://localhost:5000', stripPath: true },
        additionalProps: { authorization: true, authentication: true },
      },
    },
  },
};

startServer(config);
