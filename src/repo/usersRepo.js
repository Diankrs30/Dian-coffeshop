const postgreDb = require("../config/postgre");
const bcrypt = require("bcrypt");

const getUsers = (queryString, limit, offset) => {
  let query =
    "select id, display_name, email, image, first_name, last_name, date_of_birth, gender, phone_number, delivery_address, created_at, updated_at from users ";

  let firstWhere = true;
  if (queryString.search) {
    query += `${firstWhere ? "WHERE" : "AND"} lower(first_name) like lower('%${
      queryString.search
    }%') OR phone_number like '%${queryString.search}%'`;
    firstWhere = false;
  }
  if (queryString.gender && queryString.gender !== "") {
    query += `${firstWhere ? "WHERE" : "AND"} lower(gender) = lower('${
      queryString.gender
    }') `;
    firstWhere = false;
  }
  if (queryString.order && queryString.sort) {
    query += ` ORDER BY ${queryString.sort} ${queryString.order}`;
  }
  query += ` LIMIT ${limit} OFFSET ${offset}`;

  console.log(query);

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

const getTotalUser = (queryString) => {
  let query = "select COUNT(*) from users ";
  let firstWhere = true;
  if (queryString.search) {
    query += `${firstWhere ? "WHERE" : "AND"} lower(first_name) like lower('%${
      queryString.search
    }%') OR phone_number like '%${queryString.search}%' `;
    firstWhere = false;
  }
  if (queryString.gender && queryString.gender !== "") {
    query += `${firstWhere ? "WHERE" : "AND"} lower(gender) = lower('${
      queryString.gender
    }') `;
    firstWhere = false;
  }

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

const getUserProfile = (id) => {
  // console.log(id);
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

// const register = (body) => {
//   return new Promise((resolve, reject) => {
//     const { email, password_user, phone_number } = body;
//     bcrypt.hash(password_user, 10, (error, hashedPassword) => {
//       if (error) {
//         console.log(error);
//         return reject(error);
//       }
//       const query =
//         "insert into users (email, password_user, phone_number) values ($1,$2,$3) returning id";
//       postgreDb.query(
//         query,
//         [email, hashedPassword, phone_number],
//         (error, queryResult) => {
//           if (error) {
//             console.log(error);
//             return reject(error);
//           }
//           resolve(queryResult);
//         }
//       );
//     });
//   });
// };

const register = (body) => {
  return new Promise((resolve, reject) => {
    const { email, password_user, phone_number, pinActivation } = body;

    console.log(body);
    const query =
      "insert into users (email, password_user, phone_number, pin_activation) values ($1,$2,$3,$4) returning id";
    postgreDb.query(
      query,
      [email, password_user, phone_number, pinActivation],
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

const checkEmailAndPhone = (email, phone_number) => {
  return new Promise((resolve, reject) => {
    const query = "select * from users where email = $1 or phone_number = $2";
    postgreDb.query(query, [email, phone_number], (error, result) => {
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

const getUserByOTP = (OTP) => {
  return new Promise((resolve, reject) => {
    const query = "select * from users where otp = $1";
    postgreDb.query(query, [OTP], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
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

const updateOTPUser = (generateOTP, email) => {
  return new Promise((resolve, reject) => {
    const query = "update users set otp =$1 where email = $2";
    postgreDb.query(query, [generateOTP, email], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const updateUserByOTP = (password, OTP, email) => {
  return new Promise((resolve, reject) => {
    const query =
      "update users set password_user = $1, otp = $2 where email = $3";
    postgreDb.query(query, [password, OTP, email], (error, result) => {
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

const insertWhitelistToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = "insert into white_list_token (token) values ($1) ";
    postgreDb.query(query, [token], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const checkWhitelistToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = "select * from white_list_token where token = $1";
    postgreDb.query(query, [token], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const deleteWhitelistToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = "delete from white_list_token where token = $1 ";
    postgreDb.query(query, [token], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

// const getUserByPin = (pin) => {
//   return new Promise((resolve, reject) => {
//     const query = "select * from users where pin_activation = $1";

//     postgreDb.query(query, [pin], (error, result) => {
//       if (error) {
//         console.log(error);
//         return reject(error);
//       }
//       return resolve(result);
//     });
//   });
// };

// const updateStatus = (setData, id) => {
//   return new Promise((resolve, reject) => {
//     console.log(setData);
//     const query =
//       " update users set status = $1, pin_activation = $2 where id = $3";
//     postgreDb.query(
//       query,
//       [setData.status, setData.pin_activation, id],
//       (error, result) => {
//         if (error) {
//           console.log(error);
//           return reject(error);
//         }
//         resolve(result);
//       }
//     );
//   });
// };

const updateTokenFcmUser = (tokenFcm, email) => {
  return new Promise((resolve, reject) => {
    const query = "update users set token_fcm = $1 where email = $2";

    postgreDb.query(query, [tokenFcm, email], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const usersRepo = {
  getUsers,
  getTotalUser,
  getUserProfile,
  getUserByOTP,
  getPassword,
  register,
  checkEmailAndPhone,
  editUsers,
  updateUserByOTP,
  editPassword,
  updateOTPUser,
  insertWhitelistToken,
  checkWhitelistToken,
  deleteWhitelistToken,
  updateTokenFcmUser,
  // getUserByPin,
  // updateStatus,
};

module.exports = usersRepo;
