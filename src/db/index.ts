import { Pool } from 'pg';
import config from '../config';

const db = new Pool(config.db);
export default db;
