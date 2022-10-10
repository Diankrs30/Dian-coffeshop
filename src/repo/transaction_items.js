// import db
const postgreDb = require("../config/postgre");

const getTransactionItems = () => {
  return new Promise((resolve, reject) => {
    const query =
      "select transaction_items.id, products.product_name, transaction_items.quantity_product,  from transaction_items inner join products on transaction_items.products_id = products.id left join transactions on transaction_items.transactions_id = transactions.id left join promos on transaction_items.promos_id = promos.id";
    postgreDb.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};
const createTransactionItems = (body) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into transaction_items (products_id, quantity_product, transactions_id, promos_id, size) values ($1,$2,$3,$4,$5)";
    const { products_id, quantity_product, transactions_id, promos_id, size } =
      body;
    postgreDb.query(
      query,
      [products_id, quantity_product, transactions_id, promos_id, size],
      (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

const editTransactionItems = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update transaction_items set ";
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

const deleteTransactionItems = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from transaction_items where id = $1";

    postgreDb.query(query, [params.id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const transaction_itemsRepo = {
  getTransactionItems,
  createTransactionItems,
  editTransactionItems,
  deleteTransactionItems,
};

module.exports = transaction_itemsRepo;
