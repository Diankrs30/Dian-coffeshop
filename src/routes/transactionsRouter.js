// import express
const express = require("express");
// import db
const postgreDb = require("../config/postgre");
// membuat router
const transactionsRouter = express.Router();
const { isLogin } = require("../middleware/isLogin");
const isAllowed = require("../middleware/isAllowed");
const validate = require("../middleware/validate");
const {
  get,
  getHistory,
  getPopuler,
  create,
  edit,
  drop,
} = require("../controllers/transactions");
// endpoint
transactionsRouter.get("/detail_transaction/:id", isLogin, get);
transactionsRouter.get("/history/", isLogin, isAllowed("user"), getHistory);
transactionsRouter.get("/populer/", getPopuler);
transactionsRouter.post(
  "/create_transactions/",
  isLogin,
  isAllowed("user", "admin"),
  validate.body(
    "product_item",
    "subtotal",
    "tax_and_fee",
    "shipping_cost",
    "address_detail",
    "phone_number",
    "payment_method",
    "delivery_methods_id",
    "set_time",
    "status_order"
  ),
  create
);
transactionsRouter.patch(
  "/edit_transaction/:id",
  isLogin,
  isAllowed("admin"),
  validate.body(
    "product_item",
    "subtotal",
    "tax_and_fee",
    "shipping_cost",
    "address_detail",
    "phone_number",
    "payment_method",
    "delivery_methods_id",
    "set_time",
    "status_order"
  ),
  edit
);
transactionsRouter.delete(
  "/delete_history/:id",
  isLogin,
  isAllowed("user"),
  drop
);

// export router
module.exports = transactionsRouter;
