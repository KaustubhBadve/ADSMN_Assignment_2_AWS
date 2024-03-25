const constant = require("../constants/constant");
const jwt = require("jsonwebtoken");

const validateToken = (event) => {
  const token = event.headers.Authorization;
  if (token) {
    const tokenValue = token.substring(7);
    try {
      const decoded = jwt.verify(tokenValue, constant.JWT_SECRET);
      event.userId = decoded.id;
      return true;
    } catch (err) {
      return false; 
    }
  } else {
    return false; 
  }
};

module.exports = validateToken;
