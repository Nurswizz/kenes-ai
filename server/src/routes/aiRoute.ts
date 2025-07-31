import { Router } from "express";
import { aiController } from "../controllers/aiController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { planMiddleware } from "../middlewares/planMiddleware";
import { sanitizeBody } from "../middlewares/sanitizeMiddleware";
const router = Router();

router.post("/tools/chat-advisor", authMiddleware, planMiddleware, sanitizeBody, aiController.chatAdvisor);
router.post("/tools/style-check", authMiddleware, planMiddleware, sanitizeBody, aiController.checkStyle);
router.post("/tools/generate-letter", authMiddleware, planMiddleware, sanitizeBody, aiController.generateLetter);
router.post("/tools/simulator-chat/:id", authMiddleware, planMiddleware, sanitizeBody, aiController.chatSimulator);

export default router;
