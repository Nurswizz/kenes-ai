import jwt from "jsonwebtoken";
import type {IUser} from  "../models/User";
import dotenv from "dotenv";

dotenv.config();

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;
const generateTokens = (user: IUser) => {
  const accessToken = jwt.sign({ id: user._id }, JWT_ACCESS_SECRET || "", {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET || "", {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const verifyToken = (token: string, type: "access" | "refresh") => {
  const secret = type === "access" ? JWT_ACCESS_SECRET : JWT_REFRESH_SECRET;
  const verified = jwt.verify(token, secret || "");
  if (!verified) {
    throw new Error("TokenExpiredError");
  }
  const decoded = jwt.decode(token);
  return decoded;
};


export {
  generateTokens,
  verifyToken,
};
