import { Prisma, User, UserStatus } from "@prisma/client";
import config from "../../config";
import AppError from "../../errors/AppError";
import { passwordCompare } from "../../helpers/comparePasswords";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { httpStatus } from "../../utils/httpStatus";
import prisma from "../../utils/prisma";
import { hashPassword } from "../../helpers/hashPassword";
// import { OtpService } from "../otp/otp.service";
import { sendOTPEmail, sendWelcomeEmail } from "../../utils/emailSender";
import generateOtp from "../../helpers/generateOtp";
import { decodeOAuthToken } from "../../utils/decodeOAuthToken";

type OTPType = "SIGNUP" | "FORGOT_PASSWORD";

// Reusable selects
const userBasicSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  isDeleted: true,
  isVerified: true,
  status: true,
} satisfies Prisma.UserSelect;

const userAuthSelect = {
  ...userBasicSelect,
  password: true,
  provider: true,
  profilePic: true,
} satisfies Prisma.UserSelect;

// register
const registerUser = async (payload: User) => {
  const isUserExists = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (isUserExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      `User with email ${payload.email} already Registered`,
    );
  }

  if (!payload.password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
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
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.otp.create({
    data: {
      otpCode: otp,
      expiresAt: expiresAt,
      userId: result.id,
    },
  });

  if (result) {
    // await OtpService.sentOtp(payload.email);
    sendOTPEmail(result.email, String(otp), "SIGNUP").catch((error) => {
      console.error("Failed to send signup OTP email:", error);
    });
  }

  return result;
};

// login
const loginUser = async (email: string, password: string) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!user.isVerified) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account is not verified. Please verify your account first.",
    );
  }

  // Check user status before allowing login
  if (user.status === UserStatus.Inactive) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account is inactive. Please contact support.",
    );
  }

  if (user.status === UserStatus.Banned) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account has been banned. Please contact support.",
    );
  }

  if (!user.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This account is registered via ${user.provider || "social login"}. Please use social login.`,
    );
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
    config.jwt.access.expiresIn as string,
  );

  const refreshToken = jwtHelpers.generateJwtToken(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.refresh.secret as string,
    config.jwt.refresh.expiresIn as string,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  };
};

// verify signup otp
const verifySignUpOtp = async (email: string, otp: number) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already verified");
  }

  const otpRecord = await prisma.otp.findFirst({
    where: {
      userId: user.id,
      otpCode: Number(otp),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpRecord) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "OTP has expired. Please request a new one.",
    );
  }

  await prisma.$transaction(async (trx) => {
    await trx.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
      },
    });

    await trx.otp.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // sent a welcome email
    await sendWelcomeEmail(user.email, user.name).catch((error) => {
      console.error("Failed to send welcome email:", error);
    });
  });

  return null;
};

// resend sign up otp
const resendSignUpOtp = async (email: string) => {
  await resendOtp(email, "SIGNUP");
  return {
    message: "New OTP has been sent to your email for email verification.",
  };
};

// verify otp (eg: forgot password)
const verifyOtp = async (email: string, otp: number) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const otpRecord = await prisma.otp.findFirst({
    where: {
      userId: user.id,
      otpCode: Number(otp),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpRecord) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "OTP has expired. Please request a new one.",
    );
  }

  await prisma.otp.deleteMany({
    where: {
      userId: user.id,
    },
  });

  // Generate a short-lived reset token (10 minutes)
  const resetToken = jwtHelpers.generateJwtToken(
    { id: user.id, email: user.email, role: "RESET_PASSWORD" },
    config.jwt.access.secret as string,
    "10m",
  );

  return { token: resetToken };
};

// resent otp (reusable)
const resendOtp = async (email: string, type: OTPType) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      Otp: true,
    },
  });

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with email ${email} not found`,
    );
  }

  await prisma.$transaction(async (trx) => {
    await trx.otp.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // sent otp email
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const result = await prisma.otp.create({
      data: {
        otpCode: otp,
        expiresAt: expiresAt,
        userId: user.id,
      },
    });

    if (result) {
      await sendOTPEmail(user.email, String(otp), type).catch((error) => {
        console.error("Failed to send email:", error);
      });
    }
  });

  return null;
};

// chaange password

const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if new password and confirm password match
  if (newPassword !== confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password and confirm password do not match",
    );
  }

  if (!user.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot change password for social login account",
    );
  }

  // Check current password
  const isCurrentPasswordValid = await passwordCompare(
    currentPassword,
    user.password,
  );
  if (!isCurrentPasswordValid) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Current password is incorrect",
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

// forget password

const forgetPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User With email ${email} not Found`,
    );
  }

  await prisma.$transaction(async (trx) => {
    await trx.otp.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const result = await prisma.otp.create({
      data: {
        otpCode: otp,
        expiresAt: expiresAt,
        userId: user.id,
      },
    });

    if (result) {
      await sendOTPEmail(user.email, String(otp), "FORGET_PASSWORD").catch(
        (error) => {
          console.error("Failed to send email:", error);
        },
      );
    }
  });

  return {
    message: "OTP have sent to your email for Password reset",
  };
};

// reset password
const resetPassword = async (
  email: string,
  newPassword: string,
  confirmPassword: string,
  token?: string,
) => {
  if (newPassword !== confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password and confirm password do not match",
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // If a reset token is provided, verify it belongs to this user
  if (token) {
    let decoded: any;
    try {
      decoded = jwtHelpers.verifyToken(
        token,
        config.jwt.access.secret as string,
      );
    } catch {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Reset token has expired or is invalid",
      );
    }

    if (decoded.email !== email && decoded.id !== user.id) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Invalid reset token for this user",
      );
    }
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: "Password reset successfully",
  };
};

// get me

const getMe = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePic: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

// refresh token

const refreshToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is required");
  }

  // Verify refresh token
  const decoded = jwtHelpers.verifyToken(
    refreshToken,
    config.jwt.refresh.secret as string,
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
    config.jwt.access.expiresIn as string,
  );

  return { accessToken };
};

//google login for web
const socialLogin = async (payload: {
  token: string;
  provider: "google" | "apple";
}) => {
  const userInfo = decodeOAuthToken(payload.token, payload.provider);

  return prisma.$transaction(async (trx) => {
    let user = await trx.user.findUnique({
      where: {
        email: userInfo.email,
      },
      select: userAuthSelect,
    });

    if (user && user.provider !== payload.provider) {
      throw new AppError(
        409,
        `This email is already registered via ${user.provider}. Please use ${user.provider} login instead.`,
      );
    }

    if (!user) {
      user = await trx.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name,
          provider: payload.provider,
          isVerified: true,
          password: null,
        },
        select: userAuthSelect,
      });
    } else {
      if (user.isDeleted) throw new AppError(409, "User is deleted");

      if (userInfo.picture && user.profilePic !== userInfo.picture) {
        await trx.user.update({
          where: {
            id: user.id,
          },
          data: { profilePic: userInfo.picture },
        });
      }
    }

    const accessToken = jwtHelpers.generateJwtToken(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.access.secret as string,
      config.jwt.access.expiresIn as string,
    );

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  });
};

export const AuthService = {
  registerUser,
  loginUser,
  changePassword,
  getMe,
  socialLogin,
  refreshToken,
  verifySignUpOtp,
  resendSignUpOtp,
  verifyOtp,
  resendOtp,
  forgetPassword,
  resetPassword,
};
