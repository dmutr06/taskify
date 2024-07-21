import { Schema, model } from "mongoose";

export interface IUser {
  name: string,
  email: string,
  password: string,
  createdAt: Date,
  tasks: Schema.Types.ObjectId[], 
}

export interface UserRegisterDto {
  name: string,
  email: string,
  password: string,
}

export interface UserLoginDto {
  name: string,
  password: string,
}

const userSchema = new Schema<IUser>({
    name: String,
    email: String,
    password: String,
    createdAt: Date,
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
});

export const User = model<IUser>("User", userSchema);

