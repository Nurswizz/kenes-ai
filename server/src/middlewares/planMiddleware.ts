import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";

const FeatureMap = {
  letter: "letterTrials",
  style: "styleTrials",
  chat: "chatTrials",
} as const;

type FeatureKey = keyof typeof FeatureMap;

const planMiddleware = async (
  req: Request & { user?: { id: string } },
  res: Response,
  next: NextFunction
): Promise<any> => {
  const userId = req.user?.id;
  const { feature } = req.body as { feature: FeatureKey };
  if (!feature) {
    return res.status(400).json({ message: "Feature not provided" });
  }
  if (typeof feature !== "string" || !Object.keys(FeatureMap).includes(feature)) {
    return res.status(400).json({ message: "Invalid feature provided" });
  }
  if (!userId) {
    return res.status(401).json({ message: "No userId provided" });
  }

  if (!FeatureMap[feature]) {
    return res.status(400).json({ message: "Invalid feature provided" });
  }

  try {
    const trialField = FeatureMap[feature];

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.plan === "Pro") return next();

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, [trialField]: { $gt: 0 } }, 
      { $inc: { [trialField]: -1 } },
      { new: true }
    );


    if (!updatedUser) {
      return res.status(403).json({
        message:
          "Forbidden: You need a Pro plan or more trials to access this feature.",
      });
    }

    return next();
  } catch (error) {
    console.error("Plan middleware error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { planMiddleware };
