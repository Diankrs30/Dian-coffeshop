const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
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

const upload = multer({ storage });

module.exports = upload;
