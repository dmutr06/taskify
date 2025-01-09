import { UserRequest } from "../../common/customRequest";
import { AuthError } from "../../errors/authError";
import { ITask, Task, TaskCreateDto } from "../../models/task";
import { asyncHandler } from "../../common/asyncHandler";
import { HttpError } from "../../errors/httpError";
import { User } from "../../models/user";
import { authMiddleware } from "../../common/auth";

export const POST = asyncHandler(async ({ body, user: name }: UserRequest<TaskCreateDto>, res) => {
    if (!name) throw HttpError.smthingWentWrong(); 
    
    if (!body || !("priority" in body) || !("title" in body) || !("description" in body))
        throw HttpError.badRequest();
    
    const user = await User.findOne({ name });
    
    if (!user)
      throw AuthError.unauthorized();
    
    const task = await Task.create<ITask>({
        title: body.title,
        description: body.description,
        priority: body.priority,
        createdAt: new Date(),
        owner: user.id 
    });

    user.tasks.push(task.id);

    await user.save();

    res.json(task);
});

export const GET = asyncHandler(async ({ user: name, query }: UserRequest, res) => {
    if (!name) throw HttpError.smthingWentWrong();
    
    const user = await User.findOne({ name }).populate("tasks");

    if (!user) throw AuthError.unauthorized();

    const offset = Number(query.offset);
    const limit = Number(query.limit) || Infinity;


    if (user.tasks.length == 0) return void res.json([]);  
    if (offset >= user.tasks.length) throw HttpError.badRequest();

    res.json(user.tasks.splice(offset, limit));

});

export const MIDDLEWARE = authMiddleware;
