const express = require("express");
const postgreDb = require("../config/postgre");
const promosRouter = express.Router();
const isLogin = require("../middleware/isLogin");
const {
  get,
  getDetailPromo,
  create,
  edit,
  drop,
} = require("../controllers/promos");
const isAllowed = require("../middleware/isAllowed");

// endpoint
promosRouter.get("/get_promos/", get);
promosRouter.get("/detail_promo/:id", isLogin(), getDetailPromo);
promosRouter.post("/create_promo/", isLogin(), isAllowed("admin"), create);
promosRouter.patch("/edit_promo/:id", isLogin(), isAllowed("admin"), edit);
promosRouter.delete("/delete_promo/:id", isLogin(), isAllowed("admin"), drop);

// export router
module.exports = promosRouter;
