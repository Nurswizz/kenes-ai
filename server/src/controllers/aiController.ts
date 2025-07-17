import { Request, Response } from "express";
import { aiService } from "../services/aiService";
import { User, PLAN } from "../models/User";
import { UsageRecord } from "../models/UsageRecord";
import { userService } from "../services/userService";
import { letterService } from "../services/letterService";
import { chatService } from "../services/chatService";
import { Types } from "mongoose";

const chatWithAdvisor = async (
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

  if (typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "Invalid message format" });
  }

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await aiService.chatAdvisor(message);
    if (!response || !response.reply) {
      return res.status(500).json({ error: "No response from chat advisor" });
    }
    let chat = await chatService.getAdvisorChatByUserId(userId);
    if (!chat) {
      chat = await chatService.createAdvisorChat(userId);
    }
    const chatId = chat!.id;
    await chatService.addMessageToChat(chatId, message, "user", "advisor");
    await chatService.addMessageToChat(
      chatId,
      response.reply,
      "bot",
      "advisor"
    );

    const usageRecord = new UsageRecord({
      userId: user._id,
      featureKey: "chat",
    });
    await usageRecord.save();

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
    await userService.addUsageRecord(userId, "style");
    return res.status(200).json({ result: response });
  } catch (error: any) {
    console.error("Error in styleCheck:", error);
    return res
      .status(500)
      .json({ error: "Failed to check style of the message" });
  }
};

const generateLetter = async (
  req: Request & { user?: { id: string } },
  res: Response
): Promise<any> => {
  const { details, recipient, sender } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User not logged in" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (typeof details !== "string" || details.trim() === "") {
    return res.status(400).json({ error: "Invalid details format" });
  }

  if (!recipient) {
    return res.status(400).json({ error: "Recipient is required" });
  }

  if (!sender) {
    return res.status(400).json({ error: "Sender is required" });
  }

  try {
    const pdf = await letterService.generateLetter(details, recipient, sender);

    const letter = await letterService.saveLetter({
      id: pdf.id,
      userId: userId,
      pdf_url: pdf.pdf_url,
    });

    await userService.addUsageRecord(userId, "letter", {
      letterId: pdf.id,
      pdf_url: pdf.pdf_url,
    });

    return res.status(200).json({ pdf });
  } catch (error: any) {
    console.error("Error in generateLetter:", error);
    return res.status(500).json({ error: "Failed to generate letter" });
  }
};

const chatSimulator = async (
  req: Request & { user?: { id: string } },
  res: Response
): Promise<any> => {
  const { message } = req.body;
  const userId = req.user?.id;
  const chatId = new Types.ObjectId(req.params.id);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User not logged in" });
  }
  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "Invalid message format" });
  }
  if (!chatId) {
    return res.status(400).json({ error: "No chatId provided" });
  }

  const chat = await chatService.getSimulatorChatById(chatId);
  if (!chat) {
    return res.status(404).json({ error: "Chat not found" });
  }

  try {
    const response = await aiService.chatSimulator(chatId, message);
    if (!response || !response.body) {
      return res.status(500).json({ error: "No response from chat simulator" });
    }
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    await chatService.addMessageToChat(chatId, message, "user", "simulator");
    const data = await chatService.addMessageToChat(
      chatId,
      response.body,
      "bot",
      "simulator"
    );

    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error in chatSimulator:", error);
    return res
      .status(500)
      .json({ error: "Failed to communicate with chat simulator" });
  }
};

export const aiController = {
  chatAdvisor: chatWithAdvisor,
  checkStyle: styleCheck,
  generateLetter: generateLetter,
  chatSimulator: chatSimulator,
};
