const express = require("express");
const postgreDb = require("../config/postgre");
const usersRouter = express.Router();
const { isLogin } = require("../middleware/isLogin");
const isAllowed = require("../middleware/isAllowed");
const validate = require("../middleware/validate");
// const { fileUpload } = require("../middleware/upload");
const { memoryStorageUpload } = require("../middleware/uploadMemostorage");
const { uploader } = require("../middleware/cloudinary");
const {
  get,
  getProfile,
  register,
  editPassword,
  resetPassword,
  forgotPassword,
  editUser,
} = require("../controllers/usersController");
const { checkToken } = require("../middleware/isLogin");

usersRouter.get("/get_users/", isLogin, isAllowed("admin"), get);
usersRouter.get(
  "/profile_user/",
  isLogin,
  isAllowed("user", "admin"),
  getProfile
);
usersRouter.post("/register/", validate.registerBody, register);
usersRouter.patch(
  "/account/",
  isLogin,
  isAllowed("user", "admin"),
  editPassword
);
usersRouter.patch("/resetpassword", resetPassword);
usersRouter.post("/forgotpassword", forgotPassword);
usersRouter.patch(
  "/profile/",
  isLogin,
  isAllowed("user"),
  // fileUpload,
  memoryStorageUpload,
  uploader,
  validate.body(
    "delivery_address",
    "display_name",
    "first_name",
    "last_name",
    "date_of_birth",
    "gender",
    "image"
  ),
  editUser
);

module.exports = usersRouter;
