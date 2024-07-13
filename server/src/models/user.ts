import { Schema, Model, model } from "mongoose";

export interface IUser {
  name: string,
  email: string,
  password: string,
  createdAt: Date,
}

const userSchema = new Schema<IUser, Model<IUser>>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true },
});

export const User = model<IUser, Model<IUser>>("User", userSchema);

