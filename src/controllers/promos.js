// import transactionsRepo
const promosRepo = require("../repo/promos");
const response = require("../helper/response");

const promosController = {
  get: async (req, res) => {
    try {
      const result = await promosRepo.getPromos();
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
      const result = await promosRepo.createPromos(req.body);
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
      const result = await promosRepo.editPromos(req.body, req.params);
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
      const result = await promosRepo.deletePromos(req.params);
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

module.exports = promosController;
