import server from './server';

const bootstrap = async () => {
  await server.init();
};

bootstrap()
  .catch(err => {
    console.error('Error while starting an app:', err);
    process.exit(1);
  });
