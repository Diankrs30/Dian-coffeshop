// import express
const express = require("express");
// import db
const postgreDb = require("../config/postgre");
// membuat router
const transactionsRouter = express.Router();
const isLogin = require("../middleware/isLogin");
const isAllowed = require("../middleware/isAllowed");
// import paymentController
const {
  get,
  getHistory,
  getPopuler,
  create,
  drop,
} = require("../controllers/transactions");
// endpoint
transactionsRouter.get("/detail_transaction/:id", isLogin(), get);
transactionsRouter.get("/history/", isLogin(), isAllowed("user"), getHistory);
transactionsRouter.get("/populer/", getPopuler);
transactionsRouter.post("/create_transactions/", isLogin(), create);
transactionsRouter.delete(
  "/delete_history/:id",
  isLogin(),
  isAllowed("user"),
  drop
);

// export router
module.exports = transactionsRouter;
