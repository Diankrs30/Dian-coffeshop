const postgreDb = require("../config/postgre");

const getTransactions = () => {
  return new Promise((resolve, reject) => {
    const query =
      "select transaction_items.id, products.product_name, transaction_items.quantity_product, transaction_items.size, products.price, transactions.subtotal, transactions.taxandfee, transactions.shipping_cost, transactions.total, transactions.address_detail, transactions.payment_method, users.phone_number from transaction_items left join products on transaction_items.products_id = products.id left join transactions on transaction_items.transactions_id = transactions.id left join promos on transaction_items.promos_id = promos.id left join users on transactions.user_id = users.id";
    postgreDb.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const createTransactions = (body) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into transactions (user_id, address_detail, subtotal, taxandfee, shipping_cost, total, payment_method, set_time) values ($1,$2,$3,$4,$5,$6,$7,$8)";

    const {
      user_id,
      address_detail,
      subtotal,
      taxandfee,
      shipping_cost,
      total,
      payment_method,
      set_time,
    } = body;
    postgreDb.query(
      query,
      [
        user_id,
        address_detail,
        subtotal,
        taxandfee,
        shipping_cost,
        total,
        payment_method,
        set_time,
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

const editTransactions = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update transactions set ";
    const values = [];
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id = $${idx + 2}`;
        values.push(body[key], params.id);
        return;
      }
      query += `${key} = $${idx + 1}, `;
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

const deleteTransactions = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from transactions where id = $1";

    postgreDb.query(query, [params.id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const transactionsRepo = {
  getTransactions,
  createTransactions,
  editTransactions,
  deleteTransactions,
};

module.exports = transactionsRepo;
