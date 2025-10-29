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

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const result = await AuthService.loginUser(email, password);

  const { accessToken, refreshToken, user } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User logged in successfully!",
    data: { accessToken, user },
  });
});

//verify otp
const verifyOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await AuthService.verifyOtp(email, otp);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User Verified Successfully",
    data: null,
  });
});

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

const getMe = catchAsync(async (req, res) => {
  const email = req.user?.email as string;

  const result = await AuthService.getMe(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User fetched successfully!",
    data: result,
  });
});

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
  verifyOtp,
};
