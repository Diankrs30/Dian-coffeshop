// import db
const postgreDb = require("../config/postgre");

const getCategories = () => {
  return new Promise((resolve, reject) => {
    const query = "select id, category_name from categories";
    postgreDb.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const createCategory = (body) => {
  return new Promise((resolve, reject) => {
    const query = "insert into categories (category_name) values ($1)";
    const { category_name } = body;
    postgreDb.query(query, [category_name], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const editCategory = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update categories set ";
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

const deleteCategory = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from categories where id = $1";

    postgreDb.query(query, [params.id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const categoriesRepo = {
  getCategories,
  createCategory,
  editCategory,
  deleteCategory,
};

module.exports = categoriesRepo;
