import { Router } from "express";
import { aiController } from "../controllers/aiController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { planMiddleware } from "../middlewares/planMiddleware";
const router = Router();

router.post("/tools/chat-advisor", authMiddleware, planMiddleware, aiController.chatAdvisor);
router.post("/tools/style-check", authMiddleware, planMiddleware, aiController.checkStyle);
router.post("/tools/generate-letter", authMiddleware, planMiddleware, aiController.generateLetter);
router.post("/tools/simulator-chat/:id", authMiddleware, planMiddleware, aiController.chatSimulator);

export default router;
