import Courier from '../entities/courier';
import db from '../../db';
import { ICourierStats } from '../types/courier';
import { OrderStatus } from '../types/order';

class CourierService {
  /**
   * Converts database row to Courier object
   * @param row
   * @return {Courier}
   * @private
   */
  private static toCourierObject(row): Courier {
    return new Courier(row.id, row.first_name, row.last_name, row.phone_number);
  }

  /**
   * Returns all couriers from database
   * @return {Promise<Courier[]>}
   */
  async getAllCouriers(): Promise<Courier[]> {
    const { rows } = await db.query(`
        SELECT *
        FROM couriers
        ORDER BY id;
    `);

    return rows.map(CourierService.toCourierObject);
  }

  /**
   * Returns courier with specified id from database
   * @param {number} id
   * @return {Promise<Courier | null>}
   */
  async getCourierById(id: number): Promise<Courier | null> {
    const { rows } = await db.query(`
      SELECT * 
      FROM couriers
      WHERE id = ${id};
    `);

    return CourierService.toCourierObject(rows[0]);
  }

  /**
   * Inserts a new courier into database
   * @param {ICreateCourier} courierData
   * @return {Promise<Courier>}
   */
  async createCourier({ firstName, lastName, phoneNumber }: ICreateCourier): Promise<Courier> {
    const { rows } = await db.query(`
      INSERT INTO couriers
      VALUES (DEFAULT, '${firstName}', '${lastName}', '${phoneNumber}')
      RETURNING *;
    `);

    return CourierService.toCourierObject(rows[0]);
  }

  /**
   * Updates courier with specified id in database
   * @param {number} id
   * @param {IUpdateCourier} newData
   * @return {Promise<Courier | null>}
   */
  async updateCourierById(id: number, newData: IUpdateCourier): Promise<Courier | null> {
    const updateString = Object.entries(newData).reduce((acc, [field, value]) => {
      let fieldAlias = field;
      let typedValue = `'${value}'`;

      switch (field) {
        case 'firstName':
          fieldAlias = 'first_name';
          break;
        case 'lastName':
          fieldAlias = 'last_name';
          break;
        case 'phoneNumber':
          fieldAlias = 'phone_number';
          break;
      }

      return acc + `"${fieldAlias}" = ${typedValue}`;
    }, '');

    if (updateString.length === 0) {
      throw new Error('No data provided for updating courier');
    }

    const { rows } = await db.query(`
      UPDATE couriers
      SET ${updateString}
      WHERE id = ${id}
      RETURNING *;
    `);

    return rows.length ? CourierService.toCourierObject(rows[0]) : null;
  }

  /**
   * Deletes courier with specified id from database
   * @param {number} id
   * @return {Promise<Courier | null>}
   */
  async deleteCourierById(id: number): Promise<Courier | null> {
    const { rows } = await db.query(`
      DELETE
      FROM couriers
      WHERE id = ${id}
      RETURNING *;
    `);

    return rows.length ? CourierService.toCourierObject(rows[0]) : null;
  }

  /**
   * Returns stats by courier
   * @param {number} id
   * @return {Promise<ICourierStats | null>}
   */
  async getCourierStatsById(id: number): Promise<ICourierStats | null> {
    const { rows: topDeliveryAddressRows } = await db.query(`
      SELECT delivery_address, COUNT(*) as orders_count
      FROM orders
      WHERE courier_id = ${id} 
        AND status = ${OrderStatus.COMPLETED}
      GROUP BY delivery_address
      ORDER BY orders_count DESC
      LIMIT 1;
    `);

    const { rows: totalOrdersCompletedRows } = await db.query(`
      SELECT COUNT(*) as total_orders_completed
      FROM orders
      WHERE courier_id = ${id} 
        AND status = ${OrderStatus.COMPLETED};
    `);

    const { rows: averageOrderTimeRows } = await db.query(`
      SELECT AVG(ABS(EXTRACT(MINUTE FROM age(end_date, start_date)))) AS average_order_time
      FROM orders
      WHERE courier_id = ${id} 
        AND status = ${OrderStatus.COMPLETED};
    `);

    const { rows: totalOrdersPriceRows } = await db.query(`
      SELECT SUM(price) as total_orders_price
      FROM orders
      WHERE courier_id = ${id} 
        AND status = ${OrderStatus.COMPLETED};
    `);

    const topDeliveryAddress = topDeliveryAddressRows.length
      ? {
        address: topDeliveryAddressRows[0].delivery_address,
        ordersCount: +topDeliveryAddressRows[0].orders_count
      }
      : null;
    const totalOrdersCompleted = +totalOrdersCompletedRows[0].total_orders_completed;
    const averageOrderTime = +averageOrderTimeRows[0].average_order_time;
    const totalOrdersPrice = +totalOrdersPriceRows[0].total_orders_price;

    return {
      topDeliveryAddress,
      totalOrdersCompleted,
      averageOrderTime,
      totalOrdersPrice
    };
  }
}

interface ICreateCourier {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface IUpdateCourier {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export default new CourierService();
