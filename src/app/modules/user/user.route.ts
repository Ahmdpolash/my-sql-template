import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { imageUpload } from "../../config/multer-config";
import AppError from "../../errors/AppError";
import auth from "../../middlewares/auth";
import { httpStatus } from "../../utils/httpStatus";
import { UserController } from "./user.controller";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserController.getAllUsers
);

router.get(
  "/:userId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserController.getUserById
);

router.patch(
  "/update",
  auth(),
  imageUpload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body?.data) {
        req.body = JSON.parse(req.body.data);
      }
      next();
    } catch {
      next(
        new AppError(httpStatus.BAD_REQUEST, "Invalid JSON in 'data' field")
      );
    }
  },

  // validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUser
);

router.delete(
  "/:userId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserController.deleteUser
);

// soft delete
router.delete(
  "soft/:userId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserController.softDeleteUser
);

router.patch(
  "/:userId/role",
  auth(UserRole.SUPER_ADMIN),
  UserController.updateUserRole
);

export const UserRoutes = router;
