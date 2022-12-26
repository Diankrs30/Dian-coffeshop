const transactionsRepo = require("../repo/transactions");
const response = require("../helper/response");
const snap = require("../helper/midtrans");

const transactionsController = {
  get: async (req, res) => {
    try {
      const result = await transactionsRepo.getAllTransactions(req.params.id);
      return response(res, {
        status: 200,
        data: result.rows,
        message: "Get detail transaction success",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
  getHistory: async (req, res) => {
    const user_id = req.userPayload.user_id;
    try {
      // const result = await transactionsRepo.getTransactionByUserId(user_id);
      // // console.log(result);
      // return response(res, {
      //   status: 200,
      //   data: result.rows,
      //   message: "Get history success",
      // });
      let queryParams = req.query;
      console.log(queryParams);
      let page = Number(queryParams.page);
      const limit = Number(queryParams.limit);
      const offset = (page - 1) * limit;

      const result = await transactionsRepo.getTransactionByUserId(
        user_id,
        limit,
        offset
      );
      const totalData = await transactionsRepo.getTotalHistory(
        user_id,
        queryParams
      );
      const totalPage = Math.ceil(totalData.rows[0].count / limit);
      const path = `http://${
        req.get("host") + req.baseUrl + req.route.path
      }?page`;
      // const path = `${req.baseUrl + req.route.path}?page`;

      page = Number(page);
      let queryString = "";
      Object.keys(queryParams).forEach((key) => {
        if (key !== "page" && key !== "path") {
          queryString += `&${key}=${queryParams[key]}`;
        }
      });
      const prevLink = page !== 1 ? `${path}=${page - 1}${queryString}` : null;
      const nextLink =
        page !== totalPage ? `${path}=${page + 1}${queryString}` : null;

      const meta = {
        totalData: Number(totalData.rows[0].count),
        totalPage: totalPage,
        next: nextLink,
        prev: prevLink,
      };
      // console.log(meta);
      // console.log(totalData.rows);
      // res.status(200).json({ result: response.rows });
      return response(res, {
        status: 200,
        data: result.rows,
        meta: meta,
        message: "Get history success",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
  getPopuler: async (req, res) => {
    //get success tpi gk ada datanya
    // const user_id = req.userPayload.user_id;
    try {
      const result = await transactionsRepo.getTransactionPopuler();
      // console.log(result);
      return response(res, {
        status: 200,
        data: result.rows,
        message: "Get populer success",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
  create: async (req, res) => {
    try {
      const body = req.body;
      console.log(body);
      const user_id = req.userPayload.user_id;
      const payment = await transactionsRepo.createTransactions(body, user_id);
      const transaction_id = payment.rows[0].id;
      const { product_item } = req.body;
      let transaction_item = [];
      await Promise.all(
        product_item.map(async (product) => {
          const { price, promo, quantity } = product;
          const total_price = price;
          const payment_items = await transactionsRepo.createTransactionsItems(
            product,
            transaction_id,
            total_price,
            user_id
          );
          const temp = {
            transaction_id,
            products_id: product.products_id,
            size_products_id: product.size_products_id,
            quantity: product.quantity,
            total_price,
            // user_id,
          };
          transaction_item.push(temp);
        })
      );
      const result = {
        id: transaction_id,
        user_id,
        transaction_item,
        subtotal: body.subtotal,
        tax_and_fee: body.tax_and_fee,
        shipping_cost: body.shipping_cost,
        address_detail: body.address_detail,
        phone_number: body.phone_number,
        payment_method: body.payment_method,
        delivery_methods_id: body.delivery_methods_id,
        set_time: body.set_time,
        status_order: body.status_order,
        status_delivery: body.status_delivery,
      };
      // console.log(req.body);
      return response(res, {
        status: 200,
        data: result,
        message: "Create success",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
  createTransactionMidtrans: async (req, res) => {
    try {
      const body = req.body;
      // console.log(body);
      const user_id = req.userPayload.user_id;
      const payment_id = `DianCoffeeshop-${Math.floor(
        Math.random() * 10000000000
      )}`;

      const payment = await transactionsRepo.createTransactionsMidtrans(
        body,
        payment_id,
        user_id
      );

      console.log(payment);

      const transaction_id = payment.rows[0].id;
      const { product_item } = req.body;
      let transaction_item = [];
      await Promise.all(
        product_item.map(async (product) => {
          const { price, promo, quantity } = product;
          const total_price = price;
          const payment_items = await transactionsRepo.createTransactionsItems(
            product,
            transaction_id,
            total_price,
            user_id
          );
          const temp = {
            transaction_id,
            products_id: product.products_id,
            size_products_id: product.size_products_id,
            quantity: product.quantity,
            total_price,
            // user_id,
          };
          transaction_item.push(temp);
        })
      );
      const result = {
        id: transaction_id,
        user_id,
        transaction_item,
        subtotal: body.subtotal,
        tax_and_fee: body.tax_and_fee,
        shipping_cost: body.shipping_cost,
        address_detail: body.address_detail,
        phone_number: body.phone_number,
        payment_method: body.payment_method,
        delivery_methods_id: body.delivery_methods_id,
        set_time: body.set_time,
        status_order: body.status_order,
        payment_id,
        bank_account: body.bank_account,
        total_payment: body.total_payment,
      };

      let parameter = {
        transaction_details: {
          order_id: payment_id,
          gross_amount: body.total_payment,
        },
        credit_card: {
          secure: true,
        },
      };
      const redirectUrl = await snap
        .createTransaction(parameter)
        .then((transaction) => transaction.redirect_url);

      const data = { ...result, redirectUrl };

      return response(res, {
        status: 200,
        data: data,
        message: "Create transaction success",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
  edit: async (req, res) => {
    try {
      let body = req.body;
      const result = await transactionsRepo.editTransaction(body, req.params);
      return response(res, {
        status: 200,
        data: { ...req.params, ...body },
        message: "Edit success",
      });
    } catch (error) {
      console.log(error);
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
  handlePayment: async (req, res) => {
    const { order_id, transaction_status } = req.body;
    try {
      const status_payment = transaction_status;
      console.log(req.body);
      const status_order = "process";
      const payment_id = order_id;

      const result = await transactionsRepo.updatePayment(
        status_order,
        status_payment,
        payment_id
      );

      return response(res, {
        status: 200,
        // data: result,
        message: "Payment success",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
};

module.exports = transactionsController;
