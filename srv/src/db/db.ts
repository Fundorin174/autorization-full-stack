require('dotenv').config();
import Pool from 'pg';

const Entity = Pool.Pool
const pool = new Entity({
  user: "admin",
  password: "root",
  host: "localhost",
  port: process.env.ACC_DB_PORT ? +process.env.ACC_DB_PORT : 5432,
  database: 'postgres'
});

export default pool