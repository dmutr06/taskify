import { asyncHandler } from "../../common/asyncHandler";
import { authMiddleware } from "../../common/auth";
import { UserRequest } from "../../common/customRequest";
import { AuthError } from "../../errors/authError";
import { User } from "../../models/user";


export const GET = [authMiddleware, asyncHandler(async ({ user: name }: UserRequest, res) => {
    if (!name)
      throw AuthError.unauthorized();

    const user = await User.findOne({ name }).populate("tasks");

    if (!user)
      throw AuthError.unauthorized();

    res.json({ name: user.name, email: user.email, tasks: user.tasks });
})];
