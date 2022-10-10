// import express
const express = require("express");
// import db
const postgreDb = require("../config/postgre");
// membuat router
const categoriesRouter = express.Router();
// import controller
const { get, create, edit, drop } = require("../controllers/categories");
// endpoint
categoriesRouter.get("/", get);
categoriesRouter.post("/", create);
categoriesRouter.patch("/:id", edit);
categoriesRouter.delete("/:id", drop);
// export router
module.exports = categoriesRouter;
