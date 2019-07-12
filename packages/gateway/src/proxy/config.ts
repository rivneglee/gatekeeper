import { GatewayConfiguration } from '../types';
import fs from 'fs';
import yaml from 'yaml';

export const loadConfig = (path: string = './config/gateway.config.yml',
                           endCoding: string = 'utf8'): GatewayConfiguration => {
  const configYaml = fs.readFileSync(path, endCoding);
  const config = yaml.parse(configYaml);
  return config;
};
