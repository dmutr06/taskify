import { Handler } from "express";
import { UserRequest } from "../../common/customRequest";
import { asyncHandler } from "../../common/asyncHandler";
import { AuthError } from "../../errors/authError";
import { HttpError } from "../../errors/httpError";
import { User } from "../../models/user";
import { ITask, Task } from "../../models/task";

export const GET = asyncHandler(async ({ user: name, ...req }: UserRequest, res) => {
    if (!name) throw AuthError.unauthorized(); 
    if (!("id" in req.params)) throw HttpError.smthingWentWrong();

    const id = req.params.id;

    const user = await User.findOne({ name });

    if (!user) throw AuthError.unauthorized();

    const task = await Task.findById<ITask>(id).where({ owner: user.id });

    if (!task) throw HttpError.badRequest();

    res.json(task);
});

export const DELETE = asyncHandler(async ({ user: name, params }: UserRequest, res) => {
    if (!name) throw AuthError.unauthorized();
    if (!("id" in params)) throw HttpError.smthingWentWrong();

    const user = await User.findOne({ name });
    
    if (!user) throw AuthError.unauthorized();

    const task = await Task.findById(params.id).where({ owner: user.id });

    if (!task) throw HttpError.badRequest();

    await task.deleteOne();

    await user.updateOne({ $pull: { tasks: task.id } })

    res.send("Task has been deleted");
});


// TODO: update task
export const PUT: Handler = (req, res) => {
    res.send("Update task by id");
};

