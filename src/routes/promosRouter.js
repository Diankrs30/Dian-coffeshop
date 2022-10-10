// import express
const express = require("express");
// import db
const postgreDb = require("../config/postgre");
// membuat router
const promosRouter = express.Router();
// import transactionController
const { get, create, edit, drop } = require("../controllers/promos");
// endpoint
promosRouter.get("/", get);
promosRouter.post("/", create);
promosRouter.patch("/:id", edit);
promosRouter.delete("/:id", drop);

// export router
module.exports = promosRouter;
