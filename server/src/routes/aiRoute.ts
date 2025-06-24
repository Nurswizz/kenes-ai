import { Router } from "express";
import { aiController } from "../controllers/aiController";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = Router();

router.post("/tools/chat-advisor", authMiddleware, aiController.chatAdvisor);
router.post("/tools/style-check", authMiddleware, aiController.checkStyle);

export default router;
