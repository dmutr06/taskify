import { Handler } from "express";


export const GET: Handler = (_req, res) => {
    res.send("Get task by id");
};

export const DELETE: Handler = (_req, res) => {
    res.send("Delete task by id");
};
