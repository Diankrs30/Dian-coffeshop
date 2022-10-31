const express = require("express");
const postgreDb = require("../config/postgre");
const productsRouter = express.Router();
const { isLogin } = require("../middleware/isLogin");
const validate = require("../middleware/validate");
const isAllowed = require("../middleware/isAllowed");
const { fileUpload } = require("../middleware/upload");
const {
  get,
  getProductDetail,
  create,
  edit,
  drop,
} = require("../controllers/productsController");
const { memoryUpload, errorHandler } = require("../middleware/uploadCD");
const cloudinaryUploader = require("../middleware/cloudinary");

// endpoint
productsRouter.get("/get_products/", get);
productsRouter.get("/product_detail/:id", isLogin, getProductDetail);
productsRouter.post(
  "/create_product/",
  isLogin,
  isAllowed("admin"),
  // imagesUpload.single("image"),
  fileUpload,
  validate.body(
    "product_name",
    "product_description",
    "price",
    "image",
    "strat_delivery",
    "end_delivery",
    "stock_product",
    "total_selling",
    "category_id"
  ),
  create
);
productsRouter.patch(
  "/edit_products/:id",
  isLogin,
  isAllowed("admin"),
  // imagesUpload.single("image"),
  fileUpload,
  validate.body(
    "product_name",
    "product_description",
    "price",
    "image",
    "strat_delivery",
    "end_delivery",
    "stock_product",
    "total_selling",
    "category_id"
  ),
  edit
);
productsRouter.delete(
  "/delete_products/:id",
  isLogin,
  isAllowed("admin"),
  drop
);
productsRouter.post(
  "/test",
  (req, res, next) =>
    memoryUpload.single("image")(req, res, (err) => {
      errorHandler(err, res, next);
    }),
  cloudinaryUploader,
  (req, res) => {
    console.log(req.file);
    res.status(204).send();
  }
);
// export router
module.exports = productsRouter;
