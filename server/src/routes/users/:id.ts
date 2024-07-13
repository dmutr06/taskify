import { Handler } from "express";
import { IUser, User } from "../../models/user";


export const GET: Handler[] = [
    (req, res, next) => {
        if (req.params.id.length < 1) return res.send("Bad name");
        next();
    },
    async (req, res) => res.send(await User.findOne<IUser>({ name: req.params.id })),
];
