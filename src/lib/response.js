const constant = require("../constants/constant");

const createErrorResponse = (statusCode, errorMessage) => {
    return {
      statusCode: statusCode,
      body: JSON.stringify({
        status: {
          code: statusCode,
          message: null,
        },
        data: null,
        error: [{ msg: errorMessage }],
      }),
    };
  };

  const createSuccessResponse = (message,data) => {
    return {
      statusCode: constant.response_code.SUCCESS,
      body: JSON.stringify({
        status: {
          code: constant.response_code.SUCCESS,
          message: message || null,
        },
        data: data || null,
        error: null,
      }),
    };
  };

module.exports = {
  createErrorResponse,
  createSuccessResponse
};
