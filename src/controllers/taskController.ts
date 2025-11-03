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
      status,
    }: {
      id: string;
      title: string;
      description?: string;
      priority?: "Low" | "Medium" | "High";
      dueDate?: Date | string;
      assignedTo: string[]; // array of User IDs
      attachments?: string[];
      todoChecklist?: ITodo[];
      projectId: string; // project ID
      status: "todo" | "inProgress" | "completed";
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
      status: status,
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

export const getProjectsTasks = async (req: Request, res: Response) => {
  try {
    const projectID = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(projectID)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(projectID).populate("tasks");

    res.send(project?.tasks);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Task ID" });
    }

    const project = await Task.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;

    // Validate task ID
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      projectId,
      status,
    }: {
      title?: string;
      description?: string;
      priority?: "Low" | "Medium" | "High";
      dueDate?: Date | string;
      assignedTo?: string[]; // array of user IDs
      projectId?: string;
      status?: "todo" | "inProgress" | "completed";
    } = req.body;

    if (projectId) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ message: "Invalid projectId" });
      }
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      existingTask.project = new mongoose.Types.ObjectId(projectId);
    }

    // Update task fields if provided
    if (title !== undefined) existingTask.title = title;
    if (description !== undefined) existingTask.description = description;
    if (priority !== undefined) existingTask.priority = priority;
    if (dueDate !== undefined)
      existingTask.dueDate = dueDate ? new Date(dueDate) : undefined;
    if (status !== undefined) existingTask.status = status;

    await existingTask.save();

    res
      .status(200)
      .json({ message: "Task updated successfully", task: existingTask });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

type ColumnType = "todo" | "inProgress" | "completed";

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { status } = req.body as { status?: ColumnType };

    // Validate status
    if (!status || !["todo", "inProgress", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    existingTask.status = status;
    await existingTask.save();

    res
      .status(200)
      .json({ message: "Task updated successfully", task: existingTask });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
