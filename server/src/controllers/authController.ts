import {Request, Response} from "express";
import { User, PLAN } from "../models/User";
import dotenv from "dotenv";
dotenv.config();


export const authController = {
  register: async (req: Request, res: Response): Promise<any> => {
    const { firstName, lastName, email, memberstackId } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(200)
          .json({ message: "User already exists", ok: true, status: 200 });
      }

      const newUser = new User({
        firstName,
        lastName,
        email,
        memberstackId,
        createdAt: new Date(),
        plan: PLAN.FREE,
      });
      await newUser.save();
      return res.status(201).json({
        message: "User registered successfully",
        ok: true,
        status: 201,
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          plan: newUser.plan,
        },
      });
    } catch (error: any) {
      console.error("Error registering user:", error);
      return res.status(500).json({
        message: "Error registering user",
        ok: false,
        status: 500,
        error: error.message,
      });
    }
  },
};
