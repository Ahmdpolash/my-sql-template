import { httpStatus } from "../../utils/httpStatus";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

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

  // res.cookie("refreshToken", refreshToken, {
  //   httpOnly: true,
  //   secure: false,
  //   sameSite: "lax",
  //   maxAge: 24 * 60 * 60 * 1000,
  // });
  res.cookie("token", result.accessToken, { httpOnly: true });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User logged in successfully!",
    data: { accessToken, user },
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

  const result = await AuthService.resendSignUpOtp(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: result.message,
  });
});

// verify otp(eg: forgot pass)
const verifyOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  const result = await AuthService.verifyOtp(email, otp);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Otp verified successfully",
  });
});

// resend otp (eg:forgot pass
const resendOtp = catchAsync(async (req, res) => {
  const { email } = req.body;

  const result = await AuthService.resendOtp(email);

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
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Access token retrieved successfully!",
    data: result,
  });
});

export const AuthController = {
  register,
  login,
  changePassword,
  getMe,
  refreshToken,
  verifySignUpOtp,
  resendSignUpOtp,
  verifyOtp,
  resendOtp,
  forgetPassword,
};
