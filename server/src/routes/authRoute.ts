import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);
router.post("/auth/refresh-token", authController.refreshToken);

export default router;