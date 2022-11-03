const express = require("express");
const postgreDb = require("../config/postgre");
const promosRouter = express.Router();
const { isLogin } = require("../middleware/isLogin");
const isAllowed = require("../middleware/isAllowed");
const validate = require("../middleware/validate");
const { memoryStorageUpload } = require("../middleware/uploadMemostorage");
const { uploaderPromo } = require("../middleware/cloudinary");
const {
  get,
  getDetailPromo,
  create,
  edit,
  drop,
} = require("../controllers/promos");

// endpoint
promosRouter.get("/get_promos/", get);
promosRouter.get("/detail_promo/:id", isLogin, getDetailPromo);
promosRouter.post(
  "/create_promo/",
  isLogin,
  isAllowed("admin"),
  memoryStorageUpload,
  validate.body(
    "promo_description",
    "discount",
    "start_discount",
    "end_discount",
    "code_promo",
    "image",
    "products_id"
  ),
  create
);
promosRouter.patch(
  "/edit_promo/:id",
  isLogin,
  isAllowed("admin"),
  memoryStorageUpload,
  uploaderPromo,
  validate.body(
    "promo_description",
    "discount",
    "start_discount",
    "end_discount",
    "code_promo",
    "image",
    "product_id"
  ),
  edit
);
promosRouter.delete("/delete_promo/:id", isLogin, isAllowed("admin"), drop);

// export router
module.exports = promosRouter;
