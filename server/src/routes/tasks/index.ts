import { Handler } from "express";


export const POST: Handler = (_req, res) => {
    res.send("Create task");
};

export const GET: Handler = (_req, res) => {
    res.send("Get all tasks");
};
