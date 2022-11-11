const express = require("express");
const authRouter = express.Router();
const validate = require("../middleware/validate");
const { login, logout } = require("../controllers/auth");
const { isLogin } = require("../middleware/isLogin");

authRouter.post("/login", validate.loginBody, login);
authRouter.delete("/logout", isLogin, logout);

// export router
module.exports = authRouter;
