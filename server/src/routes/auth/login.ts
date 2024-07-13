import { Handler } from "express";


export const POST: Handler = (_req, res) => {
    res.send("login");
};

export const GET: Handler = (_req, res) => {
    res.send("get login");
};
