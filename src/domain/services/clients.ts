import Client from '../entities/client';
import db from '../../db';

export default class ClientsService {
  /**
   * Converts database row to Client object
   * @param row
   * @return {Client}
   * @private
   */
  private static toClientObject(row): Client {
    return new Client(row.id, row.first_name, row.last_name, row.phone_number);
  }

  /**
   * Returns all clients from database
   * @return {Promise<Client[]>}
   */
  async getAllClients(): Promise<Client[]> {
    const { rows } = await db.query(`
        SELECT *
        FROM clients;
    `);

    return rows.map(ClientsService.toClientObject);
  }

  /**
   * Returns client with specified id from database
   * @param {number} id
   * @return {Promise<Client | null>}
   */
  async getClientById(id: number): Promise<Client | null> {
    const { rows } = await db.query(`
      SELECT * 
      FROM clients
      WHERE id = ${id};
    `);

    return rows.length ? ClientsService.toClientObject(rows[0]) : null;
  }

  /**
   * Inserts a new client into database
   * @param {ICreateClient} clientData
   * @return {Promise<Client>}
   */
  async createClient({ firstName, lastName, phoneNumber }: ICreateClient): Promise<Client> {
    const { rows } = await db.query(`
      INSERT INTO clients
      VALUES (DEFAULT, '${firstName}', '${lastName}', '${phoneNumber}')
      RETURNING *;
    `);

    return ClientsService.toClientObject(rows[0]);
  }

  /**
   * Updates client with specified id in database
   * @param {number} id
   * @param {Partial<Client>} newData
   * @return {Promise<Client | null>}
   */
  async updateClientById(id: number, newData: Partial<Client>): Promise<Client | null> {
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
      throw new Error('No data provided for updating client');
    }

    const { rows } = await db.query(`
      UPDATE clients
      SET ${updateString}
      WHERE id = ${id}
      RETURNING *;
    `);

    return rows.length ? ClientsService.toClientObject(rows[0]) : null;
  }

  /**
   * Deletes client with specified id from database
   * @param {number} id
   * @return {Promise<void>}
   */
  async deleteClientById(id: number): Promise<void> {
    await db.query(`
      DELETE
      FROM clients
      WHERE id = ${id};
    `);
  }
}

interface ICreateClient {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}
