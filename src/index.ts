import dotenv from "dotenv";
import { VercelRequest, VercelResponse } from "@vercel/node";
dotenv.config();

import express, { Application, Request, Response } from "express";
import cors from "cors";

import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import projectRoute from "./routes/projectRoute";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/project", projectRoute);

// const PORT = process.env.PORT || 5000;

export default (req: VercelRequest, res: VercelResponse) => app(req, res);

// export default app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
