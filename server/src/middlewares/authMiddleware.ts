import memberstack from "@memberstack/admin";
import { NextFunction, Request, Response } from "express";

const apiKey = process.env.MEMBERSTACK_SECRET_KEY;
if (!apiKey) {
  throw new Error("MEMBERSTACK_API_KEY is not defined");
}
const memberstackClient = memberstack.init(apiKey);

export const authMiddleware = async (
  req: Request & { user?: { id: string } },
  res: Response,
  next: NextFunction
) : Promise<any> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const user = await memberstackClient.verifyToken({
      token,
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.user = { id: user.id };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
