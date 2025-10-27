import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(UserValidation.getAllUsersValidationSchema),
  UserController.getAllUsers
);

router.get(
  "/:userId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserController.getUserById
);

router.patch(
  "/:userId",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUser
);

router.delete(
  "/:userId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserController.deleteUser
);

router.patch(
  "/:userId/role",
  auth(UserRole.SUPER_ADMIN),
  UserController.updateUserRole
);

export const UserRoutes = router;
