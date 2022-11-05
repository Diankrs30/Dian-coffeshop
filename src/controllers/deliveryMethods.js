const deliveryMethodRepo = require("../repo/delivery_method");
const response = require("../helper/response");

const deliveryMethodsController = {
  get: async (req, res) => {
    try {
      const result = await deliveryMethodRepo.getDeliveryMethod();
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

module.exports = deliveryMethodsController;
