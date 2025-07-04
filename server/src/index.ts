import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoute";
import aiRoutes from "./routes/aiRoute";
import userRoutes from "./routes/userRouter";
import chatRouter from "./routes/chatRouter"
import cors from "cors";

dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/kenes-ai";

mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

const app = express();

app.use(cors({origin: process.env.CORS_ORIGIN, credentials: true, optionsSuccessStatus: 200, methods: "GET,HEAD,PUT,PATCH,POST,DELETE"}));

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", aiRoutes);
app.use("/api", userRoutes);
app.use("/api", chatRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;