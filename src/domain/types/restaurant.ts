import { ILocation } from './location';

export interface IRestaurant {
  id: number;
  name: string;
  address: string;
  geolocation: ILocation;
}
