import { Request, Response } from "express";
import mongoose from "mongoose";
import { Project } from "../models/Project";
import { User } from "../models/User";

// Create a new project
export const addProject = async (req: Request, res: Response) => {
  try {
    const { title, description, members, createdBy } = req.body;

    if (!title || !createdBy) {
      return res
        .status(400)
        .json({ message: "Title and createdBy are required" });
    }

    // Validate creator
    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({ message: "Invalid createdBy ID" });
    }

    const creatorExists = await User.findById(createdBy);
    if (!creatorExists) {
      return res.status(404).json({ message: "Creator user not found" });
    }

    const validMembers: mongoose.Types.ObjectId[] = [];
    if (Array.isArray(members)) {
      for (const email of members) {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          return res.status(404).json({ message: `User not found: ${email}` });
        }
        validMembers.push(user._id as mongoose.Types.ObjectId);
      }
    }

    const project = await Project.create({
      title,
      description,
      members: validMembers,
      createdBy,
    });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all projects
export const getProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find()
      .populate("members", "name email")
      .populate("tasks")
      .populate("createdBy", "name email");

    res.status(200).json({ projects });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a project by ID
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(id)
      .populate("members", "name email")
      .populate("tasks")
      .populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ project });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update project
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, members } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (title) project.title = title;
    if (description) project.description = description;

    if (Array.isArray(members)) {
      const validMembers: mongoose.Types.ObjectId[] = [];
      for (const memberId of members) {
        if (!mongoose.Types.ObjectId.isValid(memberId)) {
          return res
            .status(400)
            .json({ message: `Invalid member ID: ${memberId}` });
        }
        const userExists = await User.findById(memberId);
        if (!userExists) {
          return res
            .status(404)
            .json({ message: `User not found: ${memberId}` });
        }
        validMembers.push(memberId as mongoose.Types.ObjectId);
      }
      project.members = validMembers;
    }

    await project.save();

    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUsersProject = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }
    const projects = await Project.find({
      $or: [{ createdBy: userId }, { members: userId }],
    })
      .populate("members", "name email")
      .populate("tasks")
      .populate("createdBy", "name email");
    res.status(200).json({ projects });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
