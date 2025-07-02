import { Router } from "express";

import { userController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRouter = Router();

userRouter.get("/users/usage", authMiddleware, userController.getUsage);
userRouter.get("/users/chats", authMiddleware, userController.getChats);
userRouter.get(
  "/users/chats/:chatId",
  authMiddleware,
  userController.getChatById
);
userRouter.get(
  "/users/memberstack/:memberstackId",
  authMiddleware,
  userController.getUser
);

userRouter.post("/users/chats", authMiddleware, userController.createChat);

userRouter.put("/users/plan", authMiddleware, userController.updatePlan);

export default userRouter;
