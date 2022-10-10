// import usersRepo
const usersRepo = require("../repo/usersRepo");
const response = require("../helper/response");

// // bentuk pertama
// //  controller get
// const get = async (req, res) => {
//   try {
//     const query =
//       "select id, email, password_user, phone_number, delivery_address, display_name, first_name, last_name, date_of_birth, gender, image from users";
//     const result = await postgreDb.query(query);
//     res.status(200).json({
//       result: result.rows,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       msg: "Server internal error",
//     });
//   }
// };
// // controller post
// const create = (req, res) => {
//   const query =
//     "insert into users (email, password_user, phone_number, delivery_address, display_name, first_name, last_name, date_of_birth, gender, image) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
//   // akses body yang sudah di parsing
//   const {
//     email,
//     password_user,
//     phone_number,
//     delivery_address,
//     display_name,
//     first_name,
//     last_name,
//     date_of_birth,
//     gender,
//     image,
//   } = req.body;
//   postgreDb.query(
//     query,
//     [
//       email,
//       password_user,
//       phone_number,
//       delivery_address,
//       display_name,
//       first_name,
//       last_name,
//       date_of_birth,
//       gender,
//       image,
//     ],
//     (error, queryResult) => {
//       if (error) {
//         console.log(error);
//         return res.status(500).json({ msg: "Internal server error." });
//       }
//       res.status(201).json({
//         result: queryResult,
//       });
//     }
//   );
// };
// // controller patch
// const edit = (req, res) => {
//   let query = "update users set ";
//   const values = [];
//   // update secara dinamis untuk display_name, first_name, last_name
//   // logika ini dibuat dg mengasumsikan ada middleware validasi (untuk menghilangkan property object dari body yang tidak diinginkan)
//   Object.keys(req.body).forEach((key, idx, array) => {
//     if (idx === array.length - 1) {
//       query += `${key} = $${idx + 1} where id = $${idx + 2}`;
//       values.push(req.body[key], req.params.id);
//       return;
//     }
//     query += `${key} = $${idx + 1}, `;
//     values.push(req.body[key]);
//   });
//   //   res.json({ query, values });
//   postgreDb
//     .query(query, values)
//     .then((response) => {
//       res.status(200).json({ result: response });
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).json({ msg: "Internal server error" });
//     });
// };

// bentuk kedua lebih efisien
const userController = {
  get: async (req, res) => {
    try {
      const result = await usersRepo.getUsers();
      // res.status(200).json({
      //   result: response.rows,
      // });
      return response(res, {
        status: 200,
        data: result.rows,
        message: "Get all success",
      });
    } catch (error) {
      // res.status(500).json({
      //   msg: "Server internal error",
      // });
      // console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal service error",
      });
    }
  },
  create: async (req, res) => {
    try {
      const result = await usersRepo.createUsers(req.body);
      return response(res, {
        status: 200,
        data: result,
        message: "Create success",
      });
    } catch (error) {
      return response(res, {
        error,
        status: 500,
        message: "Internal service error",
      });
    }
  },
  edit: async (req, res) => {
    try {
      const result = await usersRepo.editUsers(req.body, req.params);
      return response(res, {
        status: 200,
        data: result,
        message: "Edit success",
      });
    } catch (error) {
      return response(res, {
        error,
        status: 500,
        message: "Internal service error",
      });
    }
  },
};

module.exports = userController;
