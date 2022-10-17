const postgreDb = require("../config/postgre");
const bcrypt = require("bcrypt");

const getUsers = () => {
  return new Promise((resolve, reject) => {
    const query =
      "select id, display_name, first_name, last_name, date_of_birth, gender, phone_number, delivery_address, created_at, updated_at from users";

    postgreDb.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getUserProfile = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select id, image, display_name, email, phone_number, delivery_address, first_name, last_name, date_of_birth, gender from users where id = $1";
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const register = (body) => {
  return new Promise((resolve, reject) => {
    const { email, password_user, phone_number } = body;
    bcrypt.hash(password_user, 10, (error, hashedPassword) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      const query =
        "insert into users (email, password_user, phone_number) values ($1,$2,$3) returning id";
      postgreDb.query(
        query,
        [email, hashedPassword, phone_number],
        (error, queryResult) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          resolve(queryResult);
        }
      );
    });
  });
};

const checkEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = "select * from users where email = $1";
    postgreDb.query(query, [email], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const getPassword = (id) => {
  return new Promise((resolve, reject) => {
    const query = "select * from users where id = $1";
    console.log(query);
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
      console.log(result);
    });
  });
};

const editPassword = (id, password) => {
  return new Promise((resolve, reject) => {
    const query = " update users set password_user = $1 where id = $2";
    postgreDb.query(query, [password, id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const editUsers = (body, id) => {
  return new Promise((resolve, reject) => {
    let query = "update users set ";
    const values = [];
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id = $${idx + 2}`;
        values.push(body[key], id);
        return;
      }
      query += `${key} = $${idx + 1}, `;
      values.push(body[key]);
    });
    //   res.json({ query, values });
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

const usersRepo = {
  getUsers,
  getUserProfile,
  register,
  checkEmail,
  getPassword,
  editUsers,
  editPassword,
};

module.exports = usersRepo;
