import { asyncHandler } from "../../common/asyncHandler";
import { UserRequest } from "../../common/customRequest";
import { AuthError } from "../../errors/authError";
import { User } from "../../models/user";


export const GET = asyncHandler(async ({ user: name }: UserRequest, res) => {
  if (!name)
    throw AuthError.unauthorized();

  const user = await User.findOne({ name });

  if (!user)
    throw AuthError.unauthorized();

  res.json({ total: user.tasks.length });
});
