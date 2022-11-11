const jwt = require("jsonwebtoken");
const response = require("../helper/response");
const usersRepo = require("../repo/usersRepo");
const redis = require("../config/redis");

const isLogin = async (req, res, next) => {
  const token = req.header("x-access-token");
  if (!token)
    return response(res, {
      status: 401,
      message: "You have to login first",
      data: null,
    });
  // const checkWhitelistToken = await usersRepo.checkWhitelistToken(token);
  const redisToken = await // console.log(checkWhitelistToken.rows.length);
  // if (checkWhitelistToken.rows.length === 0) {
  //   return response(res, {
  //     status: 400,
  //     message: "You have to login first",
  //   });
  // }

  // verifikasi
  jwt.verify(
    token,
    process.env.SECRET_KEY,
    { issuer: process.env.ISSUER },
    async (error, decodedPayload) => {
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
      const redisToken = await redis.get(`getToken: ${decodedPayload.user_id}`);
      if (redisToken === null) {
        return response(res, {
          status: 400,
          message: "You have to login first",
        });
      }
      next();
    }
  );
};

module.exports = { isLogin };
