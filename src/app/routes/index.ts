import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { FileUploadRoutes } from "../modules/fileUpload/fileUpload.routes";
import { OtpRoutes } from "../modules/otp/otp.routes";
import { UserRoutes } from "../modules/user/user.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/otp",
    route: OtpRoutes,
  },
  {
    path: "/files",
    route: FileUploadRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
