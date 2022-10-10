const transactionsRepo = require("../repo/transactions");
const response = require("../helper/response");

const transactionsController = {
  get: async (req, res) => {
    try {
      const result = await transactionsRepo.getTransactions();
      // res.status(200).json({
      //   result: response.rows,
      // });
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
      const result = await transactionsRepo.createTransactions(req.body);
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
      const result = await transactionsRepo.editTransactions(
        req.body,
        req.params
      );
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
      const result = await transactionsRepo.deleteTransactions(req.params);
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

module.exports = transactionsController;
