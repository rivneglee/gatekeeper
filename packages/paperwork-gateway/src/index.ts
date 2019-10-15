import {
  startServer,
  createBodyParserMiddleware,
  createAuthMiddleware,
  GatewayConfiguration,
} from 'gatekeeper-gateway';
import logon from './easyassess/authenticator';

const roles: any[] = require('./data/role.json') as any[];
const policies: any[] = require('./data/policy.json') as any[];

const authConfig = {
  onInit: (adminRouter: any) => {
    adminRouter.get('/roles', (req: any, res: any) => res.json(roles));
    adminRouter.get('/policies', (req: any, res: any) => res.json(policies));
  },
  authorization: {
    onFetchingPolicies: (roleNames: string[]) => {
      const userRoles: any = roleNames.map(roleName => roles.find(({ name }) => name === roleName));
      const policyNames: string[] = userRoles.flatMap((role: any) => role.policies);
      return policyNames.map(policyName => policies.find(({ name }) => name === policyName));
    },
  },
  authentication: {
    onVerifyCredential: async (payload: any) => {
      const { username, password } = payload;
      const client = await logon(username, password);
      return client;
    },
    privateKey: 'foo_key',
    authUrl: '/auth/token',
    expiresIn: 60000,
  },
};

const bodyParser = createBodyParserMiddleware();
const auth = createAuthMiddleware(authConfig);

const config: GatewayConfiguration = {
  admin: { protocol: 'http', port: 5000 },
  gateway: { protocol: 'http', port: 80 },
  middlewares: [
    bodyParser,
    auth,
  ],
  endpoints: {
    login: {
      paths: ['/auth/token'],
      proxy: {
        forward: {
          url: 'http://localhost:5000',
          stripPath: false,
        },
      },
    },
    admin: {
      paths: ['/admin/*'],
      proxy: {
        forward: { url: 'http://localhost:5000', stripPath: true },
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
