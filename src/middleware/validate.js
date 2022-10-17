const response = require("../helper/response");

const registerBody = (req, res, next) => {
  // validasi body
  const { body } = req;
  const registerBody = ["email", "password_user", "phone_number"];
  const bodyProperty = Object.keys(body);
  const isBodyValid =
    registerBody.filter((property) => !bodyProperty.includes(property))
      .length == 0
      ? true
      : false;
  // console.log(isBodyValid);
  if (!isBodyValid)
    return response(res, { status: 400, message: "Invalid Body" });
  next();
};

const loginBody = (req, res, next) => {
  // validasi body
  const { body } = req;
  const registerBody = ["email", "password"];
  const bodyProperty = Object.keys(body);
  const isBodyValid =
    registerBody.filter((property) => !bodyProperty.includes(property))
      .length == 0
      ? true
      : false;
  // console.log(isBodyValid);
  if (!isBodyValid)
    return response(res, { status: 400, message: "Invalid Body" });
  next();
};

const body = (...allowedKeys) => {
  return (req, res, next) => {
    const { body } = req;
    const sanitizedKey = Object.keys(body).filter((key) =>
      allowedKeys.includes(key)
    );
    const newBody = {};
    for (let key of sanitizedKey) {
      Object.assign(newBody, { [key]: body[key] });
    }
    console.log(newBody);
    req.body = newBody;
    next();
  };
};

module.exports = { registerBody, loginBody, body };
