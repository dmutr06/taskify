import { model, Schema } from "mongoose";

export interface ITask {
    title: string,
    description: string,
    priority: string, 
    createdAt: Date,
    owner: Schema.Types.ObjectId,
}

export interface TaskCreateDto {
  title: string,
  description: string,
  priority: string,
}

export interface TaskUpdateDto {
  title?: string,
  description?: string,
  priority?: string,
}

const taskSchema = new Schema<ITask>({
    title: String,
    description: String,
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },
    createdAt: Date,
    owner: { type: Schema.Types.ObjectId, ref: "User" }, 
});

export const Task = model<ITask>("Task", taskSchema);
