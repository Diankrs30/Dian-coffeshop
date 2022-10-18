const express = require("express");
const authRouter = express.Router();
const validate = require("../middleware/validate");
const { login, logout } = require("../controllers/auth");

authRouter.post("/login", validate.loginBody, login);
authRouter.delete("/logout", logout);

// export router
module.exports = authRouter;
