// import transaction_itemsRepo
const transaction_itemsRepo = require("../repo/transaction_items");
const response = require("../helper/response");

const transaction_itemsController = {
  get: async (req, res) => {
    try {
      const result = await transaction_itemsRepo.getTransactionItems();
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
        message: "Internal service error",
      });
    }
  },
  create: async (req, res) => {
    try {
      const result = await transaction_itemsRepo.createTransactionItems(
        req.body
      );
      return response(res, {
        status: 200,
        data: result,
        message: "Create success",
      });
    } catch (error) {
      return response(res, {
        error,
        status: 500,
        message: "Internal service error",
      });
    }
  },
  edit: async (req, res) => {
    try {
      const result = await transaction_itemsRepo.editTransactionItems(
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
        message: "Internal service error",
      });
    }
  },
  drop: async (req, res) => {
    try {
      const result = await transaction_itemsRepo.deleteTransactionItems(
        req.params
      );
      return response(res, {
        status: 200,
        message: "Delete success",
      });
    } catch (error) {
      return response(res, {
        error,
        status: 500,
        message: "Internal service error",
      });
    }
  },
};

module.exports = transaction_itemsController;
