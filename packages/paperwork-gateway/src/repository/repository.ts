import { getStore } from './connection';

export default (storeName: string) => ({
  save: async (organization: any) => {
    const store = await getStore(storeName);
    return store.insert(organization);
  },
  get: async (query = {}) => {
    const store = await getStore(storeName);
    return store.findOne(query);
  },
  list: async (query = {}) => {
    const store = await getStore(storeName);
    return store.find(query).toArray();
  },
  delete: async (uid: string) => {
    const store = await getStore(storeName);
    return store.deleteOne({
      uid,
    });
  },
});
