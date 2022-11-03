// import transactionsRepo
const promosRepo = require("../repo/promos");
const response = require("../helper/response");
const { query } = require("express");
const DatauriParser = require("datauri/parser");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const promosController = {
  get: async (req, res) => {
    try {
      let queryParams = req.query;
      let page = Number(queryParams.page);
      const limit = Number(queryParams.limit);
      const offset = (page - 1) * limit;
      const result = await promosRepo.getPromos(queryParams, limit, offset);

      const totalData = await promosRepo.getTotalPromos(queryParams);
      const totalPage = Math.ceil(totalData.rows[0].count) / limit;
      const path = `${req.baseUrl + req.route.path}?page`;

      page = Number(page);
      let queryString = "";
      Object.keys(queryParams).forEach((key) => {
        if (key !== "page" && key !== path) {
          queryString += `${path}=${page - 1}$`;
        }
      });
      const prevLink = page !== 1 ? `${path}=${page - 1}${queryString}` : null;
      const nextLink =
        page !== totalPage ? `${path}=${page + 1}${queryString}` : null;

      const meta = {
        tatalData: Number(totalData.rows[0].count),
        totalPage: totalPage,
        next: nextLink,
        prev: prevLink,
      };

      return response(res, {
        status: 200,
        data: result.rows,
        meta: meta,
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

  getDetailPromo: async (req, res) => {
    try {
      const user_id = req.userPayload.user_id;
      console.log(user_id);
      const result = await promosRepo.getDetailPromo(user_id);
      return response(res, {
        status: 200,
        data: result.rows,
        message: "Get all success",
      });
    } catch (error) {
      return response(res, {
        error,
        status: 500,
        message: "Internal service error",
      });
    }
  },

  create: async (req, res) => {
    try {
      let body = req.body;

      const result = await promosRepo.createPromos(body);
      // console.log("create", result.rows[0].id);
      const parser = new DatauriParser();
      const buffer = req.file.buffer;
      const ext = path.extname(req.file.originalname).toString();
      const datauri = parser.format(ext, buffer);
      const fileName = `promo_${result.rows[0].id}`;
      const cloudinaryOpt = {
        public_id: fileName,
        folder: "dian-coffeeshop",
      };

      const uploadImg = await cloudinary.uploader.upload(
        datauri.content,
        cloudinaryOpt
      );

      body = { ...body, image: uploadImg.secure_url };
      const insertImage = await promosRepo.editPromos(
        { image: body.image },
        { id: result.rows[0].id }
      );
      // console.log("update", insertImage);
      const payload = { ...body, id: result.rows[0].id };
      return response(res, {
        status: 200,
        data: payload,
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

  edit: async (req, res) => {
    try {
      let body = req.body;
      if (req.file) {
        const image = `${req.file.secure_url}`;
        body = { ...body, image };
      }
      // console.log(body);
      // console.log(req.file);
      const result = await promosRepo.editPromos(body, req.params);
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
        message: "Internal service error",
      });
    }
  },

  drop: async (req, res) => {
    try {
      const result = await promosRepo.deletePromos(req.params);
      return response(res, {
        status: 200,
        data: { ...req.params, ...result.rows[0] },
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
