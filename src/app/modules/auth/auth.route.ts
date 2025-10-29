import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = Router();

// register
router.post(
  "/register",
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.register
);

// login
router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login
);

// verify signup otp
router.post("/verify-signup-otp", AuthController.verifySignUpOtp);

// resent signup otp
router.post("/resend-signup-otp", AuthController.resendSignUpOtp);

// verify otp (eg: forgot password)
router.post("/verify-otp", AuthController.verifyOtp);

// resend otp (eg:forgot pass)
router.post("/resend-otp", AuthController.resendOtp);

//change password
router.put(
  "/change-password",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

// forget password

router.post("/forget-password", AuthController.forgetPassword);

router.get("/me", auth(), AuthController.getMe);

router.post("/refresh-token", AuthController.refreshToken);

export const AuthRoutes = router;
