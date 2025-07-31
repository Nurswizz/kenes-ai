import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoute";
import aiRoutes from "./routes/aiRoute";
import userRoutes from "./routes/userRouter";
import chatRouter from "./routes/chatRouter"
import cors from "cors";
import cookieParser from "cookie-parser";
import { prettyMorgan } from "./utils/morgan";

import "./jobs/montrhlyReset";

dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/kenes-ai";

console.log("Connecting to MongoDB with URI:", mongoUri);

mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

const app = express();

console.log("CORS origin set to:", process.env.CORS_ORIGIN);

app.use(cors({origin: process.env.CORS_ORIGIN, credentials: true, optionsSuccessStatus: 200, methods: "GET,HEAD,PUT,PATCH,POST,DELETE"}));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(prettyMorgan);

app.use("/api", authRoutes);
app.use("/api", aiRoutes);
app.use("/api", userRoutes);
app.use("/api", chatRouter);
app.get("/", (req, res) => {
  console.log("Original request URL:", req.headers.origin);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;