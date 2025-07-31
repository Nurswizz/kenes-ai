import express from "express";
import authController from "../controllers/authController";
import { sanitizeBody } from "../middlewares/sanitizeMiddleware";

const router = express.Router();

router.post("/auth/register", sanitizeBody, authController.register);
router.post("/auth/login", sanitizeBody, authController.login);
router.post("/auth/logout", sanitizeBody, authController.logout);
router.post("/auth/refresh-token", sanitizeBody, authController.refreshToken);

export default router;