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

const categoriesRepo = {
  getCategories,
};

module.exports = categoriesRepo;
