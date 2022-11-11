const postgreDb = require("../config/postgre");

const getPromos = (queryString, limit, offset) => {
  return new Promise((resolve, reject) => {
    let query =
      "select promos.id, promos.promo_name, products.product_name, promos.promo_description, promos.discount, promos.start_discount, promos.end_discount, promos.code_promo, promos.image from promos left join products on promos.products_id = products.id ";

    let firstWhere = true;
    if (queryString.search) {
      query += `${
        firstWhere ? "WHERE" : "AND"
      } lower(code_promo) like lower('%${queryString.search}%')`;
      firstWhere = false;
    }
    if (queryString.order && queryString.sort) {
      query += ` ORDER BY ${queryString.sort} ${queryString.order}`;
    }
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    postgreDb.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getTotalPromos = (queryString) => {
  return new Promise((resolve, reject) => {
    let query =
      "select COUNT(*) from promos left join products on promos.products_id = products.id ";

    let firstWhere = true;
    if (queryString.search) {
      query += `${
        firstWhere ? "WHERE" : "AND"
      } lower(code_promo) like lower('%${queryString.search}%')`;
      firstWhere = false;
    }

    postgreDb.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getDetailPromo = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select promos.id, promos.promo_name, products.product_name, promos.promo_description, promos.discount, promos.start_discount, promos.end_discount, promos.code_promo, promos.image from promos left join products on promos.products_id = products.id where promos.id = $1 ";
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const createPromos = (body) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into promos (promo_name, promo_description, discount, start_discount, end_discount, code_promo, image, products_id) values ($1,$2,$3,$4,$5,$6,$7,$8) returning id";

    const {
      promo_name,
      promo_description,
      discount,
      start_discount,
      end_discount,
      code_promo,
      image,
      products_id,
    } = body;
    postgreDb.query(
      query,
      [
        promo_name,
        promo_description,
        discount,
        start_discount,
        end_discount,
        code_promo,
        image,
        products_id,
      ],
      (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        resolve(result);
      }
    );
  });
};

const editPromos = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update promos set ";
    const values = [];
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id = $${idx + 2}`;
        values.push(body[key], params.id);
        return;
      }
      query += `${key} = $${idx + 1}, `;
      values.push(body[key]);
    });
    postgreDb
      .query(query, values)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

const deletePromos = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from promos where id = $1 RETURNING *";

    postgreDb.query(query, [params.id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const promosRepo = {
  getPromos,
  getTotalPromos,
  getDetailPromo,
  createPromos,
  editPromos,
  deletePromos,
};

module.exports = promosRepo;
