import { ICourier } from '../types/courier';

export default class Courier implements ICourier {
  constructor(
    public readonly id: number,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phoneNumber: string
  ) {}
}
