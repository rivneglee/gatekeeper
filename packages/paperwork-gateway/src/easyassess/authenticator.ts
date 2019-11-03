import fetch from 'node-fetch';
import transform from './transformer';
import { HttpProxyError } from 'gatekeeper-gateway';

export default async (username: string, password: string) => {
  // const endpoint = `http://www.thethirdqc.com/default/data/user/session/${username}/${password}`;
  // const session = await fetch(endpoint).then(res => res.json());
  // const client = transform(session);
  let client = null;
  if (username === 'monkey' && password === '!Kidding') {
    client = {
      uid: 1339,
      supervisorUid: -1,
      roles: [
        'StandardUser',
      ],
    };
  } else if (username === 'guest') {
    client = {
      uid: 0,
      supervisorUid: -1,
      roles: [
        'StandardUser',
      ],
    };
  }

  if (!client) {
    throw new HttpProxyError(400, 'Incorrect Credentials');
  }
  return { ...client, roles: ['StandardUser'] };
};
