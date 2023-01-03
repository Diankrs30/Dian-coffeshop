const express = require("express");
const notifRouter = express.Router();
const notifController = require("../controllers/notifController");

notifRouter.post("/", notifController.notifSend);

module.exports = notifRouter;
