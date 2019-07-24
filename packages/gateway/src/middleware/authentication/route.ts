import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response, Router } from 'express';

const generateToken = (username: string, password: string, privateKey: string = 'foo_key') => {
  let isAdmin = false;
  if (username === 'admin' && password === 'admin') {
    isAdmin = true;
  }
  return jwt.sign({
    username,
    isAdmin,
  }, privateKey, { expiresIn: 600 });
};

export default (router: Router) => {
  router.post('/auth/token', (request: Request, response: Response, next: NextFunction) => {
    const { body } = request;
    const { username, password } = body;
    const accessToken = generateToken(username, password);
    response.json({
      accessToken,
    });
  });
  router.get('/users', (request: Request, response: Response, next: NextFunction) => {

  });
  router.get('/users/:id', (request: Request, response: Response, next: NextFunction) => {

  });
  router.put('/users/:id', (request: Request, response: Response, next: NextFunction) => {

  });
  router.delete('/users/:id', (request: Request, response: Response, next: NextFunction) => {

  });
  router.post('/roles', (request: Request, response: Response, next: NextFunction) => {

  });
  router.put('/roles/:id', (request: Request, response: Response, next: NextFunction) => {

  });
  router.get('/roles/:id', (request: Request, response: Response, next: NextFunction) => {

  });
  router.delete('/roles/:id', (request: Request, response: Response, next: NextFunction) => {

  });
};
