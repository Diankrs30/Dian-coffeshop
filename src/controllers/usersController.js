const usersRepo = require("../repo/usersRepo");
const response = require("../helper/response");
const bcrypt = require("bcrypt");

const userController = {
  get: async (req, res) => {
    try {
      let queryParams = req.query;
      console.log(queryParams);
      let page = Number(queryParams.page);
      const limit = Number(queryParams.limit);
      const offset = (page - 1) * limit;

      const result = await usersRepo.getUsers(queryParams, limit, offset);
      console.log(result.rows);
      const totalData = await usersRepo.getTotalUser(queryParams);
      const totalPage = Math.ceil(totalData.rows[0].count / limit);
      const path = `http://${
        req.get("host") + req.baseUrl + req.route.path
      }?page`;
      // const path = `${req.baseUrl + req.route.path}?page`;

      page = Number(page);
      let queryString = "";
      Object.keys(queryParams).forEach((key) => {
        if (key !== "page" && key !== "path") {
          queryString += `&${key}=${queryParams[key]}`;
        }
      });
      const prevLink = page !== 1 ? `${path}=${page - 1}${queryString}` : null;
      const nextLink =
        page !== totalPage ? `${path}=${page + 1}${queryString}` : null;

      const meta = {
        totalData: Number(totalData.rows[0].count),
        totalPage: totalPage,
        next: nextLink,
        prev: prevLink,
      };

      return response(res, {
        status: 200,
        data: result.rows,
        meta: meta,
        message: "Get all success",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
  getProfile: async (req, res) => {
    try {
      // console.log(req.userPayload);
      const result = await usersRepo.getUserProfile(req.userPayload.user_id);
      return response(res, {
        status: 200,
        data: result.rows,
        message: "Get success",
      });
    } catch (error) {
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
  register: async (req, res) => {
    try {
      let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
      if (regex.test(req.body.email) === false) {
        return response(res, {
          status: 400,
          message: "Format email is wrong",
        });
      }
      const checkEmailAndPhone = await usersRepo.checkEmailAndPhone(
        req.body.email,
        req.body.phone_number
      );
      console.log(checkEmailAndPhone.rows.length);
      if (checkEmailAndPhone.rows.length > 0) {
        return response(res, {
          status: 400,
          message: "Email/phone number has been registered",
        });
      }

      const result = await usersRepo.register(req.body);
      return response(res, {
        status: 200,
        data: {
          ...result.rows[0],
          email: req.body.email,
          phone_number: req.body.phone_number,
        },
        message: "Register success",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
  editPassword: async (req, res) => {
    const body = req.body;
    // console.log(req.userPayload.user_id);
    const id = req.userPayload.user_id;
    try {
      // console.log(id);
      const checkPwd = await usersRepo.getPassword(id);
      // console.log(checkPwd.rows[0]);
      const isValid = await bcrypt.compare(
        body.old_password,
        checkPwd.rows[0].password_user
      );
      console.log(isValid);
      if (isValid === false) {
        return response(res, { status: 403, message: "Old password is wrong" });
      }
      const password = await bcrypt.hash(body.new_password, 10);
      await usersRepo.editPassword(id, password);
      return response(res, {
        status: 200,
        message: "Password has been changed",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
  editUser: async (req, res) => {
    // console.log(req.userPayload.user_id);
    try {
      const id = req.userPayload.user_id;
      let body = req.body;
      console.log(req.file);
      if (req.file) {
        // const image = `/images/${req.file.filename}`;
        const image = `${req.file.secure_url}`;
        body = { ...body, image };
      }
      const result = await usersRepo.editUsers(body, id);
      return response(res, {
        status: 200,
        data: { id, ...body },
        message: "Edit success",
      });
    } catch (error) {
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
};

module.exports = userController;
