const express = require("express");
const postgreDb = require("../config/postgre");
const deliveryMethodsRouter = express.Router();
const { get } = require("../controllers/deliveryMethods");

// endpoint
deliveryMethodsRouter.get("/", get);

module.exports = deliveryMethodsRouter;
