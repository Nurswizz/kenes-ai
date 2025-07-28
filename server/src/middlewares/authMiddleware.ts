import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/token";

export const authMiddleware = async (
  req: Request & { user?: { id: string } },
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.headers.authorization?.split(" ")[1] || "";
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const user = await verifyToken(token, "access");

  if (!user) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }

  const { id } = user as JwtPayload & { id: string };
  req.user = { id };
  next();
};
