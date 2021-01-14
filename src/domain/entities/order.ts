import { IOrder } from '../types/order';
import { ILocation } from '../types/location';

export default class Order implements IOrder {
  constructor(
    public readonly id: number,
    public readonly clientId: number,
    public readonly courierId: number,
    public readonly restaurantId: number,
    public readonly deliveryAddress: string,
    public readonly deliveryGeolocation: ILocation,
    public readonly text: string,
    public readonly price: number,
    public readonly status: number,
    public readonly startDate: Date,
    public readonly endDate?: Date
  ) {}
}
