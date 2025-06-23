import express from "express";
import { authController } from "../controllers/authController";

const router = express.Router();

router.post("/auth/sync-member", authController.register);

export default router;