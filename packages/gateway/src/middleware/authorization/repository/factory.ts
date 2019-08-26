import { Db, MongoClient } from 'mongodb';
import HttpProxyError from '../../../exception/http-proxy-error';

let factory: Promise<Db>;
let storageSettings: any;

export const configureStorage = (settings: any) => storageSettings = settings;

export const getConnection = () => {
  if (!factory) {
    const { storage } = storageSettings;
    const { url, database = 'gatekeeper' } = storage;
    factory = MongoClient.connect(url, {
      useNewUrlParser: true,
    }).then(client => client.db(database));
  }
  return factory;
};

export const createRepository = async (table: string, keyField: string) => {
  const connection = await getConnection();
  const collection = connection.collection(table);
  return {
    list: async () => await collection.find().toArray(),
    get: async (key: any) => {
      const existing = await collection.findOne({ [keyField]: key });
      if (!existing) {
        throw new HttpProxyError(404, `${key} not found`);
      }
      return collection.findOne({ [keyField]: key });
    },
    create: async (entity: any) => {
      const existing = await collection.findOne({ [keyField]: entity[keyField] });
      if (existing) {
        throw new HttpProxyError(400, `${entity[keyField]} has existed`);
      }
      return collection.insertOne(entity);
    },
    update: async (entity: any) => {
      const existing = await collection.findOne({ [keyField]: entity[keyField] });
      if (!existing) {
        throw new HttpProxyError(404, `${entity[keyField]} not found`);
      }
      return collection.updateOne({ [keyField]: entity[keyField] }, { $set: entity });
    },
    delete: async (key: any) => {
      const existing = await collection.findOne({ [keyField]: key });
      if (!existing) {
        throw new HttpProxyError(404, `${key} not found`);
      }
      return collection.deleteOne({ [keyField]: key });
    },
  };
};
