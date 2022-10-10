// import database
const postgreDb = require("../config/postgre");

// CRUD
const getProducts = (queryString) => {
  let query =
    "select * from promos right join products on products.id = promos.products_id ";
  let firstWhere = true;
  if (queryString.search) {
    query += `${
      firstWhere ? "WHERE" : "AND"
    } lower(product_name) like lower('%${
      queryString.search
    }%') OR lower(code_promo) like lower('%${queryString.search}%')`;
    firstWhere = false;
  }
  if (queryString.category && queryString.category !== "") {
    query += `${firstWhere ? "WHERE" : "AND"} category_id = ${
      queryString.category
    }`;
    firstWhere = false;
  }
  if (queryString.sort && queryString.sortBy) {
    query += ` ORDER BY ${queryString.sortBy} ${queryString.sort}`;
  }
  return new Promise((resolve, reject) => {
    // const query =
    //   "select id, category_id, product_name, product_description, price, image, size_1, size_2, size_3, home_delivery, dine_in, take_away, start_delivery, end_delivery, stock_product from products";

    postgreDb.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const createProduct = (body) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into products (category_id, product_name, product_description, price, image, size_1, size_2, size_3, home_delivery, dine_in, take_away, start_delivery, end_delivery, stock_product, total_selling) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)";

    const {
      category_id,
      product_name,
      product_description,
      price,
      image,
      size_1,
      size_2,
      size_3,
      home_delivery,
      dine_in,
      take_away,
      start_delivery,
      end_delivery,
      stock_product,
      total_selling,
    } = body;

    postgreDb.query(
      query,
      [
        category_id,
        product_name,
        product_description,
        price,
        image,
        size_1,
        size_2,
        size_3,
        home_delivery,
        dine_in,
        take_away,
        start_delivery,
        end_delivery,
        stock_product,
        total_selling,
      ],
      (error, queryResult) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        resolve(queryResult);
      }
    );
  });
};
// perlu dicek ulang karena error
const editProducts = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update products set ";
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

const deleteProduct = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from products where id = $1";

    postgreDb.query(query, [params.id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};
const productsRepo = {
  getProducts,
  createProduct,
  editProducts,
  deleteProduct,
};

module.exports = productsRepo;
