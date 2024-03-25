const constant = require("../constants/constant");
const query = require("../lib/queries/users");
const jwt = require("jsonwebtoken");
const { createErrorResponse, createSuccessResponse } = require("../lib/response");

exports.sendOtp = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const otp = constant?.STATIC_OTP;
    const expiryTime = Date.now() + 60 * 1000;

    let alreadyExists = await query.findMobileNo(body?.mobileNo);

    if (alreadyExists) {
      await query.updateInVerificationMaster(
        { otp, otpGeneratedAt: expiryTime },
        { mobileNo: body?.mobileNo }
      );
    } else {
      await query.createEntryInVerificationMaster({
        otp,
        mobileNo: body?.mobileNo,
        otpGeneratedAt: expiryTime,
      });
    }
    return createSuccessResponse("Otp Sent", null);
  } catch (err) {
    console.log(err);
    return createErrorResponse(
      constant.response_code.INTERNAL_SERVER_ERROR,
      err.message || constant.STRING_CONSTANTS.SOME_ERROR_OCCURED
    );
  }
};

exports.userRegistration = async (event) => {
  try {
    const body = JSON.parse(event.body);

    let dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    console.log("DOB",body?.DOB);
    if (!dobRegex.test(body?.DOB)) {
      const errorMessage = "Invalid date of birth format. Expected format: MM/DD/YYYY";
      return createErrorResponse(
        constant.response_code.BAD_REQUEST,
        errorMessage
      );
    }

    let alreadyExists = await query.findUser(body?.mobileNo);

    if (alreadyExists) {
      const errorMessage = `User already exists with mobileNo ${body?.mobileNo}`;
      return createErrorResponse(
        constant.response_code.BAD_REQUEST,
        errorMessage
      );
    } else {
      let alreadyExistsOtp = await query.findMobileNo(body?.mobileNo);
      if (!alreadyExistsOtp || alreadyExistsOtp?.otp !== body?.otp) {
        const errorMessage = "Invalid OTP";
        return createErrorResponse(
          constant.response_code.BAD_REQUEST,
          errorMessage
        );
      }

      const otpGeneratedAt = alreadyExistsOtp?.otpGeneratedAt;
      const timeDiff = Date.now() - otpGeneratedAt;
      const oneMinuteInMillis = 60 * 1000;
      if (timeDiff >= oneMinuteInMillis) {
        const errorMessage = "OTP expired";
        return createErrorResponse(
          constant.response_code.BAD_REQUEST,
          errorMessage
        );
      }

      let userDetails = {
        name: body?.name,
        email: body.email,
        mobileNo: body?.mobileNo,
      };
      let newUser = await query.createUser(userDetails);
      userDetails = {
        ...userDetails,
        id: newUser?.id,
      };
      token = await genNewToken(userDetails);
      return createSuccessResponse("Registration Successful", token);
    }
  } catch (err) {
    console.log(err);
    return createErrorResponse(
      constant.response_code.INTERNAL_SERVER_ERROR,
      err.message || constant.STRING_CONSTANTS.SOME_ERROR_OCCURED
    );
  }
};

// Function to generate new JWT token
const genNewToken = async (payload) => {
  try {
    var token = jwt.sign(payload, constant.JWT_SECRET, {
      expiresIn: 432000,
    });
    return token;
  } catch (err) {
    console.log(`Error in generating token: ${err}`);
    throw new Error("Error in generating token");
  }
};

exports.userLogin = async (event) => {
  try {
    const body = JSON.parse(event.body);

    let alreadyExists = await query.findUser(body?.mobileNo);

    if (!alreadyExists) {
      const errorMessage = "User not found, please register first";
      return createErrorResponse(
        constant.response_code.BAD_REQUEST,
        errorMessage
      );
    }

    let alreadyExistsOtp = await query.findMobileNo(body?.mobileNo);
    if (!alreadyExistsOtp || alreadyExistsOtp?.otp != body?.otp) {
      const errorMessage = "Invalid OTP";
      return createErrorResponse(
        constant.response_code.BAD_REQUEST,
        errorMessage
      );
    }

    const timeDiff = Date.now() - alreadyExistsOtp?.otpGeneratedAt;
    const oneMinute = 60 * 1000;
    if (timeDiff >= oneMinute) {
      const errorMessage = "OTP expired";
      return createErrorResponse(
        constant.response_code.BAD_REQUEST,
        errorMessage
      );
    }

    let userDetails = {
      mobileNo: body?.mobileNo,
      id: alreadyExists?.id,
    };
    token = await genNewToken(userDetails);
    return createSuccessResponse("Login Successful", token);
  } catch (err) {
    console.log(err);
    return createErrorResponse(
      constant.response_code.INTERNAL_SERVER_ERROR,
      err.message || constant.STRING_CONSTANTS.SOME_ERROR_OCCURED
    );
  }
};
