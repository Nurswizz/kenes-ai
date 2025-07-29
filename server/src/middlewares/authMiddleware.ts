import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/token";

export const authMiddleware = async (
  req: Request & { user?: { id: string } },
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  if (!req.cookies.refreshToken) {
    console.error("Unauthorized: No refresh token provided");
    return res.status(401).json({ error: "Unauthorized: No refresh token provided" });
  }
  const user = await verifyToken(token, "access");

  if (!user) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }

  const { id } = user as JwtPayload & { id: string };
  req.user = { id };
  next();
  } catch(error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    }
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
