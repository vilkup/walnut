import fs from 'fs';
import Router from 'koa-router';
import path from 'path';

const applyAPIMiddleware = (server) => {
  const router = new Router({
    prefix: `/api`
  });

  /**
   * Requires all entities' routers and creates a sub-router for every entity
   */
  fs.readdirSync(__dirname)
    .filter(fileName => {
      const filePath = path.join(__dirname, fileName);
      return (
        fileName !== path.basename(__filename) &&
        fs.statSync(filePath).isDirectory()
      );
    })
    .forEach(fileName => {
      const filePath = path.join(__dirname, fileName);
      const api = require(filePath).default(Router);
      router.use(api.routes());
    });

  server
    .use(router.routes())
    .use(router.allowedMethods());
};

export default applyAPIMiddleware;
