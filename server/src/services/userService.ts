import { User } from "../models/User";
import { UsageRecord } from "../models/UsageRecord";

import { feature } from "../models/UsageRecord";

const userService = {
  async getUsage(userId: string) {
    if (!userId) {
      throw new Error("Unauthorized: User not logged in");
    }

    const usageRecords = await UsageRecord.find({ userId }).sort({
      createdAt: -1,
    });

    return {
      usageRecords,
    };
  },

  async getUserById(userId: string) {
    if (!userId) {
      throw new Error("No User Id given");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
  async getUserByMemberStackId(memberstackId: string) {
    if (!memberstackId) {
      throw new Error("No Memberstack ID provided");
    }

    const user = await User.findOne({ memberstackId });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },

  async addUsageRecord(
    userId: string,
    featureKey: string,
    meta?: Record<string, any>
  ) {
    if (!userId) {
      throw new Error("Unauthorized: User not logged in");
    }

    const usageRecord = new UsageRecord({
      userId,
      featureKey,
      usedAt: new Date(),
      meta: meta || {},
    });

    await usageRecord.save();
    return usageRecord;
  },
  async updateUserPlan(userId: string, plan: string) {
    if (!userId) {
      throw new Error("Unauthorized: User not logged in");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.plan = plan;
    await user.save();

    return user;
  },

  async resetUsersAllTrials() {
    const users = await User.find({ plan: { $ne: "Pro" } });

    const updates = users.map((user) => ({
      updateOne: {
        filter: { _id: user._id },
        update: {
          $set: {
            letterTrials: 3,
            chatTrials: 3,
            styleTrials: 3,
          },
        },
      },
    }));

    if (updates.length > 0) {
      await User.bulkWrite(updates);
    }

    return updates.length;
  },
};
export { userService };
