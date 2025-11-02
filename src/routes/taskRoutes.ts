import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  //   getTaskById,
  //   getTasks,
  //   updateTask,
  //   deleteTask,
  //   updateTaskChecklist,
  //   updateTaskStatus,
  createTask,
  //   getDashboardData,
  //   getUserDashboardData,
} from "../controllers/taskController";

const router = Router();

// ✅ Dashboard routes
// router.get("/dashboard-data", protect, getDashboardData);
// router.get("/user-dashboard-data", protect, getUserDashboardData);

// ✅ Task CRUD routes
// router.get("/", protect, getTasks);
// router.get("/:id", protect, getTaskById);
router.post("/", createTask);
// router.put("/:id", protect, updateTask);
// router.delete("/:id", adminOnly, deleteTask);

// ✅ Task-specific updates
// router.put("/:id/status", protect, updateTaskStatus);
// router.put("/:id/todo", protect, updateTaskChecklist);

export default router;
