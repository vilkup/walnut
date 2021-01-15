import * as controller from './order.controller';

export default (Router) => {
  const router = new Router({
    prefix: '/orders'
  });

  router
    .get('/', controller.getAll)
    .get('/:id', controller.getOne)
    .post('/', controller.createOne)
    .put('/:id', controller.updateOne);

  return router;
};
