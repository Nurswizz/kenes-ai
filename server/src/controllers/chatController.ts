import { Request, Response } from "express";
import { chatService } from "../services/chatService";
import { Types } from "mongoose";

export const chatController = {
  getAdvisorChatMessages: async (
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
      const chat = await chatService.getAdvisorChatByUserId(userId);

      if (!chat) {
        const chat = await chatService.createAdvisorChat(userId);
        return res.status(200).json({ messages: [] });
      }

      const messages = await chatService.getChatMessages(chat?.id)

      return res.status(200).json({messages: messages});
    } catch (error: unknown) {
        console.error(error);
        const message = error instanceof Error ? error.message : "Internal server error";
        return res
          .status(500)
          .json({ error: message });
    }
  },
  
  getSimulatorChats: async (
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
      const chats = await chatService.getSimulatorChatsByUserId(userId);
      return res.status(200).json({ chats });
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Internal server error";
      return res
        .status(500)
        .json({ error: message });
    }
  },
  getSimulatorChatMessages: async (
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

    if (!chatId) {
      return res
        .status(400)
        .json({ error: "No chatId provided" });
    }

    try {
      const messages = await chatService.getChatMessages(new Types.ObjectId(chatId));
      return res.status(200).json({ messages });
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Internal server error";
      return res
        .status(500)
        .json({ error: message });
    }
  }, 
  createSimulatorChat: async (
    req: Request & { user?: { id: string } },
    res: Response
  ): Promise<any> => {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not logged in" });
    }

    const { scenario } = req.body;

    if (!scenario) {
      return res
        .status(400)
        .json({ error: "No scenario provided" });
    }

    try {
      const chat = await chatService.createSimulatorChat(userId, scenario);
      return res.status(201).json({ chat });
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Internal server error";
      return res
        .status(500)
        .json({ error: message });
    }
  },

  getSimulatorChatById: async (
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

    if (!chatId) {
      return res
        .status(400)
        .json({ error: "No chatId provided" });
    }

    try {
      const chat = await chatService.getSimulatorChatById(new Types.ObjectId(chatId));
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      return res.status(200).json({ chat });
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Internal server error";
      return res
        .status(500)
        .json({ error: message });
    }
  }
};
