const multer = require("multer");
const path = require("path");
const response = require("../helper/response");

const memoryStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
    return cb({
      message: "Check your file type. Only .jpg, .jpeg, and .png are allowed",
    });
  }
  cb(null, true);
};

const limits = {
  fileSize: 2 * 1024 * 1024,
};

const memoryUpload = multer({
  storage: memoryStorage,
  fileFilter,
  limits,
}).single("image");

exports.memoryStorageUpload = async (req, res, next) => {
  await memoryUpload(req, res, (error) => {
    // error multer
    if (error) {
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
          message: "General error.",
          error,
        });
      }
    }
    return next();
  });
};

// const limits = {
//   fileSize: 2e6,
// };
// const fileFilter = (req, file, cb) => {
//   const ext = path.extname(file.originalname);
//   // const allowedExt = ["jpg", "png"];
//   const allowedExt = /jpg|png/;
//   // re.test : boolean
//   if (!allowedExt.test(ext))
//     return cb(new Error("Only Use Allowed Extension (JPG, PNG)"), false);
//   cb(null, true);
// };

// const memoryStorage = multer.memoryStorage();

// const memoryUpload = multer({
//   storage: memoryStorage,
//   limits,
//   fileFilter,
// });

// const errorHandler = (err, res, next) => {
//   if (err instanceof multer.MulterError) {
//     return res.status(500).json({ status: "Upload Error", msg: err.message });
//   }
//   if (err) {
//     return res
//       .status(500)
//       .json({ status: "Internal Server Error", msg: err.message });
//   }
//   console.log("Upload Success");
//   next();
// };

// module.exports = { diskUpload, memoryUpload, errorHandler };
