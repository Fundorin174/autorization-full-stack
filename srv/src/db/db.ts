import Pool from 'pg';

const Entity = Pool.Pool
const pool = new Entity({
  user: "admin",
  password: "root",
  host: "localhost",
  port: process.env.ACC_DB_PORT ? +process.env.ACC_DB_PORT : undefined,
  database: 'db_auth'
});

export default pool