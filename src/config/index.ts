let config;

switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    config = require('./configs/production').default;
    break;

  case 'dev':
  case 'development':
  default:
    config = require('./configs/development').default;
    break;
}

export default config;
