import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";

import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import projectRoute from "./routes/projectRoute";

// ✅ Import routes (TypeScript paths)
// import authRoutes from "./routes/authRoutes";
// import userRoutes from "./routes/userRouter";
// import taskRoutes from "./routes/taskRoutes";
// import reportRoutes from "./routes/reportRoutes";

const app: Application = express();

// ✅ Parse URL Encoded data
app.use(express.urlencoded({ extended: true }));

// ✅ CORS setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Connect to MongoDB
connectDB();

// ✅ Parse JSON data
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/project", projectRoute);
// app.use("/api/report", reportRoutes);

// ✅ Static file serving (uploads folder)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
