const size_ProductsRepo = require("../repo/size_products");
const response = require("../helper/response");

const size_productsController = {
  edit: async (req, res) => {
    try {
      const result = await size_ProductsRepo.editSize(req.body, req.params);
      return response(res, {
        status: 200,
        data: { ...req.params, ...req.body },
        message: "Edit success",
      });
    } catch (error) {
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
  get: async (req, res) => {
    try {
      const result = await size_ProductsRepo.getSizeProduct();
      // res.status(201).json({ result: response.rows });
      return response(res, {
        status: 200,
        data: result.rows,
        message: "Get all success",
      });
    } catch (error) {
      // res.status(500).json({ msg: "Internal server error" });
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
};

module.exports = size_productsController;
