import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { chatController } from "../controllers/chatController";

const router = Router();

router.get("/chat/advisor-messages", authMiddleware, chatController.getAdvisorChatMessages);
router.get("/chat/simulator-chats", authMiddleware, chatController.getSimulatorChats);
router.post("/chat/simulator-chats", authMiddleware, chatController.createSimulatorChat);
router.get("/chat/simulator-chats/:chatId/messages", authMiddleware, chatController.getSimulatorChatMessages);
router.get("/chat/simulator-chats/:chatId", authMiddleware, chatController.getSimulatorChatById);

export default router;