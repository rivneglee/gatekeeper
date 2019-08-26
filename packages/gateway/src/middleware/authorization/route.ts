import { Request, Response, Router } from 'express';
import { createRepository } from './repository/factory';
import { generateToken } from './auth';
import HttpProxyError from '../../exception/http-proxy-error';

const createClientRoutes = async (router: Router, config: any) => {
  const clientRepository = await createRepository('clients', 'clientId');
  router.post('/auth/token', (request: Request, response: Response) => {
    const { body } = request;
    const { clientId, clientSecret } = body;
    if (clientId === config.rootClient.clientId && clientSecret === config.rootClient.clientSecret) {
      const accessToken = generateToken(config.rootClient);
      response.json({
        accessToken,
      });
    } else {
      clientRepository.get(clientId).then((client: any) => {
        if (client === null || client.clientSecret !== clientSecret) {
          response.status(400).json({ message: 'Incorrect Credentials' });
          return;
        }
        const accessToken = generateToken(client);
        response.json({
          accessToken,
        });
      }).catch((e: HttpProxyError) => response.status(e.statusCode).json({ message: e.message }));
    }
  });
  return createCommonRoutes(router, config, 'clients', 'clientId');
};

const createCommonRoutes = async (router: Router, config: any, resource: string, keyField: string) => {
  const repository = await createRepository(resource, keyField);
  router.get(`/${resource}`, (request: Request, response: Response) => {
    repository.list()
      .then(result => response.json(result))
      .catch((e: HttpProxyError) => response.status(e.statusCode).json({ message: e.message }));
  });
  router.post(`/${resource}`, (request: Request, response: Response) => {
    repository.create(request.body)
      .then(() => response.status(201).end())
      .catch((e: HttpProxyError) => response.status(e.statusCode).json({ message: e.message }));
  });
  router.get(`/${resource}/:${keyField}`, (request: Request, response: Response) => {
    repository.get(request.params[keyField])
      .then(result => response.json(result))
      .catch((e: HttpProxyError) => response.status(e.statusCode).json({ message: e.message }));
  });
  router.put(`/${resource}/:${keyField}`, (request: Request, response: Response) => {
    const policy = { ...request.body, name: request.params[keyField] };
    repository.update(policy)
      .then(() => response.status(200).end())
      .catch((e: HttpProxyError) => response.status(e.statusCode).json({ message: e.message }));
  });
  router.delete(`/${resource}/:${keyField}`, (request: Request, response: Response) => {
    repository.delete(request.params[keyField])
      .then(() => response.status(200).end())
      .catch((e: HttpProxyError) => response.status(e.statusCode).json({ message: e.message }));
  });
};

export default async (router: Router, config: any) => {
  createClientRoutes(router, config);
  createCommonRoutes(router, config, 'roles', 'name');
  createCommonRoutes(router, config, 'policies', 'name');
};
