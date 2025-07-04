import { Schema, model } from "mongoose";
import type { ObjectId } from "mongoose";

interface IChatMessage {
  _id: ObjectId;
  from: "system" | "user" | "bot";
  text: string;
  chatId: ObjectId;
  chatType: "advisor" | "simulator";
  createdAt: Date;
  meta?: Record<string, any>;
}

interface IAdvisorChat {
  _id: ObjectId;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface ISimulatorChat {
  _id: ObjectId;
  userId: ObjectId;
  scenario: string;
  isCompleted: boolean;
  startedAt: Date;
  endedAt?: Date;
}

const chatMessageSchema = new Schema<IChatMessage>({
  from: { type: String, enum: ["system", "user", "bot"], required: true },
  chatId: { type: Schema.Types.ObjectId, refPath: "chatType", required: true },
  chatType: { type: String, enum: ["advisor", "simulator"], required: true },
  text: {type: String, required: true},
  createdAt: { type: Date, default: Date.now },
  meta: { type: Object, default: {} },
});
const advisorChatSchema = new Schema<IAdvisorChat>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const simulatorChatSchema = new Schema<ISimulatorChat>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  scenario: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
});

const ChatMessage = model<IChatMessage>("ChatMessage", chatMessageSchema);
const AdvisorChat = model<IAdvisorChat>("AdvisorChat", advisorChatSchema);
const SimulatorChat = model<ISimulatorChat>("SimulatorChat", simulatorChatSchema);

export {
  IChatMessage,
  IAdvisorChat,
  ISimulatorChat,
  ChatMessage,
  AdvisorChat,
  SimulatorChat
};
