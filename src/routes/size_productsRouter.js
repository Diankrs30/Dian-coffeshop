const express = require("express");
const postgreDb = require("../config/postgre");
const size_productsRouter = express.Router();
const { edit } = require("../controllers/size_products");

size_productsRouter.patch("/:id", edit);

module.exports = size_productsRouter;
