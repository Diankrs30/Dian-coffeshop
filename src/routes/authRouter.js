const express = require("express");
const authRouter = express.Router();
const validate = require("../middleware/validate");
const { login } = require("../controllers/auth");

authRouter.post("/login", validate.loginBody, login);
// authRouter.delete("/", logout);

// export router
module.exports = authRouter;
