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
};

module.exports = categoriesController;
