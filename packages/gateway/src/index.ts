import { startServer } from './proxy/server';
import { loadConfig } from './proxy/config';

startServer(loadConfig());
