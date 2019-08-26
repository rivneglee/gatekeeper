import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { Method, Policy, Role, validateRole, VariableContext, When } from 'gatekeeper-core';
import { createRepository } from './repository/factory';

const DEFAULT_PRIVATE_KEY = 'foo_key';

export const generateToken = (client: any, privateKey: string = DEFAULT_PRIVATE_KEY) => {
  return jwt.sign(client, privateKey, { expiresIn: 6000 });
};

export const verifyToken = (accessToken: string, privateKey: string = DEFAULT_PRIVATE_KEY) => jwt.verify(accessToken, privateKey);

export const authenticate = (request: Request) => {
  const accessToken = request.get('Authorization');
  if (!accessToken) return false;
  try {
    const decodedToken = verifyToken(accessToken);
    (request as any).jwtToken = decodedToken;
  } catch {
    return false;
  }
  return true;
};

const getPolicies = async (roleNames: string[]) => {
  const roleRepository = await createRepository('roles', 'name');
  const policyRepository = await createRepository('policies', 'name');
  const roles: any = await Promise.all(roleNames.map((roleName: string) => roleRepository.get(roleName)));
  const policyNames = roles.flatMap((role: Role) => role.policies);
  const policies: Policy[] = await Promise.all(policyNames.map((policyName: string) => policyRepository.get(policyName)));
  return policies;
};

export const authorize = async (request: Request,
                          when: When,
                          payload: any) => {
  const { jwtToken = {} } = request as any;
  const { roles = [] } = jwtToken;
  if (!roles) return false;
  const context: VariableContext = {
    jwtToken,
    request,
    payload,
  };

  (request as any).variableContext = context;
  const policies = await getPolicies(roles);
  return roles.some((role: string) =>
    validateRole({
      policies,
      name: role,
    }, request.method as Method, request.path, when, context) === true,
  );
};
