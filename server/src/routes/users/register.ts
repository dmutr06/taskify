import { IUser, User, UserRegisterDto } from "../../models/user";
import { auth } from "../../common/auth";
import { AuthError } from "../../errors/authError";
import { HttpError } from "../../errors/httpError";
import { asyncHandler } from "../../common/asyncHandler";
import { hash } from "bcrypt";

export const POST = asyncHandler<UserRegisterDto>(async ({ body }, res) => {
    if (!body || !("name" in body) || !("email" in body) || !("password" in body))
        throw HttpError.badRequest(); 
    
    if ((await User.findOne<IUser>({ name: body.name })))
        throw AuthError.nameAlreadyExists(); 
    if ((await User.findOne<IUser>({ email: body.email })))
        throw AuthError.emailAlreadyExists();

    const user = await User.create<IUser>({
        name: body.name,
        email: body.email,
        password: await hash(body.password, Number(process.env.SALT!)),
        createdAt: new Date(),
        tasks: [],
    });

    const jwt = await auth(user.name, process.env.SECRET!);

    res.json({ jwt });
});
