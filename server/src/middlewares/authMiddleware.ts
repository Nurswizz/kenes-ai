import memberstack from "@memberstack/admin";
import { NextFunction, Request, Response } from "express";
import { userService } from "../services/userService";
const apiKey = process.env.MEMBERSTACK_SECRET_KEY;
if (!apiKey) {
  throw new Error("MEMBERSTACK_API_KEY is not defined");
}
const memberstackClient = memberstack.init(apiKey);

export const authMiddleware = async (
  req: Request & { user?: { id: string } },
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.headers.authorization?.split(" ")[1] || "";
  if (!token) {
    console.log("No token provided in request headers");
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const user = await memberstackClient.verifyToken({
    token,
  });

  if (!user) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
  const { id } = await userService.getUserByMemberStackId(user.id);
  req.user = { id };
  next();
};
