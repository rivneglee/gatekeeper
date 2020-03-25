import express, { Request, Response, NextFunction, Express } from 'express';
import { Server } from 'http';

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export interface StubServer {
  stub: (path: string, method: string, responseBody: object) => void;
  getApp: () => Express;
  close: () => void;
}

export default class {
  private readonly middleware: Middleware;

  private app: Express;

  private server?: Server;

  private readonly port: number;

  constructor(middleware: Middleware = (req: Request, res: Response, next: any) => next(), port = 9001) {
    this.middleware = middleware;
    this.app = express();
    this.port = port;
  }

  stub = (path: string, method: string, responseBody: object) => {
    this.close();
    this.app = express();
    this.app.use(this.middleware);
    // @ts-ignore
    this.app[method](path, (req: Request, response: Response) => response.json(responseBody));
    this.server = this.app.listen(this.port);
  }

  getApp = () => this.app;

  close = () => {
    if (this.server) {
      this.server.close();
    }
  }
}
