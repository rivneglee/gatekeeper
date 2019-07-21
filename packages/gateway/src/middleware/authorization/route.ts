import { NextFunction, Request, Response, Router } from 'express';

export default (router: Router) => {
  router.get('/policies', (request: Request, response: Response, next: NextFunction) => {
    response.json({
      a: 'b',
    });
  });
};
