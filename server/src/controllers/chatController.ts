import { Request, Response } from "express";
import { chatService } from "../services/chatService";

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
};
