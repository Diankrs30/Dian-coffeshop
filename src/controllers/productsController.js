const productsRepo = require("../repo/productsRepo");
const response = require("../helper/response");
const { login } = require("./auth");
const DatauriParser = require("datauri/parser");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const productsController = {
  get: async (req, res) => {
    try {
      let queryParams = req.query;
      console.log(queryParams);
      let page = Number(queryParams.page);
      const limit = Number(queryParams.limit);
      const offset = (page - 1) * limit;

      // queryParams = { ...queryParams, limit, offset };

      const result = await productsRepo.getProducts(queryParams, limit, offset);
      const totalData = await productsRepo.getTotalProduct(queryParams);
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
        message: "Get all success",
      });
    } catch (error) {
      // res.status(500).json({ msg: "Internal server error" });
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },

  getProductDetail: async (req, res) => {
    try {
      const result = await productsRepo.getProductDetail(req.params.id);
      return response(res, {
        status: 200,
        data: result.rows,
        message: "Get product detail success",
      });
    } catch (error) {
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },

  /*create: async (req, res) => {
    try {
      const image = `${req.file.secure_url}`;
      const body = { ...req.body, image };
      console.log(body);
      // console.log(image);
      const result = await productsRepo.createProduct(body);
      return response(res, {
        status: 200,
        data: { ...result.rows[0], ...body },
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
  },*/

  create: async (req, res) => {
    try {
      let body = req.body;

      const result = await productsRepo.createProduct(body);
      // console.log("create", result.rows[0].id);
      const parser = new DatauriParser();
      const buffer = req.file.buffer;
      const ext = path.extname(req.file.originalname).toString();
      const datauri = parser.format(ext, buffer);
      const fileName = `product_${result.rows[0].id}`;
      const cloudinaryOpt = {
        public_id: fileName,
        folder: "dian-coffeeshop",
      };

      const uploadImg = await cloudinary.uploader.upload(
        datauri.content,
        cloudinaryOpt
      );

      body = { ...body, image: uploadImg.secure_url };
      const insertImage = await productsRepo.editProducts(
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

      // console.log(req.file);

      const result = await productsRepo.editProducts(body, req.params);
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
      const result = await productsRepo.deleteProduct(req.params);
      return response(res, {
        status: 200,
        data: { ...req.params, ...result.rows[0] },
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

module.exports = productsController;
