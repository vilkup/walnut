import * as controller from './restaurant.controller';

export default (Router) => {
  const router = new Router({
    prefix: '/restaurants'
  });

  router
    .get('/', controller.getAll)
    .get('/:id', controller.getOne)
    .post('/', controller.createOne)
    .put('/:id', controller.updateOne)
    .delete('/:id', controller.deleteOne);

  return router;
};
