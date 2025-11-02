import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProject extends Document {
  title: string;
  description?: string;
  tasks: Types.ObjectId[]; // array of Task IDs
  members: Types.ObjectId[]; // array of User IDs
  createdBy: Types.ObjectId; // User ID
}

const projectSchema: Schema<IProject> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", projectSchema);
