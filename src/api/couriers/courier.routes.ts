import * as controller from './courier.controller';

export default (Router) => {
  const router = new Router({
    prefix: '/couriers'
  });

  router
    .get('/', controller.getAll)
    .get('/:id', controller.getOne)
    .get('/:id/stats', controller.getOneStats)
    .post('/', controller.createOne)
    .put('/:id', controller.updateOne)
    .delete('/:id', controller.deleteOne);

  return router;
};
