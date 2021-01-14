import * as controller from './cat.controller';

export default (Router) => {
  const router = new Router({
    prefix: `/cats`
  });

  router
    .get('/:userId', controller.getOne)
    .get('/', controller.getAll)
    .post('/', controller.createOne);

  return router;
};
