import { IClient } from '../types/client';

export default class Client implements IClient {
  constructor(
    public readonly id: number,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phoneNumber: string
  ) {}
}
