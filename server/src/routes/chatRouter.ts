import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { chatController } from "../controllers/chatController";

const router = Router();

router.get("/chat/advisor-messages", authMiddleware, chatController.getAdvisorChatMessages);

export default router;