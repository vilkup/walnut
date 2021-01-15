import clientService from '../../domain/services/client.service';

export const getAll = async (ctx) => {
  const clients = await clientService.getAllClients();
  ctx.status = 200;
  ctx.body = clients;
};

export const getOne = async (ctx) => {
  const { id } = ctx.params;
  ctx.assert(!isNaN(id), 400);

  const client = await clientService.getClientById(id);
  ctx.assert(client, 404);

  ctx.status = 200;
  ctx.body = client;
};

export const createOne = async (ctx) => {
  const { firstName, lastName, phoneNumber } = ctx.request.body;
  ctx.assert(firstName && lastName && phoneNumber, 400);

  const client = await clientService.createClient({ firstName, lastName, phoneNumber });
  ctx.assert(client, 500);

  ctx.status = 201;
  ctx.body = client;
};

export const updateOne = async (ctx) => {
  const { id } = ctx.params;
  ctx.assert(!isNaN(id), 400);

  const { firstName, lastName, phoneNumber } = ctx.request.body;
  ctx.assert(firstName || lastName || phoneNumber, 400);

  const client = await clientService.updateClientById(id, ctx.request.body);
  ctx.assert(client, 404);

  ctx.status = 200;
  ctx.body = client;
};

export const deleteOne = async (ctx) => {
  const { id } = ctx.params;
  ctx.assert(!isNaN(id), 400);

  const client = await clientService.deleteClientById(id);
  ctx.assert(client, 404);

  ctx.status = 200;
  ctx.body = client;
};
