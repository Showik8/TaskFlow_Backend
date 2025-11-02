import express from "express";
import {
  addProject,
  updateProject,
  getProjectById,
  getProjects,
  deleteProject,
  getUsersProject,
} from "../controllers/projectController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// CRUD Routes
router.post("/", protect, addProject); // Create project
router.get("/", protect, getProjects); // Get all projects
// router.get("/:id", getProjectById); // Get project by ID
router.put("/:id", updateProject); // Update project
router.delete("/:id", deleteProject); // Delete project
router.get("/users-projects/:id", getUsersProject);

export default router;
