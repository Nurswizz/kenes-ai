import { Request, Response } from "express";
import { userService } from "../services/userService";

export const userController = {
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
  getChats: async (
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
      const chats = await userService.getChats(userId);
      return res.status(200).json(chats);
    } catch (error: any) {
      console.error("Error getting chats:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  },
  getChatById: async (
    req: Request & { user?: { id: string } },
    res: Response
  ): Promise<any> => {
    const userId = req.user?.id;
    const chatId = req.params.chatId;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not logged in" });
    }

    try {
      const chat = await userService.getChatById(userId, chatId);
      return res.status(200).json(chat);
    } catch (error: any) {
      console.error("Error getting chat by ID:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  },
  createChat: async (
    req: Request & { user?: { id: string } },
    res: Response
  ): Promise<any> => {
    const userId = req.user?.id;
    const { chatName } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not logged in" });
    }

    if (!chatName) {
      return res.status(400).json({ error: "Chat name is required" });
    }

    try {
      const newChat = await userService.createChat(userId, chatName);
      return res.status(201).json(newChat);
    } catch (error: any) {
      console.error("Error creating chat:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  },

  updateChat: async (
    req: Request & { user?: { id: string } },
    res: Response
  ): Promise<any> => {
    const userId = req.user?.id;
    const { chatId, messageContent} = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not logged in" });
    }

    try {
      const updatedChat = await userService.addMessageToChat(
        chatId,
        messageContent,
        "user"
      );
      return res.status(200).json(updatedChat);
    } catch (error: any) {
      console.error("Error updating chat:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  },
};
