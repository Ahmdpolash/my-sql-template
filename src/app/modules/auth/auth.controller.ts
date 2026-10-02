import { httpStatus } from "../../utils/httpStatus";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import {
  accessTokenOptions,
  refreshTokenOptions,
} from "../../helpers/jwtHelpers";

// register user
const register = catchAsync(async (req, res) => {
  const result = await AuthService.registerUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "User Registered successfully! Please Verify Your Email",
    data: null,
  });
});

//login
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const result = await AuthService.loginUser(email, password);

  const { accessToken, refreshToken, user } = result;

  res.cookie("refreshToken", refreshToken, refreshTokenOptions);
  res.cookie("token", accessToken, accessTokenOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User logged in successfully!",
    data: { accessToken, user },
  });
});

// social login
const socialLogin = catchAsync(async (req, res) => {
  const result = await AuthService.socialLogin(req.body);

  if (result?.accessToken) {
    res.cookie("token", result.accessToken, accessTokenOptions);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User logged in successfully!",
    data: result,
  });
});

//verify signupt otp
const verifySignUpOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await AuthService.verifySignUpOtp(email, otp);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User Verified Successfully",
    data: null,
  });
});
//resend signup otp
const resendSignUpOtp = catchAsync(async (req, res) => {
  const { email } = req.body;

  await AuthService.resendOtp(email, "SIGNUP");

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "OTP Resent Successfully",
  });
});

// verify otp(eg: forgot pass)
const verifyOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  const result = await AuthService.verifyOtp(email, otp);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Otp verified successfully",
    data: result,
  });
});

// resend otp (eg:forgot pass
const resendOtp = catchAsync(async (req, res) => {
  const { email } = req.body;

  await AuthService.resendOtp(email, "FORGOT_PASSWORD");
  // const result = await AuthService.resendOtp(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "OTP Resent Successfully",
  });
});

// change password
const changePassword = catchAsync(async (req, res) => {
  const email = req.user?.email as string;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  await AuthService.changePassword(
    email,
    currentPassword,
    newPassword,
    confirmPassword
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Password changed successfully!",
  });
});

// forget password
const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const result = await AuthService.forgetPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: result.message,
  });
});

// reset password
const resetPassword = catchAsync(async (req, res) => {
  let token =
    req.headers.authorization ||
    req.body?.token ||
    req.cookies?.resetToken ||
    req.cookies?.token;

  if (typeof token === "string" && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  const { email, newPassword, confirmPassword } = req.body;

  const result = await AuthService.resetPassword(
    email,
    newPassword,
    confirmPassword,
    token
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: result.message,
  });
});

// get me
const getMe = catchAsync(async (req, res) => {
  const email = req.user?.email as string;

  const result = await AuthService.getMe(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User fetched successfully!",
    data: result,
  });
});

// refresh token
const refreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Access token retrieved successfully!",
    data: result,
  });
});

export const AuthController = {
  register,
  resetPassword,
  login,
  changePassword,
  getMe,
  refreshToken,
  verifySignUpOtp,
  resendSignUpOtp,
  verifyOtp,
  resendOtp,
  forgetPassword,
  socialLogin,
};
