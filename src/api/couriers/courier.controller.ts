import courierService from '../../domain/services/courier.service';

export const getAll = async (ctx) => {
  const clients = await courierService.getAllCouriers();
  ctx.status = 200;
  ctx.body = clients;
};

export const getOne = async (ctx) => {
  const { id } = ctx.params;
  ctx.assert(!isNaN(id), 400);

  const client = await courierService.getCourierById(id);
  ctx.assert(client, 404);

  ctx.status = 200;
  ctx.body = client;
};

export const getOneStats = async (ctx) => {
  const { id } = ctx.params;
  ctx.assert(!isNaN(id), 400);

  const courier = await courierService.getCourierById(id);
  ctx.assert(courier, 404);

  const stats = await courierService.getCourierStatsById(id);
  ctx.assert(stats, 404);

  ctx.status = 200;
  ctx.body = stats;
};

export const createOne = async (ctx) => {
  const { firstName, lastName, phoneNumber } = ctx.request.body;
  ctx.assert(firstName && lastName && phoneNumber, 400);

  const client = await courierService.createCourier({ firstName, lastName, phoneNumber });
  ctx.assert(client, 500);

  ctx.status = 201;
  ctx.body = client;
};

export const updateOne = async (ctx) => {
  const { id } = ctx.params;
  ctx.assert(!isNaN(id), 400);

  const { firstName, lastName, phoneNumber } = ctx.request.body;
  ctx.assert(firstName || lastName || phoneNumber, 400);

  const client = await courierService.updateCourierById(id, ctx.request.body);
  ctx.assert(client, 404);

  ctx.status = 200;
  ctx.body = client;
};

export const deleteOne = async (ctx) => {
  const { id } = ctx.params;
  ctx.assert(!isNaN(id), 400);

  const client = await courierService.deleteCourierById(id);
  ctx.assert(client, 404);

  ctx.status = 200;
  ctx.body = client;
};
