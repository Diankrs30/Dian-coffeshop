// import express
const express = require("express");
// import db
const postgreDb = require("../config/postgre");
// membuat router
const productsRouter = express.Router();
// import productsController
const {
  get,
  create,
  edit,
  drop,
} = require("../controllers/productsController");

// endpoint
productsRouter.get("/get_products/", get);
productsRouter.post("/create_products/", create);
productsRouter.patch("/edit_products/:id", edit);
productsRouter.delete("/delete_products/:id", drop);
// export router
module.exports = productsRouter;
