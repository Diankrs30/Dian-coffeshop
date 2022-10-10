// konfigurasi untuk db yang berupa config postgre
// koneksi pg yang ada didepedencies
// const pg = require("pg");
// const { Pool } = pg; atau
require("dotenv").config();

const { Pool } = require("pg");
const db = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

module.exports = db;
