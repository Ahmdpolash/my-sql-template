// Controller: Handles HTTP requests for the Otp module.
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OtpService } from "./otp.service";
import { httpStatus } from "../../utils/httpStatus";

// Create
const sendOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await OtpService.sentOtp(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: result.message,
    data: null,
  });
});



export const OtpController = {
  sendOtp,
  
};
