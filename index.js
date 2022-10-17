require("dotenv").config();
const { response } = require("express");
const express = require("express");
const postgreDb = require("./src/config/postgre");
const mainRouter = require("./src/routes/mainRouter");
const server = express();
// init port
const PORT = 8070;
const morgan = require("morgan");
const logger = morgan(
  ":method :url :status :res[content-length] - :response-time ms"
);
// console.log(morgan);
// console.log(logger);
// connection to db
postgreDb
  .connect()
  .then(() => {
    console.log("DB connected");
    // akses file static yang ada di directory
    server.use(express.static("./public"));
    // parser untuk body agar input dapat dilakukan lebih dinamis
    server.use(express.json());
    server.use(express.urlencoded({ extended: false }));
    // server siap menerima request
    server.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
    server.use(logger);
    //  semua request ke server akan didelegasikan ke mainRouter
    server.use(mainRouter);
  })
  .catch((error) => {
    console.log(error);
  });
