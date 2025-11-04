import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  getProjectsTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
  createTask,
  getTaskByTitle,
} from "../controllers/taskController";

const router = Router();

router.get("/:id", getProjectsTasks);
router.get("/", protect, getTaskByTitle);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.put("/status/:id", protect, updateTaskStatus);
router.delete("/:id", protect, deleteTask);

export default router;
