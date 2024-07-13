import { Handler } from "express";
import { IUser, User } from "../../models/user";

export const GET: Handler = (_req, res) => {
    res.send("Get all users");
};

export const POST: Handler = async (req, res) => {
    if (!("name" in req.body && "email" in req.body)) return res.status(400).json({ type: "Bad body" });
    res.json();
};

