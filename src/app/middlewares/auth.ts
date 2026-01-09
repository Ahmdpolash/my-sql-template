import { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import config from "../config";
import { jwtHelpers } from "../helpers/jwtHelpers";
import AppError from "../errors/AppError";
import { httpStatus } from "../utils/httpStatus";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../utils/prisma";

const auth = (...requiredRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get authorization token
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      // Verify token
      const verifiedToken = jwtHelpers.verifyToken(
        token,
        config.jwt.access.secret as string
      );

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: {
          id: verifiedToken.id,
        },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          isDeleted: true,
        },
      });

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!");
      }

      if (user.status === "Banned") {
        throw new AppError(httpStatus.FORBIDDEN, "Your account is blocked!");
      }
      if (user.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "Your account is Banned !");
      }

      req.user = user as JwtPayload;

      // Check role
      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
