export interface ICourier {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface ICourierStats {
  topDeliveryAddress: { address: string, ordersCount: number } | null;
  totalOrdersCompleted: number;
  averageOrderTime: number; // in minutes
  totalOrdersPrice: number;
}
