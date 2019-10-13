import fetch from 'node-fetch';
import transform from './transformer';
import { HttpProxyError } from 'gatekeeper-gateway';

export default async (username: string, password: string) => {
  const endpoint = `http://www.thethirdqc.com/default/data/user/session/${username}/${password}`;
  const session = await fetch(endpoint).then(res => res.json());
  const client = transform(session);
  if (!client) {
    throw new HttpProxyError(400, 'Incorrect Credentials');
  }
  return { ...client, roles: ['StandardUser'] };
};
