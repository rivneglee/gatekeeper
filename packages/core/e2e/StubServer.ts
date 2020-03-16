import express, { Request, Response, NextFunction, Express } from 'express';
import { Server } from 'http';

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export interface StubServer {
  stub: (path: string, method: string, responseBody: object) => void;
  unset: () => void;
  getApp: () => Express;
  close: () => void;
}

export default class {
  private readonly middleware: Middleware;

  private app: Express;

  private server: Server;

  constructor(middleware: Middleware = (req: Request, res: Response, next: any) => next()) {
    this.middleware = middleware;
    this.app = express();
    this.server = this.app.listen(9001);
  }

  stub = (path: string, method: string, responseBody: object) => {
    // @ts-ignore
    this.app[method](path, this.middleware, (req: Request, response: Response) => response.json(responseBody));
  }

  unset = () => {
    this.close();
    this.app = express();
    this.server = this.app.listen(9001);
  }

  getApp = () => this.app;

  close = () => {
    if (this.server) {
      this.server.close();
    }
  }
}
