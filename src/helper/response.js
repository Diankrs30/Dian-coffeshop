const response = (res, result) => {
  const { status, error, data, message } = result;
  const resultPrint = {};
  resultPrint.status = message || "success";
  resultPrint.statusCode = status;
  resultPrint.data = data || null;
  resultPrint.error = error || null;
  res.status(status).json(resultPrint);
};
module.exports = response;
