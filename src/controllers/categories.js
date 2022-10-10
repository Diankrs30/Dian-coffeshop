// import repo
const categoriesRepo = require("../repo/categories");
// import helper
const response = require("../helper/response");

const categoriesController = {
  get: async (req, res) => {
    try {
      const result = await categoriesRepo.getCategories();
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

  create: async (req, res) => {
    try {
      const result = await categoriesRepo.createCategory(req.body);
      return response(res, {
        status: 200,
        data: result,
        message: "Create success",
      });
    } catch (error) {
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },

  edit: async (req, res) => {
    try {
      const result = await categoriesRepo.editCategory(req.body, req.params);
      return response(res, {
        status: 200,
        data: result,
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
  drop: async (req, res) => {
    try {
      const result = await categoriesRepo.deleteCategory(req.params);
      return response(res, {
        status: 200,
        message: "Delete success",
      });
    } catch (error) {
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
};

module.exports = categoriesController;
