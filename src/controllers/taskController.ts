import { Request, Response } from "express";
import { User } from "../models/User";
import { Task } from "../models/Task";
import { Project } from "../models/Project";
import mongoose from "mongoose";

// Optional: define ITodo if you want
interface ITodo {
  title: string;
  completed: boolean;
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
      projectId,
    }: {
      title: string;
      description?: string;
      priority?: "Low" | "Medium" | "High";
      dueDate?: Date | string;
      assignedTo: string[]; // array of User IDs
      attachments?: string[];
      todoChecklist?: ITodo[];
      projectId: string; // project ID
    } = req.body;

    // Validate required fields
    if (!title || !projectId) {
      return res
        .status(400)
        .json({ message: "Title and projectId are required" });
    }

    // Validate project exists
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Validate assignedTo users
    if (!Array.isArray(assignedTo)) {
      return res
        .status(400)
        .json({ message: "assignedTo must be an array of user IDs" });
    }

    for (const userId of assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: `Invalid user ID: ${userId}` });
      }
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(404).json({ message: `User not found: ${userId}` });
      }
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      assignedTo,
      attachments,
      todoChecklist,
      project: projectId,
    });

    // Add task to project.tasks array
    project.tasks.push(task._id as mongoose.Types.ObjectId);

    await project.save();

    res.status(201).json({ message: "Task Created Successfully", task });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
