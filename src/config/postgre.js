// konfigurasi untuk db yang berupa config postgre
// koneksi pg yang ada didepedencies
// const pg = require("pg");
// const { Pool } = pg; atau

const { Pool } = require("pg");
const db = new Pool({
  host: "localhost",
  user: "dian",
  database: "dian_coffeshop",
  password: "qwerty",
  port: "5432",
});

module.exports = db;
