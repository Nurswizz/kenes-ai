import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";

const Feature = {
  letter: "letterTrials",
  style: "styleTrials",
  chat: "chatTrials",
} as const;

const checkPlan = async (
  req: Request & { user?: { id: string } },
  res: Response,
  next: NextFunction
): Promise<any> => {
  const userId = req.user?.id;
  const feature = req.body.feature as keyof typeof Feature;

  if (!userId) {
    return res.status(401).json({ message: "No userId provided" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.plan === "Pro") {
      return next();
    } else if (user.plan === "Free" && (user[Feature[feature]] ?? 0) > 0) {
      return next();
    } else {
      return res
        .status(403)
        .json({
          message:
            "Forbidden: You need a Pro plan or more trials to access this feature.",
        });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { checkPlan as planMiddleware };