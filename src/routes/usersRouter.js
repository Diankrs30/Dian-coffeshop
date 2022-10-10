// import express
const express = require("express");
// import db
const postgreDb = require("../config/postgre");
// membuat router
const usersRouter = express.Router();
// import userController
const { get, create, edit } = require("../controllers/usersController");
// http://localhost:8070/dian-coffeeshop/users (endpoint: users)
usersRouter.get("/get_users/", get);
usersRouter.post("/create_user/", create);
usersRouter.patch("/edit_user/:id", edit);
// export router
module.exports = usersRouter;
