import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../config";

const generateJwtToken = (payload: any, secret: Secret, expiresIn: string) => {
  return jwt.sign(payload, secret, { expiresIn } as any);
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateJwtToken,
  verifyToken,
};

export interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  secure?: boolean;
  sameSite?: boolean | "lax" | "strict" | "none";
  path: string;
}

// for testing
// const accessTokenExpireDays = 1 / (24 * 60);
// const refreshTokenExpireDays = 2 / (24 * 60);

const accessTokenExpireDays = 1;
const refreshTokenExpireDays = 30;

// Access Token Cookie Options
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpireDays * 24 * 60 * 60 * 1000),
  maxAge: accessTokenExpireDays * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  secure: config.NODE_ENV === "production" ? true : false,
  path: "/",
};

// Refresh Token Cookie Options
export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpireDays * 24 * 60 * 60 * 1000), 
  maxAge: refreshTokenExpireDays * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  secure: config.NODE_ENV === "production" ? true : false,
  path: "/",
};
