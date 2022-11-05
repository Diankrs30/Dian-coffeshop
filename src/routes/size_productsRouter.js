const express = require("express");
const postgreDb = require("../config/postgre");
const size_productsRouter = express.Router();
const { edit, get } = require("../controllers/size_products");

size_productsRouter.patch("/:id", edit);
size_productsRouter.get("/", get);

module.exports = size_productsRouter;
