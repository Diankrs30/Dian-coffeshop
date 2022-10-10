// import express
const express = require("express");
// import db
const postgreDb = require("../config/postgre");
// membuat router
const transactionsRouter = express.Router();
// import paymentController
const { get, create, edit, drop } = require("../controllers/transactions");
// endpoint
transactionsRouter.get("/get_transactions/", get);
transactionsRouter.post("/create_transactions/", create);
transactionsRouter.patch("/edit_transactions/:id", edit);
transactionsRouter.delete("/delete_transactions/:id", drop);

// export router
module.exports = transactionsRouter;
