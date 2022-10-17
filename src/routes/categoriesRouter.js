const express = require("express");
const postgreDb = require("../config/postgre");
const categoriesRouter = express.Router();
const { get } = require("../controllers/categories");

// endpoint
categoriesRouter.get("/", get);

module.exports = categoriesRouter;
