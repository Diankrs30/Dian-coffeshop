// import express
const express = require("express");

// import subrouter
const usersRouter = require("./usersRouter");
const productsRouter = require("./productsRouter");
const categoriesRouter = require("./categoriesRouter");
const promosRouter = require("./promosRouter");
const transactionsRouter = require("./transactionsRouter");
const transaction_itemsRouter = require("./transaction_itemsRouter");

// membuat router
const mainRouter = express.Router();

// membuat prefix
const prefix = "/dian-coffeeshop";

// connection subrouter to mainrouter
mainRouter.use(`${prefix}/users`, usersRouter);
mainRouter.use(`${prefix}/products`, productsRouter);
mainRouter.use(`${prefix}/categories`, categoriesRouter);
mainRouter.use(`${prefix}/promos`, promosRouter);
mainRouter.use(`${prefix}/transactions`, transactionsRouter);
mainRouter.use(`${prefix}/transaction_items`, transaction_itemsRouter);

// membuat http route
mainRouter.get("/", (req, res) => {
  // mengirim respon ke client
  res.json({
    msg: "Welcome",
  });
});

// export router
module.exports = mainRouter;
