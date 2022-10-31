const response = require("../helper/response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersRepo = require("../repo/usersRepo");
const { token } = require("morgan");
const { Client } = require("pg");
const client = require("../config/redis");

const auth = {
  login: async (req, res) => {
    try {
      let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
      if (regex.test(req.body.email) === false) {
        return response(res, {
          status: 400,
          message: "Format email is wrong",
        });
      }
      const checkEmail = await usersRepo.checkEmailAndPhone(req.body.email);
      //   console.log(checkEmail.rows);
      if (checkEmail.rows.length === 0) {
        return response(res, {
          status: 401,
          message: "Email/Password is Wrong",
        });
      }
      const hashedPassword = checkEmail.rows[0].password_user;
      //   console.log(hashedPassword);
      const checkPassword = await bcrypt.compare(
        req.body.password,
        hashedPassword
      );
      if (checkPassword === false) {
        return response(res, {
          status: 401,
          message: "Email/Password is Wrong",
        });
      }
      //   console.log(checkPassword);
      const payload = {
        user_id: checkEmail.rows[0].id,
        name: checkEmail.rows[0].display_name,
        email: checkEmail.rows[0].email,
        role: checkEmail.rows[0].role,
      };
      const token = await jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "60m",
        issuer: process.env.ISSUER,
      });
      // console.log(token);
      await usersRepo.insertWhitelistToken(token);
      return response(res, {
        status: 200,
        data: { name: payload.email, role: payload.role, token },
        message: "Login success",
      });

      // client.on("connect", function () {
      //   console.log("Redis plugged in.");
      // });
      // await client.connect();
      // await client.set();
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
  logout: async (req, res) => {
    try {
      const token = req.header("x-access-token");
      // console.log(token);
      const user = await usersRepo.deleteWhitelistToken(token);
      response(res, { status: 200, message: "Logout success" });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
};
module.exports = auth;
