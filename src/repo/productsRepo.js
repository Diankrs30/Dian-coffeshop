// import database
const postgreDb = require("../config/postgre");
const { post } = require("../routes/usersRouter");

// CRUD
const getProducts = (queryString, limit, offset) => {
  let query =
    "select products.id, products.product_name, products.product_description, products.price, products.image, products.start_delivery, products.end_delivery, products.created_at, products.stock_product, products.total_selling, promos.discount, promos.code_promo, categories.category_name as category from products left join promos on products.id = promos.products_id left join categories on products.category_id = categories.id  ";

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
    query += `${
      firstWhere ? "WHERE" : "AND"
    } lower(categories.category_name) like lower('${queryString.category}%')`;
    firstWhere = false;
  }
  if (queryString.order && queryString.sort) {
    query += ` ORDER BY ${queryString.sort} ${queryString.order}`;
  }

  query += ` LIMIT ${limit} OFFSET ${offset}`;

  // console.log(query);
  return new Promise((resolve, reject) => {
    postgreDb.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getTotalProduct = (queryString) => {
  let query =
    "select COUNT(*) from products left join promos on products.id = promos.products_id left join categories on products.category_id = categories.id  ";

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
    query += `${
      firstWhere ? "WHERE" : "AND"
    } lower(categories.category_name) like lower('${queryString.category}%')`;
    firstWhere = false;
  }
  return new Promise((resolve, reject) => {
    postgreDb.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};
const getProductDetail = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select products.id, products.product_name, products.product_description, products.price, products.image, products.start_delivery, products.end_delivery, products.created_at, products.stock_product, products.total_selling, promos.discount, promos.code_promo, categories.category_name as category from products left join promos on products.id = promos.products_id left join categories on products.category_id = categories.id where products.id = $1";

    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const createProduct = (body) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into products (category_id, product_name, product_description, price, image, start_delivery, end_delivery, stock_product, total_selling) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id";

    const {
      category_id,
      product_name,
      product_description,
      price,
      image,
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

const editProducts = (body, params) => {
  // console.log("repoedit", params);
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
    const query = "delete from products where id = $1 RETURNING *";

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
  getProductDetail,
  getTotalProduct,
  createProduct,
  editProducts,
  deleteProduct,
};

module.exports = productsRepo;
