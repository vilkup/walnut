import developmentConfig from './configs/development';
import productionConfig from './configs/production';

let config;

switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    config = productionConfig;
    break;

  case 'dev':
  case 'development':
  default:
    config = developmentConfig;
    break;
}

export default config;
