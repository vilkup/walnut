import { ILocation } from './location';

export interface IOrder {
  id: number;
  clientId: number;
  courierId: number;
  restaurantId: number;
  deliveryAddress: string;
  deliveryGeolocation: ILocation;
  text: string;
  price: number;
  status: OrderStatus;
  startDate: Date;
  endDate?: Date;
}

export enum OrderStatus {
  WAITING,
  COOKING,
  DELIVERING,
  FINISHED
}
