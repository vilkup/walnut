import https from 'https';
import cluster from 'cluster';
import fs from 'fs';
import { cpus } from 'os';

import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import applyAPIMiddleware from '../api';
import config from '../config/';

const sslOptions = {
  key: fs.readFileSync(config.server.ssl.keyPath),
  cert: fs.readFileSync(config.server.ssl.certPath),
  ca: fs.readFileSync(config.server.ssl.chainPath)
};

const port = config.server.port;
const server = new Koa();

/**
 * Passing to our server instance middlewares
 */
server
  .use(logger())
  .use(cors())
  .use(bodyParser());

applyAPIMiddleware(server);

export default {
  server,
  async init() {
    /**
     * Clustering a server
     */
    const cpusCount = cpus().length;

    if (cluster.isMaster) {
      for (let i = 0; i < cpusCount; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        console.log(`XXX [Server]: Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
        console.log('=> [Server]: Starting a new worker...');
        cluster.fork();
      });
    }
    else {
      const app = server.callback();
      await https.createServer(sslOptions, app).listen(port);

      console.log(`=> [Server]: Server is listening on port ${port} (pid: ${process.pid})`);
    }
  }
};
