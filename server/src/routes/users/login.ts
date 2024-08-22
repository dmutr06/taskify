import { Handler } from "express";
import { IUser, User, UserLoginDto } from "../../models/user";
import { auth } from "../../common/auth";
import { HttpError } from "../../errors/httpError";
import { AuthError } from "../../errors/authError";
import { asyncHandler } from "../../common/asyncHandler";
import { compare } from "bcrypt";
import logger from "../../logger";

export const POST: Handler = asyncHandler<UserLoginDto>(async ({ body }, res) => {
    if (!body || !("name" in body) || !("password" in body))
        throw HttpError.badRequest();
    
    const user = await User.findOne<IUser>({ name: body.name });

    if (!user || await compare(user.password, body.password)) throw AuthError.badNameOrPassword();

    logger.debug(user.tasks);

    const jwt = await auth(user.name, process.env.SECRET!);

    res.json({ jwt });
});
