const postgreDb = require("../config/postgre");

const getAllTransactions = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select transaction.id, users.display_name, products.product_name, products.price, size_products.size_product, transaction_product_size.quantity, transaction_product_size.total_price, transaction.tax_and_fee, transaction.shipping_cost, transaction.address_detail, users.phone_number, payment_methods.payment_method, delivery_methods.method_delivery, transaction.set_time, transaction.status_order from transaction_product_size left join transaction on transaction_product_size.transactions_id = transaction.id left join products on transaction_product_size.products_id = products.id left join size_products on transaction_product_size.size_products_id = size_products.id left join users on transaction.user_id = users.id left join payment_methods on transaction.payment_methods_id = payment_methods.id left join delivery_methods on transaction.delivery_methods_id = delivery_methods.id where transaction.id = $1";
    // "select transaction_product_size.id, products.product_name, products.price, transaction.status_order from transaction join transaction_product_size on transaction_product_size.transactions_id = transaction.id join products on transaction_product_size.products_id = products.id where transaction_product_size.id = $1 order by transaction_product_size.id";
    // console.log(query);
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getTransactionByUserId = (user_id, limit, offset) => {
  console.log(user_id);
  return new Promise((resolve, reject) => {
    let query =
      "select transaction_product_size.id, transaction_product_size.total_price, products.product_name, products.image, transaction.status_order from transaction join transaction_product_size on transaction_product_size.transactions_id = transaction.id join products on transaction_product_size.products_id = products.id where transaction_product_size.user_id = $1 order by transaction_product_size.id";

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    postgreDb.query(query, [user_id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getTotalHistory = (user_id) => {
  console.log(user_id);
  return new Promise((resolve, reject) => {
    const query =
      "select COUNT(*) from transaction join transaction_product_size on transaction_product_size.transactions_id = transaction.id join products on transaction_product_size.products_id = products.id where transaction_product_size.user_id = $1";

    postgreDb.query(query, [user_id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getTransactionPopuler = () => {
  return new Promise((resolve, reject) => {
    const query =
      "select p.id, p.product_name, p.price, sum(tps.quantity) as total_order from transaction_product_size tps join products p on p.id = tps.products_id group by p.id, p.product_name, p.price order by total_order desc ";

    postgreDb.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const createTransactions = (body, user_id) => {
  console.log(body);
  return new Promise((resolve, reject) => {
    const query =
      "insert into transaction (user_id, address_detail, phone_number, payment_methods_id, delivery_methods_id, sub_total, tax_and_fee, shipping_cost, set_time, status_order) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning id";

    const {
      address_detail,
      phone_number,
      payment_method,
      delivery_methods_id,
      subtotal,
      tax_and_fee,
      shipping_cost,
      set_time,
      status_order,
    } = body;
    postgreDb.query(
      query,
      [
        user_id,
        address_detail,
        phone_number,
        payment_method,
        delivery_methods_id,
        subtotal,
        tax_and_fee,
        shipping_cost,
        set_time,
        status_order,
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

const createTransactionsMidtrans = (body, payment_id, user_id) => {
  console.log(body);
  return new Promise((resolve, reject) => {
    const query =
      "insert into transaction (user_id, address_detail, phone_number, payment_methods_id, delivery_methods_id, sub_total, tax_and_fee, shipping_cost, set_time, status_order, payment_id, bank_account, total_payment) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) returning id";

    const {
      address_detail,
      phone_number,
      payment_method,
      delivery_methods_id,
      subtotal,
      tax_and_fee,
      shipping_cost,
      set_time,
      status_order,
      bank_account,
      total_payment,
    } = body;
    postgreDb.query(
      query,
      [
        user_id,
        address_detail,
        phone_number,
        payment_method,
        delivery_methods_id,
        subtotal,
        tax_and_fee,
        shipping_cost,
        set_time,
        status_order,
        payment_id,
        bank_account,
        total_payment,
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

const createTransactionsItems = (
  body,
  transactions_id,
  total_price,
  user_id
) => {
  console.log(transactions_id);
  return new Promise((resolve, reject) => {
    const query =
      "insert into transaction_product_size (transactions_id, user_id, products_id, size_products_id, quantity, total_price) values ($1,$2,$3,$4,$5,$6)";

    const { products_id, size_products_id, quantity } = body;
    postgreDb.query(
      query,
      [
        transactions_id,
        user_id,
        products_id,
        size_products_id,
        quantity,
        total_price,
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
const editTransaction = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update transaction set ";
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
const updatePayment = (status_order, status_payment, payment_id) => {
  return new Promise((resolve, reject) => {
    const query =
      "update transaction set status_order = $1, status_payment = $2 where payment_id =$3";

    postgreDb.query(
      query,
      [status_order, status_payment, payment_id],
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
const deleteTransactions = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from transaction where id = $1";

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
  getAllTransactions,
  getTransactionByUserId,
  getTotalHistory,
  getTransactionPopuler,
  createTransactions,
  createTransactionsItems,
  editTransaction,
  deleteTransactions,
  createTransactionsMidtrans,
  updatePayment,
};

module.exports = transactionsRepo;
