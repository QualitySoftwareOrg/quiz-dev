require('dotenv').config();

const { Pool } = require('pg');

const useSsl = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: useSsl
    ? {
        require: true,
        rejectUnauthorized: false, // use "true" em producao com certificado valido
      }
    : false,
});

const query = (text, params) => pool.query(text, params);

module.exports = { query };
