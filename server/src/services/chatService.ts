import { ChatMessage, AdvisorChat, IAdvisorChat } from "../models/Chat";
import { ObjectId } from "mongoose";

const chatService = {
  async createAdvisorChat(userId: string) {
    if (!userId) {
      throw new Error("No userId provided");
    }

    try {
      const newChat = new AdvisorChat({
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await newChat.save();
      return newChat;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async addMessageToChat(
    chatId: ObjectId,
    text: string,
    from: "user" | "bot",
    chatType: string
  ) {
    if (!chatId || !text || !from) {
      throw new Error("Missing required parameters");
    }

    try {
      const newMessage = new ChatMessage({
        chatId,
        text,
        from,
        chatType: chatType,
        createdAt: new Date(),
      });
      await newMessage.save();
      return newMessage;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async getChatMessages(chatId: ObjectId) {
    if (!chatId) {
      throw new Error("No chatId provided");
    }

    try {
      const messages = await ChatMessage.find({ chatId }).sort({
        createdAt: 1,
      });
      return messages;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  async getAdvisorChatByUserId(userId: string) {
    if (!userId) {
      throw new Error("No userId provided");
    }

    try {
      const chat = await AdvisorChat.findOne({ userId });
      return chat;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export { chatService };
