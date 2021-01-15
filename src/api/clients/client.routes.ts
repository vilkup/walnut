import * as controller from './client.controller';

export default (Router) => {
  const router = new Router({
    prefix: '/clients'
  });

  router
    .get('/', controller.getAll)
    .get('/:id', controller.getOne)
    .post('/', controller.createOne)
    .put('/:id', controller.updateOne)
    .delete('/:id', controller.deleteOne);

  return router;
};
