const usersRepo = require("../repo/usersRepo");
const response = require("../helper/response");
const bcrypt = require("bcrypt");
const { sendMail } = require("../helper/mail");

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

      const passwordHash = await bcrypt.hash(req.body.password_user, 10);

      // const pinActivation = Math.floor(Math.random() * 1000000);
      // console.log(pinActivation);

      const setData = {
        email: req.body.email,
        password_user: passwordHash,
        phone_number: req.body.phone_number,
        // pinActivation: pinActivation,
      };

      const result = await usersRepo.register(setData);

      // const setSendEmail = {
      //   to: req.body.email,
      //   subject: "Email Verification !",
      //   name: req.body.first_name,
      //   // template: "verificationEmail.html",
      //   template: "verificationEmail.html",
      //   buttonUrl: `https://10.0.3.2:8070/Login/${setData.pinActivation}`,
      // };

      // await sendMail(setSendEmail);

      return response(res, {
        status: 200,
        data: {
          ...result.rows[0],
          email: req.body.email,
          phone_number: req.body.phone_number,
        },
        message:
          // "Register success! Please check your email to verify your account.",
          "Register succes!",
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
  // updateStatus: async (req, res) => {
  //   try {
  //     const { key } = req.params;
  //     console.log("key", key);
  //     const checkPin = await usersRepo.getUserByPin(key);

  //     console.log(">>>>>", checkPin.rows);
  //     if (checkPin.rows.length === 0) {
  //       return response(res, {
  //         status: 404,
  //         message: "User not found",
  //       });
  //     }

  //     const id = checkPin.rows[0].id;
  //     // console.log(id);
  //     const setData = {
  //       status: "active",
  //       pin_activation: null,
  //     };

  //     await usersRepo.updateStatus(setData, id);
  //     return response(res, {
  //       status: 200,
  //       message: "Success! Active account.",
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return response(res, {
  //       error,
  //       status: 500,
  //       message: "Internal server error",
  //     });
  //   }
  // },
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
  forgotPassword: async (req, res) => {
    try {
      let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
      if (regex.test(req.body.email) === false) {
        return response(res, {
          status: 400,
          message: "Format email is worng",
        });
      }
      const checkEmail = await usersRepo.checkEmailAndPhone(req.body.email);
      if (checkEmail.rows.length === 0) {
        return response(res, { status: 404, message: "Email not found" });
      }
      // generate OTP
      const generateOTP = Math.floor(Math.random() * 1000000);
      console.log(generateOTP);

      const result = await usersRepo.updateOTPUser(generateOTP, req.body.email);

      const setSendEmail = {
        to: req.body.email,
        subject: " Reset Pasword",
        name: checkEmail.rows[0].email,
        template: "forgotEmail.html",
        otp: `${generateOTP}`,
      };

      const response = await sendMail(setSendEmail);
      console.log(response);

      return response(res, {
        status: 200,
        message: "Please check your email to reset your password!",
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
  resetPassword: async (req, res) => {
    const OTP = req.body.otp;
    const password = req.body.password;
    try {
      const result = await usersRepo.getUserByOTP(OTP, password);
      if (result.rows.length === 0) {
        return response(res, {
          status: 400,
          message: "OTP is worng",
        });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const email = result.rows[0].email;
      const setOTP = null;
      console.log(email);
      console.log(passwordHash);
      const update = await usersRepo.updateUserByOTP(
        passwordHash,
        setOTP,
        email
      );
      return response(res, {
        status: 200,
        message: "Password has been reset",
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
