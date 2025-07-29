import { User } from "../models/User";
import type { IUser } from "../models/User";
import { hashPassword, comparePassword } from "../utils/crypt";
import { generateTokens, verifyToken } from "../utils/token";
import { Request, Response } from "express";

const transformUser = (user: IUser) => {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    // isEmailVerified: user.isEmailVerified,
    metadata: user.metadata,
  };
};
const authController = {
  login: async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found", status: 404 });
      }
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Invalid password", status: 401 });
      }
      const transformedUser = transformUser(user);
      const { accessToken, refreshToken } = generateTokens(user);
      user.metadata.lastLogin = new Date();
      await user.save();
      return res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({ user: transformedUser, accessToken, status: 200 });
    } catch (error) {
      console.error("Error logging in user:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", status: 500 });
    }
  },
  register: async (req: Request, res: Response): Promise<any> => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", status: 400 });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    try {
      const savedUser = await newUser.save();
      const transformedUser = transformUser(savedUser);
      const { accessToken, refreshToken } = generateTokens(savedUser);
      return res
        .status(201)
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({ user: transformedUser, accessToken, status: 201 });
    } catch (error) {
      console.error("Error registering user:", error);
      if ((error as any).name === "TokenExpiredError") {
        return res.status(401).json({ message: "Refresh token expired" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  logout: async (req: Request, res: Response): Promise<any> => {
    return res
      .status(200)
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 0,
      })
      .json({ message: "Logged out successfully", status: 200 });
  },
  refreshToken: async (req: Request, res: Response): Promise<any> => {
    const { refreshToken } = req.cookies;
    console.log(refreshToken);
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Refresh token is required", status: 401 });
    }
    try {
      const decoded = verifyToken(
        refreshToken,
        "refresh"
      ) as import("jsonwebtoken").JwtPayload & { id: string };

      if (!decoded || typeof decoded === "string") {
        return res
          .status(401)
          .json({ message: "Invalid refresh token", status: 401 });
      }
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found", status: 404 });
      }
      const { accessToken, refreshToken: newRefreshToken } =
        generateTokens(user);
      return res
        .status(200)
        .cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({ accessToken, status: 200 });
    } catch (error: any) {
      console.error("Error refreshing token:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error", status: 500 });
    }
  },
};

export default authController;
