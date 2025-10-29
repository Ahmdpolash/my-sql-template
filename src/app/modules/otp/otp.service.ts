import AppError from "../../errors/AppError";
import generateOtp from "../../helpers/generateOtp";
import { httpStatus } from "../../utils/httpStatus";
import prisma from "../../utils/prisma";
import { sendEmail } from "../../utils/sendEmail";

const sentOtp = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const otp = generateOtp();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await prisma.$transaction(async (trx) => {
    await trx.otp.create({
      data: {
        otpCode: otp,
        expiresAt: expiresAt,
        userId: user.id,
      },
    });

    // send email
    await sendEmail(email, otp);
  });

  return {
    message: "Otp sent successfully",
  };
};

export const OtpService = {
  sentOtp,
};
