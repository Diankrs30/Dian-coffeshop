const multer = require("multer");
const path = require("path");
const { callbackify } = require("util");
const response = require("../helper/response");

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 10e3)}`;
    // console.log(uniqueSuffix);
    const ext = path.extname(file.originalname);
    // console.log(ext);
    const fileName = `${file.fieldname}-${uniqueSuffix}${ext}`;
    // console.log(fileName);
    cb(null, fileName);
  },
});

let Upload = multer({
  storage: Storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return cb({
        message: "check your file type. Only .jpg, .jpeg, and .png are allowed",
      });
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("image");

exports.fileUpload = async (req, res, next) => {
  await diskUpload(req, res, function (error) {
    if (error) {
      //instanceof multer.MulterError
      res.status(500);
      if (error.code == "LIMIT_FILE_SIZE") {
        return response(res, {
          data: null,
          status: 400,
          message: "File Size is too large. Allowed file size is 2Mb",
        });
      } else {
        console.log(error);
        return response(res, {
          data: null,
          status: 400,
          message: "General Error.",
          error,
        });
      }
    }
    return next();
  });
};
