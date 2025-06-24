import { Router } from "express";

import { userController } from "../controllers/userController";

const userRouter = Router();

userRouter.get("/users/usage", userController.getUsage)
userRouter.get("/users/chats", userController.getChats);
userRouter.get("/users/chats/:chatId", userController.getChatById);

userRouter.post("/users/chats", userController.createChat);
userRouter.put("/users/chats/:chatId", userController.updateChat);