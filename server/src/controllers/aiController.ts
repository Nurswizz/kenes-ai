import { Request, Response } from "express";
import { aiService } from "../services/aiService";
import { User, PLAN } from "../models/User";
import { UsageRecord } from "../models/UsageRecord";

const chat = async (
  req: Request & { user?: { id: string } },
  res: Response
): Promise<any> => {
  const { message, chatId } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User not logged in" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if ((user.chatTrials ?? 0) <= 0 && user.plan !== PLAN.PRO) {
    return res.status(403).json({ error: "Forbidden: No trials left" });
  }

  if (typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "Invalid message format" });
  }

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await aiService.chatAdvisor(message, chatId);
    if (!response || !response.answer) {
      return res.status(500).json({ error: "No response from chat advisor" });
    }

    if (user.plan !== PLAN.PRO) {
      user.chatTrials = (user.chatTrials ?? 0) - 1;
      await user.save();

      const usageRecord = new UsageRecord({
        userId: user._id,
        type: "chat",
        message: message,
        response: response.answer,
      });
      await usageRecord.save();
    }

    return res.status(200).json(response);
  } catch (error: any) {
    console.error("Error in chat:", error);
    return res
      .status(500)
      .json({ error: "Failed to communicate with chat advisor" });
  }
};

const styleCheck = async (
  req: Request & { user?: { id: string } },
  res: Response
): Promise<any> => {
  const { message } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User not logged in" });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if ((user.styleTrials ?? 0) <= 0 && user.plan !== PLAN.PRO) {
    return res
      .status(403)
      .json({ error: "Forbidden: No style check trials left" });
  }

  if (typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "Invalid message format" });
  }

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await aiService.checkStyle(message);
    if (!response) {
      return res.status(500).json({ error: "No response from style check" });
    }
    return res.status(200).json({ result: response });
  } catch (error: any) {
    console.error("Error in styleCheck:", error);
    return res
      .status(500)
      .json({ error: "Failed to check style of the message" });
  }
};

export const aiController = {
  chatAdvisor: chat,
  checkStyle: styleCheck,
};
