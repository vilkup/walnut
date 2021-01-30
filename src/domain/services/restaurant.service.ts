import Restaurant from '../entities/restaurant';
import { ILocation } from '../types/location';
import db from '../../db';

class RestaurantService {
  /**
   * Converts database row to Restaurant object
   * @param row
   * @return {Restaurant}
   * @private
   */
  private static toRestaurantObject(row): Restaurant {
    return new Restaurant(
      row.id,
      row.name,
      row.address,
      {
        latitude: row.geolocation.x,
        longitude: row.geolocation.y
      }
    );
  }

  /**
   * Returns all orders from database
   * @return {Promise<Restaurant[]>}
   */
  async getAllRestaurants(): Promise<Restaurant[]> {
    const { rows } = await db.query(`
        SELECT *
        FROM restaurants
        ORDER BY id;
    `);

    return rows.map(RestaurantService.toRestaurantObject);
  }

  /**
   * Returns restaurant with specified id from database
   * @param {number} id
   * @return {Promise<Restaurant | null>}
   */
  async getRestaurantById(id: number): Promise<Restaurant | null> {
    const { rows } = await db.query(`
      SELECT * 
      FROM restaurants
      WHERE id = ${id};
    `);

    return rows.length ? RestaurantService.toRestaurantObject(rows[0]) : null;
  }

  /**
   * Inserts a new restaurant into database
   * @param {ICreateRestaurant} restaurantData
   * @return {Promise<Restaurant>}
   */
  async createRestaurant({ name, address, geolocation }: ICreateRestaurant): Promise<Restaurant> {
    const { rows } = await db.query(`
      INSERT INTO restaurants
      VALUES (DEFAULT, '${name}', '${address}', point(${geolocation.latitude}, ${geolocation.longitude}))
      RETURNING *;
    `);

    return RestaurantService.toRestaurantObject(rows[0]);
  }

  /**
   * Updates restaurant with specified id in database
   * @param {number} id
   * @param {IUpdateRestaurant} newData
   * @return {Promise<Restaurant | null>}
   */
  async updateRestaurantById(id: number, newData: IUpdateRestaurant): Promise<Restaurant | null> {
    const updateString = Object.entries(newData).reduce((acc, [field, value]) => {
      let fieldAlias = field;
      let typedValue = `'${value}'`;

      switch (field) {
        case 'geolocation':
          typedValue = `point(${value.latitude}, ${value.longitude})`;
          break;
      }

      return acc + `"${fieldAlias}" = ${typedValue}`;
    }, '');

    if (updateString.length === 0) {
      throw new Error('No data provided for updating restaurant');
    }

    const { rows } = await db.query(`
      UPDATE restaurants
      SET ${updateString}
      WHERE id = ${id}
      RETURNING *;
    `);

    return rows.length ? RestaurantService.toRestaurantObject(rows[0]) : null;
  }

  /**
   * Deletes restaurant with specified id from database
   * @param {number} id
   * @return {Promise<Restaurant | null>}
   */
  async deleteRestaurantById(id: number): Promise<Restaurant | null> {
    const { rows } = await db.query(`
      DELETE
      FROM restaurants
      WHERE id = ${id}
      RETURNING *;
    `);

    return rows.length ? RestaurantService.toRestaurantObject(rows[0]) : null;
  }
}

interface ICreateRestaurant {
  name: string;
  address: string;
  geolocation: ILocation;
}

interface IUpdateRestaurant {
  name: string;
  address: string;
  geolocation: ILocation;
}

export default new RestaurantService();
