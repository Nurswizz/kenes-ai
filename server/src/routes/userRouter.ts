import { Router } from "express";

import { userController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";


const userRouter = Router();

userRouter.get("/users/usage", authMiddleware, userController.getUsage);

userRouter.put("/users/plan", authMiddleware, userController.updatePlan);
userRouter.get("/users/me", authMiddleware, userController.getCurrentUser);
userRouter.put("/users/me", authMiddleware, userController.changeUserInfo);
userRouter.put(
  "/users/me/email",
  authMiddleware,
  userController.updateEmail
);
userRouter.post("/user/can-access-feature", authMiddleware, userController.canAccessFeature);

export default userRouter;
