// import express
const express = require("express");

// import subrouter
const usersRouter = require("./usersRouter");
const authRouter = require("./authRouter");
const productsRouter = require("./productsRouter");
const categoriesRouter = require("./categoriesRouter");
const promosRouter = require("./promosRouter");
const transactionsRouter = require("./transactionsRouter");
const size_productsRouter = require("./size_productsRouter");

// membuat router
const mainRouter = express.Router();

// membuat prefix
const prefix = "/dian-coffeeshop";

// connection subrouter to mainrouter
mainRouter.use(`${prefix}/users`, usersRouter);
mainRouter.use(`${prefix}/auth`, authRouter);
mainRouter.use(`${prefix}/products`, productsRouter);
mainRouter.use(`${prefix}/categories`, categoriesRouter);
mainRouter.use(`${prefix}/promos`, promosRouter);
mainRouter.use(`${prefix}/size_products`, size_productsRouter);
mainRouter.use(`${prefix}/transactions`, transactionsRouter);

// membuat http route
mainRouter.get("/", (req, res) => {
  // mengirim respon ke client
  res.json({
    msg: "Welcome",
  });
});

// export router
module.exports = mainRouter;
