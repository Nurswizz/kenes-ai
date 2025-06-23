import {Request, Response} from "express";
import { User, PLAN } from "../models/User";
import { authService } from "../services/authService";
import memberstackAdmin from "@memberstack/admin";
import dotenv from "dotenv";
dotenv.config();

const memberstack = memberstackAdmin.init(process.env.MEMBERSTACK_SECRET_KEY!);

export const authController = {
  register: async (req: Request, res: Response): Promise<any> => {
    const { firstName, lastName, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists", ok: false, status: 400 });
      }

      const memberstackUser = await memberstack.members.create({
        email: email,
        password: password,
        customFields: {
          firstName: firstName,
          lastName: lastName,
        },
        plans: [
          {
            planId: "pln_pro-2hiy0hlp"
          }
        ],
        loginRedirect: "/dashboard",
      });

      const memberstackId = memberstackUser.data.id;
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
      return res.status(500).json({
        message: "Error registering user",
        ok: false,
        status: 500,
        error: error.message,
      });
    }
  },
};
