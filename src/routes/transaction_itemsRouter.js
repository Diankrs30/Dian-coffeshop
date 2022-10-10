// import express
const express = require("express");
// import db
const postgreDb = require("../config/postgre");
// membuat router
const transaction_itemsRouter = express.Router();
// import transactionController
const { get, create, edit, drop } = require("../controllers/transaction_items");
// endpoint
transaction_itemsRouter.get("/get_transaction_items/", get);
transaction_itemsRouter.post("/create_transaction_items/", create);
transaction_itemsRouter.patch("/edit_transaction_items/:id", edit);
transaction_itemsRouter.delete("/delete_transaction_items/:id", drop);

// export router
module.exports = transaction_itemsRouter;
