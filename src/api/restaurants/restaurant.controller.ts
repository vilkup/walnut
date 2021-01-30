import restaurantService from '../../domain/services/restaurant.service';
import { validateGeolocation } from '../../util/validate';

export const getAll = async (ctx) => {
  const restaurants = await restaurantService.getAllRestaurants();
  ctx.status = 200;
  ctx.body = restaurants;
};

export const getOne = async (ctx) => {
  const { id } = ctx.params;
  ctx.assert(!isNaN(id), 400);

  const restaurant = await restaurantService.getRestaurantById(id);
  ctx.assert(restaurant, 404);

  ctx.status = 200;
  ctx.body = restaurant;
};

export const createOne = async (ctx) => {
  const { name, address, geolocation } = ctx.request.body;
  ctx.assert(name && address && geolocation && validateGeolocation(geolocation), 400);

  const restaurant = await restaurantService.createRestaurant({ name, address, geolocation });
  ctx.assert(restaurant, 500);

  ctx.status = 201;
  ctx.body = restaurant;
};

export const updateOne = async (ctx) => {
  const { id } = ctx.params;
  ctx.assert(!isNaN(id), 400);

  const { name, address, geolocation } = ctx.request.body;
  ctx.assert(name || address || geolocation, 400);

  if (geolocation) {
    ctx.assert(validateGeolocation(geolocation), 400);
  }

  const restaurant = await restaurantService.updateRestaurantById(id, ctx.request.body);
  ctx.assert(restaurant, 404);

  ctx.status = 200;
  ctx.body = restaurant;
};

export const deleteOne = async (ctx) => {
  const { id } = ctx.params;
  ctx.assert(!isNaN(id), 400);

  const restaurant = await restaurantService.deleteRestaurantById(id);
  ctx.assert(restaurant, 404);

  ctx.status = 200;
  ctx.body = restaurant;
};
