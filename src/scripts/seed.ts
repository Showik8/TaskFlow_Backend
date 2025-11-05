import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db";
import { User } from "../models/User";
import { Project } from "../models/Project";
import { Task } from "../models/Task";
import bcrypt from "bcrypt";

async function run() {
  await connectDB();

  try {
    const email = "demo@taskflow.dev";
    const name = "Demo User";
    const password = "Demo@1234";

    // Upsert demo user
    let user = await User.findOne({ email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      user = await User.create({ name, email, password: hash });
    }

    // Create project
    const project = await Project.create({
      title: "Demo Project",
      description: "Seeded project for testing",
      members: [user._id],
      createdBy: user._id,
    });

    // Create tasks
    const t1 = await Task.create({
      title: "Setup_backend",
      description: "Initialize repo and server",
      priority: "High",
      assignedTo: [user._id],
      status: "inProgress",
      project: project._id,
    });

    const t2 = await Task.create({
      title: "Write_tests",
      description: "Add basic tests",
      priority: "Medium",
      assignedTo: [user._id],
      status: "todo",
      project: project._id,
    });

    project.tasks.push(
      t1._id as mongoose.Types.ObjectId,
      t2._id as mongoose.Types.ObjectId
    );
    await project.save();

    // Output summary
    console.log("Seed complete:\n", {
      demoUser: { email, password },
      projectId: (project._id as mongoose.Types.ObjectId).toString(),
      tasks: [t1.title, t2.title],
    });
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
