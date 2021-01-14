import Courier from '../entities/courier';
import db from '../../db';

export default class CouriersService {
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
        FROM couriers;
    `);

    return rows.map(CouriersService.toCourierObject);
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

    return CouriersService.toCourierObject(rows[0]);
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

    return CouriersService.toCourierObject(rows[0]);
  }

  /**
   * Updates courier with specified id in database
   * @param {number} id
   * @param {Partial<Courier>} newData
   * @return {Promise<Courier | null>}
   */
  async updateCourierById(id: number, newData: Partial<Courier>): Promise<Courier | null> {
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

    return rows.length ? CouriersService.toCourierObject(rows[0]) : null;
  }

  /**
   * Deletes courier with specified id from database
   * @param {number} id
   * @return {Promise<void>}
   */
  async deleteCourierById(id: number): Promise<void> {
    await db.query(`
      DELETE
      FROM couriers
      WHERE id = ${id};
    `);
  }
}

interface ICreateCourier {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}
