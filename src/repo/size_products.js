const postgreDb = require("../config/postgre");

const getSizeProduct = () => {
  return new Promise((resolve, reject) => {
    const query = "select * from size_products";
    postgreDb.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const editSize = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update size_products set ";
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

const size_ProductsRepo = {
  editSize,
  getSizeProduct,
};

module.exports = size_ProductsRepo;
