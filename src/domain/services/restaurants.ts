import Restaurant from '../entities/restaurant';
import { ILocation } from '../types/location';
import db from '../../db';

export default class RestaurantsService {
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
   * Returns all restaurants from database
   * @return {Promise<Restaurant[]>}
   */
  async getAllRestaurants(): Promise<Restaurant[]> {
    const { rows } = await db.query(`
        SELECT *
        FROM restaurants;
    `);

    return rows.map(RestaurantsService.toRestaurantObject);
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

    return rows.length ? RestaurantsService.toRestaurantObject(rows[0]) : null;
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

    return RestaurantsService.toRestaurantObject(rows[0]);
  }

  /**
   * Updates restaurant with specified id in database
   * @param {number} id
   * @param {Partial<Restaurant>} newData
   * @return {Promise<Restaurant | null>}
   */
  async updateRestaurantById(id: number, newData: Partial<Restaurant>): Promise<Restaurant | null> {
    const updateString = Object.entries(newData).reduce((acc, [field, value]) => {
      return acc + `"${field}" = ${value}`;
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

    return rows.length ? RestaurantsService.toRestaurantObject(rows[0]) : null;
  }

  /**
   * Deletes restaurant with specified id from database
   * @param {number} id
   * @return {Promise<void>}
   */
  async deleteRestaurantById(id: number): Promise<void> {
    await db.query(`
      DELETE
      FROM restaurants
      WHERE id = ${id};
    `);
  }
}

interface ICreateRestaurant {
  name: string;
  address: string;
  geolocation: ILocation;
}
