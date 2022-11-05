// import db
const postgreDb = require("../config/postgre");

const getDeliveryMethod = () => {
  return new Promise((resolve, reject) => {
    const query = "select * from delivery_methods";
    postgreDb.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const deliveryMethodRepo = {
  getDeliveryMethod,
};

module.exports = deliveryMethodRepo;
