import orderService from '../../domain/services/order.service';
import { validateGeolocation } from '../../util/validate';

export const getAll = async (ctx) => {
  const orders = await orderService.getAllOrders();
  const filteredOrders = orders.filter(order => {
    return Object.entries(ctx.query).every(([key, value]) => order[key] == value);
  });

  ctx.status = 200;
  ctx.body = filteredOrders;
};

export const getOne = async (ctx) => {
  const { id } = ctx.params;
  ctx.assert(!isNaN(id), 400);

  const order = await orderService.getOrderById(id);
  ctx.assert(order, 404);

  ctx.status = 200;
  ctx.body = order;
};

export const createOne = async (ctx) => {
  const { clientId, courierId, deliveryAddress, deliveryGeolocation, restaurantId, text, price } = ctx.request.body;
  ctx.assert(
    clientId && courierId &&
    deliveryAddress && deliveryGeolocation && validateGeolocation(deliveryGeolocation)
    && restaurantId && text && price,
    400
  );

  const order = await orderService.createOrder({
    clientId,
    courierId,
    deliveryAddress,
    deliveryGeolocation,
    restaurantId,
    text,
    price
  });
  ctx.assert(order, 500);

  ctx.status = 201;
  ctx.body = order;
};

export const updateOne = async (ctx) => {
  const { id } = ctx.params;
  ctx.assert(!isNaN(id), 400);

  const { courierId, status } = ctx.request.body;
  ctx.assert(courierId || status, 400);

  const updateData = Object.assign(
    {},
    courierId ? { courierId } : null,
    status ? { status } : null
  );

  const order = await orderService.updateOrder(id, updateData);
  ctx.assert(order, 404);

  ctx.status = 200;
  ctx.body = order;
};
