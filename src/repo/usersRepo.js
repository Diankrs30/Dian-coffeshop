// import database
const postgreDb = require("../config/postgre");

const getUsers = () => {
  return new Promise((resolve, reject) => {
    const query =
      "select id, email, password_user, phone_number, delivery_address, display_name, first_name, last_name, date_of_birth, gender, image from users";
    postgreDb.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const createUsers = (body) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into users (email, password_user, phone_number, delivery_address, display_name, first_name, last_name, date_of_birth, gender, image) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
    // akses body yang sudah di parsing
    const {
      email,
      password_user,
      phone_number,
      delivery_address,
      display_name,
      first_name,
      last_name,
      date_of_birth,
      gender,
      image,
    } = body;
    postgreDb.query(
      query,
      [
        email,
        password_user,
        phone_number,
        delivery_address,
        display_name,
        first_name,
        last_name,
        date_of_birth,
        gender,
        image,
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

const editUsers = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update users set ";
    const values = [];
    // update secara dinamis untuk display_name, first_name, last_name
    // logika ini dibuat dg mengasumsikan ada middleware validasi (untuk menghilangkan property object dari body yang tidak diinginkan)
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id = $${idx + 2}`;
        values.push(body[key], params.id);
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

const usersRepo = { getUsers, createUsers, editUsers };

module.exports = usersRepo;
