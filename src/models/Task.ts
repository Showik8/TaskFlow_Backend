import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  priority?: "Low" | "Medium" | "High";
  dueDate?: Date;
  assignedTo: Types.ObjectId[];
  status: "todo" | "inProgress" | "completed";
  project: Types.ObjectId;
}

const taskSchema: Schema<ITask> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: { type: Date },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["todo", "inProgress", "completed"],
      default: "todo",
    },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
