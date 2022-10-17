const jwt = require("jsonwebtoken");
const response = require("../helper/response");

module.exports = () => {
  return (req, res, next) => {
    const token = req.header("x-access-token");
    if (!token)
      return response(res, {
        status: 401,
        message: "You have to login first",
        data: null,
      });

    // verifikasi
    jwt.verify(
      token,
      process.env.SECRET_KEY,
      { issuer: process.env.ISSUER },
      (error, decodedPayload) => {
        if (error) {
          console.log(error);
          return response(res, {
            status: 403,
            message: "Authentication failed",
            error: error.message,
          });
        }
        // payload
        req.userPayload = decodedPayload;
        next();
      }
    );
  };
};
