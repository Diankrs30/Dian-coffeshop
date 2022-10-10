// import express
const express = require("express");
// import db
const postgreDb = require("../config/postgre");
// membuat router
const promosRouter = express.Router();
// import transactionController
const { get, create, edit, drop } = require("../controllers/promos");
// endpoint
promosRouter.get("/get_promos/", get);
promosRouter.post("/create_promo/", create);
promosRouter.patch("/edit_promo/:id", edit);
promosRouter.delete("/delete_promo/:id", drop);

// export router
module.exports = promosRouter;
