import { Request, Response, Router } from 'express';
import * as jwt from 'jsonwebtoken';

const generateToken = (client: any, privateKey: string, expiresIn: number = 6000) => {
  return jwt.sign(client, privateKey, { expiresIn });
};

export default (router: Router, config: any = {}) => {
  const { authentication } = config;
  const { onVerifyCredential, authUrl, privateKey, expiresIn } = authentication;
  router.post(authUrl, async (request: Request, response: Response) => {
    try {
      const { body } = request;
      const client = await onVerifyCredential(body);
      response.json({
        client,
        accessToken: generateToken(client, privateKey, expiresIn),
      });
    } catch (e) {
      const { statusCode = 500, message } = e;
      response.status(statusCode).json({ message });
    }
  });
};
