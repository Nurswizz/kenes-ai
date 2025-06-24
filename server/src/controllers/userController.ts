import { UsageRecord } from "../models/UsageRecord";
import { User, PLAN } from "../models/User";
import { Request, Response } from "express";

export const userController = {
  getUsage: async (
    req: Request & { user?: { id: string } },
    res: Response
  ): Promise<any> => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }

    try {
      const usageRecords = await UsageRecord.find({ userId }).sort({ createdAt: -1 });
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        usageRecords,
        plan: user.plan,
        chatTrials: user.chatTrials,
      });
    } catch (error) {
      console.error("Error fetching usage records:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};