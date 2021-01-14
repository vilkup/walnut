import { ILocation } from '../types/location';
import { IRestaurant } from '../types/restaurant';

export default class Restaurant implements IRestaurant {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly address: string,
    public readonly geolocation: ILocation
  ) {}
}
