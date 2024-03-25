const auth = require("./src/controllers/auth");
const dashboard = require("./src/controllers/dashboard");
const validateToken = require("./src/middlewares/authorization");
const { createErrorResponse } = require("./src/lib/response");
const constant = require("./src/constants/constant");

exports.handler = async (event) => {
  try {
    const path = event.path;
    if (requiresTokenValidation(path)) {
      if (!validateToken(event)) {
        return createErrorResponse(
          constant.response_code.UNAUTHORIZED,
          constant.STRING_CONSTANTS.INVALID_AUTHORIZATION
        );
      }
    }

    switch (path) {
      case "/api/sendotp":
        if (event.httpMethod === "POST") return await auth.sendOtp(event);
        break;
      case "/api/registration":
        if (event.httpMethod === "POST")
          return await auth.userRegistration(event);
        break;
      case "/api/login":
        if (event.httpMethod === "POST") return await auth.userLogin(event);
        break;
      case "/api/savescore":
        if (event.httpMethod === "POST")
          return await dashboard.saveScore(event);
        break;
      case "/api/userprogress":
        if (event.httpMethod === "GET")
          return await dashboard.overAllScore(event);
        break;
      case "/api/weeklyreport":
        if (event.httpMethod === "GET")
          return await dashboard.weeklyScoreDashboard(event);
        break;
      default:
        return createErrorResponse(
          constant.response_code.NOT_FOUND,
          constant.STRING_CONSTANTS.ENDPOINT_NOT_FOUND
        );
    }
  } catch (err) {
    console.error(err);
    return createErrorResponse(
      constant.response_code.INTERNAL_SERVER_ERROR,
      err.message || constant.STRING_CONSTANTS.INTERNAL_SERVER_ERROR
    );
  }
};

const requiresTokenValidation = (path) => {
  return ["/api/savescore", "/api/userprogress", "/api/weeklyreport"].includes(
    path
  );
};
