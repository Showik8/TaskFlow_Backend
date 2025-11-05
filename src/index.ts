import dotenv from "dotenv";
dotenv.config();
// import { VercelRequest, VercelResponse } from "@vercel/node";

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
    origin: ["https://task-flow-pro-theta.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "authorization"],
  })
);

connectDB();

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "hello" });
});

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/project", projectRoute);

const PORT = process.env.PORT || 5000;

export default app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
// export default (req: VercelRequest, res: VercelResponse) => app(req, res);
