import { Db, MongoClient, MongoClientOptions } from 'mongodb';

let connection: Promise<MongoClient>;

const uri = process.env['DB_URI'] || 'mongodb://db:27017';
const user = process.env['DB_USERNAME'] || '';
const password = process.env['DB_PASSWORD'] || '';
const db = process.env['DB_NAME'] || 'paperwork';

export const getClient = (): Promise<MongoClient> => {
  if (!connection) {
    const auth = user ? { user, password } : undefined;
    const options: MongoClientOptions = {
      auth,
    };
    connection = MongoClient.connect(uri, options);
  }
  return connection;
};

export const getDb = async () => {
  const client = await getClient();
  return client.db(db);
};

export const getStore = async (storeName: string) => {
  const db: Db = await getDb();
  return db.collection(storeName);
};
