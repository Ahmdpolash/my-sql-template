import { User } from "@prisma/client";
import config from "../../config";
import AppError from "../../errors/AppError";
import { passwordCompare } from "../../helpers/comparePasswords";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { httpStatus } from "../../utils/httpStatus";
import prisma from "../../utils/prisma";
import { hashPassword } from "../../helpers/hashPassword";
import { OtpService } from "../otp/otp.service";

const registerUser = async (payload: User) => {
  const isUserExists = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (isUserExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      `User with email ${payload.email} already Registered`
    );
  }

  // hash password
  const hashNewPassword = await hashPassword(payload.password);

  // create user
  const result = await prisma.user.create({
    data: { ...payload, password: hashNewPassword, isVerified: false },
  });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to register user");
  }

  // sent otp

  if (result) {
    await OtpService.sentOtp(payload.email);
  }

  return result;
};

const loginUser = async (email: string, password: string) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check password
  const isPasswordValid = await passwordCompare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  // Generate tokens
  const accessToken = jwtHelpers.generateJwtToken(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.access.secret as string,
    config.jwt.access.expiresIn as string
  );

  const refreshToken = jwtHelpers.generateJwtToken(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.refresh.secret as string,
    config.jwt.refresh.expiresIn as string
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  };
};

const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  // Check if new password and confirm password match
  if (newPassword !== confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password and confirm password do not match"
    );
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check current password
  const isCurrentPasswordValid = await passwordCompare(
    currentPassword,
    user.password
  );
  if (!isCurrentPasswordValid) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Current password is incorrect"
    );
  }

  // Hash new password
  const hashedNewPassword = await hashPassword(newPassword);

  // Update password
  await prisma.user.update({
    where: { email },
    data: {
      password: hashedNewPassword,
    },
  });

  return { message: "Password changed successfully" };
};

const getMe = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const refreshToken = async (refreshToken: string) => {
  // Verify refresh token
  const decoded = jwtHelpers.verifyToken(
    refreshToken,
    config.jwt.refresh.secret as string
  );

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Generate new access token
  const accessToken = jwtHelpers.generateJwtToken(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.access.secret as string,
    config.jwt.access.expiresIn as string
  );

  return { accessToken };
};

export const AuthService = {
  registerUser,
  loginUser,
  changePassword,
  getMe,
  refreshToken,
};
