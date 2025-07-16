import { Request, Response } from "express";
import { userService } from "../services/userService";
import { chatService } from "../services/chatService";

export const userController = {
  getUser: async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "Memberstack ID is required" });
    }
    try {
      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error: any) {
      console.error("Error getting user:", error);
      return res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },
  getUsage: async (
    req: Request & { user?: { id: string } },
    res: Response
  ): Promise<any> => {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not logged in" });
    }

    try {
      const usageData = await userService.getUsage(userId);
      return res.status(200).json(usageData);
    } catch (error: any) {
      console.error("Error getting usage:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  },

  updatePlan: async (
    req: Request & { user?: { id: string } },
    res: Response
  ): Promise<any> => {
    const userId = req.user?.id;
    const { plan } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not logged in" });
    }

    if (!plan) {
      return res.status(400).json({ error: "Plan is required" });
    }

    try {
      const updatedUser = await userService.updateUserPlan(userId, plan);
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      console.error("Error updating plan:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  },

  getCurrentUser: async (
    req: Request & { user?: { id: string } },
    res: Response
  ): Promise<any> => {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not logged in" });
    }

    try {
      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error: any) {
      console.error("Error getting current user:", error);
      return res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  }

};
