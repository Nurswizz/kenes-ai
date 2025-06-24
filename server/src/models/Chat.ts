import { Schema, model } from 'mongoose';

interface IMessage {
    id: string;
    chatId: string; 
    content: string;
    role: "user" | "model"
    createdAt: Date;
    updatedAt: Date;
}

interface IChat {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string; 
    messages?: IMessage[];
}

const messageSchema = new Schema<IMessage>({
    id: { type: String, required: true },
    chatId: { type: String, required: true },
    content: { type: String, required: true },
    role: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const chatSchema = new Schema<IChat>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    userId: { type: String, required: true }, 
    messages: [messageSchema]
});

const Chat = model<IChat>('Chat', chatSchema);
const Message = model<IMessage>('Message', messageSchema);

export { Chat, Message, IChat, IMessage };

