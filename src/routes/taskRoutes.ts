import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  getProjectsTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
  createTask,
} from "../controllers/taskController";

const router = Router();

router.get("/:id", getProjectsTasks);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.put("/status/:id", protect, updateTaskStatus);
router.delete("/:id", deleteTask);

export default router;
