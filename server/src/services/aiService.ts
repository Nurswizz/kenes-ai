import axios from "axios";
import OpenAI from "openai";
import { config } from "dotenv";
import { userService } from "./userService";
config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const chatAdvisor = async (message: string, chatId: string) => {
  try {
    const response = await axios.post(
      "https://bot.minjustice.kz/chat",
      {
        message: message,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    await userService.addMessageToChat(chatId, message, "user");
    await userService.addMessageToChat(chatId, response.data.reply, "model");

    return response.data;
  } catch (error: any) {
    console.error("Error in chatAdvisor:", error);
    throw new Error("Failed to communicate with chat advisor");
  }
};
const checkStyle = async (message: string) => {
  try {
    const prompt = `Ты — профессиональный редактор и специалист по деловой переписке. Твоя задача — оценить письмо, предназначенное для бизнес- или академической аудитории, и выдать точный, бескомпромиссный анализ его соответствия деловому стилю.

Требования к письму:

1. Письмо должно быть формальным, вежливым и лаконичным.
2. Допускается только нейтральная или уважительная лексика — без разговорных, эмоциональных, неопределённых или излишне пафосных выражений.
3. Грамматика, орфография и пунктуация должны быть безошибочны.
4. Структура письма должна включать: вежливое вступление, чёткую формулировку цели, логичное развитие и корректное завершение.
5. Язык письма должен быть ориентирован на профессионалов: никаких сокращений, сленга или жаргона (если это не допустимо в отрасли).
6. Если письмо предполагает просьбу, требование или предложение — должно быть соблюдено уважительное и корректное оформление.

---

Проанализируй письмо, которое находится между символами "<>". Если оно не соответствует деловому стилю, предложи переписанный вариант. А если письмо приемлемо, просто ответь "Письмо соответствует деловому стилю".

Если письмо неприемлемо — скажи об этом прямо и перепиши его полностью в деловом стиле. Ответь только переписанной версией письма, без дополнительных комментариев.`;

    const ms = [
      {
        role: "system",
        content: prompt,
      },
      { role: "user", content: `<>${message}<>` },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: ms as any[],
      max_tokens: 1000,
    });

    return response;
  } catch (error: any) {
    console.error("Error in checkStyle:", error);
    throw new Error("Failed to check style");
  }
};
export const aiService = {
  chatAdvisor,
  checkStyle,
};
