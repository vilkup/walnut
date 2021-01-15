import Order from '../entities/order';
import { OrderStatus } from '../types/order';
import { ILocation } from '../types/location';
import db from '../../db';

class OrderService {
  /**
   * Converts database row to Order object
   * @param row
   * @return {Order}
   * @private
   */
  private static toOrderObject(row): Order {
    return new Order(
      row.id,
      row.client_id,
      row.courier_id,
      row.restaurant_id,
      row.delivery_address,
      {
        latitude: row.delivery_geolocation.x,
        longitude: row.delivery_geolocation.y
      },
      row.text,
      +row.price,
      row.status,
      row.start_date,
      row.end_date
    );
  }

  /**
   * Returns all orders from database
   * @return {Promise<Order[]>}
   */
  async getAllOrders(): Promise<Order[]> {
    const { rows } = await db.query(`
        SELECT *
        FROM orders
        ORDER BY id;
    `);

    return rows.map(OrderService.toOrderObject);
  }

  /**
   * Returns order with specified id from database
   * @param {number} id
   * @return {Promise<Order | null>}
   */
  async getOrderById(id: number): Promise<Order | null> {
    const { rows } = await db.query(`
      SELECT * 
      FROM orders
      WHERE id = ${id};
    `);

    return rows.length ? OrderService.toOrderObject(rows[0]) : null;
  }

  /**
   * Inserts a new order into database
   * @param {ICreateOrder} orderData
   * @return {Promise<Order>}
   */
  async createOrder({ clientId, courierId, deliveryAddress, deliveryGeolocation, restaurantId, text, price }: ICreateOrder): Promise<Order> {
    const { rows } = await db.query(`
      INSERT INTO orders
      VALUES (
        DEFAULT, 
        ${clientId}, 
        ${courierId}, 
        '${deliveryAddress}', 
        point(${deliveryGeolocation.latitude}, ${deliveryGeolocation.longitude}),
        ${restaurantId}, 
        '${text}', 
        ${price},
        DEFAULT,
        DEFAULT
      )
      RETURNING *;
    `);

    return OrderService.toOrderObject(rows[0]);
  }

  /**
   * Updates order with specified id in database
   * @param {number} id
   * @param {IUpdateOrder} newData
   * @return {Promise<Order | null>}
   */
  async updateOrder(id: number, newData: IUpdateOrder): Promise<Order | null> {
    let updateString = Object.entries(newData).reduce((acc, [field, value]) => {
      let fieldAlias = field;
      let typedValue = value;

      switch (field) {
        case 'courierId':
          fieldAlias = 'courier_id';
          break;
      }

      return acc + `"${fieldAlias}" = ${typedValue}`;
    }, '');

    if (updateString.length === 0) {
      throw new Error('No data provided for updating order');
    }

    // If status changed to COMPLETED, set order's end date
    if (newData.status && +newData.status === OrderStatus.COMPLETED) {
      updateString += `, "end_date" = '${new Date().toISOString()}'`;
    }

    const { rows } = await db.query(`
      UPDATE orders
      SET ${updateString}
      WHERE id = ${id}
      RETURNING *;
    `);

    return rows.length ? OrderService.toOrderObject(rows[0]) : null;
  }
}

interface ICreateOrder {
  clientId: number;
  courierId: number;
  deliveryAddress: string;
  deliveryGeolocation: ILocation;
  restaurantId: number;
  text: string;
  price: number;
}

interface IUpdateOrder {
  courierId?: number;
  status?: OrderStatus;
}

export default new OrderService();
