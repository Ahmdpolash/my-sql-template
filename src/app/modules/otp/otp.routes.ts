// Routes: CRUD endpoints for Otp module.
import { Router } from "express";
import { OtpController } from "./otp.controller";
import validateRequest from "../../middlewares/validateRequest";
import { OtpValidation } from "./otp.validation";

const router = Router();

router.post("/send", validateRequest(OtpValidation.SendOtpValidation), OtpController.sendOtp);



export const OtpRoutes = router;
