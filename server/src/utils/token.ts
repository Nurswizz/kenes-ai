import jwt from "jsonwebtoken";
import type { IUser } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;
if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
  console.error("Environment variables missing:", {
    JWT_ACCESS_SECRET: !!JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: !!JWT_REFRESH_SECRET,
  });
  throw new Error(
    "JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be defined in environment variables"
  );
}
const generateTokens = (user: IUser) => {
  const accessToken = jwt.sign({ id: user._id }, JWT_ACCESS_SECRET || "", {
    expiresIn: "15m",
    algorithm: "HS256",
  });
  const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET || "", {
    expiresIn: "7d",
    algorithm: "HS256",
  });
  return { accessToken, refreshToken };
};

const verifyToken = (token: string, type: "access" | "refresh") => {
  try {
    const secret = type === "access" ? JWT_ACCESS_SECRET : JWT_REFRESH_SECRET;
    const decoded = jwt.verify(token, secret || "") as jwt.JwtPayload & {
      id: string;
    };
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return null;
    }
    console.error("Error verifying token:", error);
    return null;
  }
};

export { generateTokens, verifyToken };
