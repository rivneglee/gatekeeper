import DB from 'mongodb';
import { Validator } from 'jsonschema';

export interface Reporistory<T> {
  list: () => T[];
  get: (id: string) => T;
  delete: (id: string) => void;
  update: (user: T) => T;
  create: (user: T) => T;
}

const getClient = (url: string, username: string, password: string) => {
  return new Promise((resolve, reject) => {
    DB.MongoClient.connect(url, (err, client) => {
      if (err) {
        reject(err);
      } else {
        resolve(client);
      }
    });
  });
};

export const createRepository = (schema: object) => {}
