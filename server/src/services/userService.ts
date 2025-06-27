import { User } from "../models/User";
import { UsageRecord } from "../models/UsageRecord";
import { Chat, Message } from "../models/Chat";

const userService = {
  async getUsage(userId: string) {
    if (!userId) {
      throw new Error("Unauthorized: User not logged in");
    }

    const usageRecords = await UsageRecord.find({ userId })
      .sort({
        createdAt: -1,
      })
      .limit(5);

    return {
      usageRecords,
    };
  },
  async getChats(userId: string) {
    if (!userId) {
      throw new Error("Unauthorized: User not logged in");
    }

    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });

    if (!chats) {
      throw new Error("No chats found for this user");
    }

    return chats;
  },
  async getChatById(userId: string, chatId: string) {
    if (!userId) {
      throw new Error("Unauthorized: User not logged in");
    }

    const chat = await Chat.findOne({ userId, id: chatId });

    if (!chat) {
      throw new Error("Chat not found");
    }

    return chat;
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
  async getUserByMemberStackId(memberstackId: string ) {
    if (!memberstackId) {
      throw new Error("No Memberstack ID provided");
    }
    
    const user = await User.findOne({memberstackId});

    if (!user) {
      throw new Error("User not found");
    }

    return user; 
  },

  async createChat(userId: string, chatName: string) {
    if (!userId) {
      throw new Error("Unauthorized: User not logged in");
    }

    const chat = new Chat({
      name: chatName,
      userId,
      messages: [],
    });

    await chat.save();
    return chat;
  },

  async addMessageToChat(
    chatId: string,
    messageContent: string,
    role: "user" | "model"
  ) {
    if (!chatId || !messageContent || !role) {
      throw new Error("Invalid input for adding message to chat");
    }

    const message = new Message({
      chatId,
      content: messageContent,
      role,
    });

    await message.save();

    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }

    if (!chat.messages) {
      chat.messages = [];
    }
    chat.messages.push(message);
    await chat.save();

    return message;
  },
};
export { userService };
