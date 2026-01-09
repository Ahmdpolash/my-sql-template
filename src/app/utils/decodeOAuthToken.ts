import jwt from "jsonwebtoken";
import AppError from "../errors/AppError";




export const decodeOAuthToken = (token: string, provider: "google" | "apple") => {
  try {
   
    const decoded = jwt.decode(token) as any;

    if (!decoded) {
      throw new AppError(400, `Invalid ${provider} token format`);
    }

    // Validate token structure and required fields
    if (!decoded.email) {
      throw new AppError(400, `${provider} token missing email`);
    }

    // Check if token is expired
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new AppError(401, `${provider} token has expired`);
    }

    // Validate issuer for additional security
    if (provider === "google") {
      if (!decoded.iss?.includes("accounts.google.com")) {
        throw new AppError(400, "Invalid Google token issuer");
      }
    } else if (provider === "apple") {
      if (!decoded.iss?.includes("appleid.apple.com")) {
        throw new AppError(400, "Invalid Apple token issuer");
      }
    }

    // Extract user info based on provider
    return {
      email: decoded.email,
      name:
        decoded.name ||
        `${decoded.given_name || ""} ${decoded.family_name || ""}`.trim() ||
        (provider === "apple" ? "Apple User" : "Google User"),
      picture: decoded.picture || null,
      emailVerified: decoded.email_verified !== false, // Default to true if not specified
    };
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error(`${provider} token decode error:`, error);
    throw new AppError(401, `Invalid or malformed ${provider} token`);
  }
};