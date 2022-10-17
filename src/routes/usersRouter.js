const express = require("express");
const postgreDb = require("../config/postgre");
const usersRouter = express.Router();
const isLogin = require("../middleware/isLogin");
const isAllowed = require("../middleware/isAllowed");
const validate = require("../middleware/validate");
const imagesUpload = require("../middleware/upload");
const {
  get,
  getProfile,
  register,
  editPassword,
  editUser,
} = require("../controllers/usersController");

usersRouter.get("/get_users/", isLogin(), isAllowed("admin"), get);
usersRouter.get("/profile_user/", isLogin(), isAllowed("user"), getProfile);
usersRouter.post("/register/", validate.registerBody, register);
usersRouter.patch("/account/", isLogin(), isAllowed("user"), editPassword);
usersRouter.patch(
  "/profile/",
  isLogin(),
  isAllowed("user"),
  imagesUpload.single("image"),
  validate.body(),
  editUser
);

module.exports = usersRouter;
