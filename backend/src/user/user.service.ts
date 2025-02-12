import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { userRepo } from "./user.repository";
import { User } from "@prisma/client";

const users = new Map<string, User>();

export const userService = new Elysia({ name: "service/user" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET! }))
  .use(userRepo)
  .macro({
    isSignIn: {
        async resolve({ headers }) {
          const token = headers.authorization!;
          return { getSignedUser: () => users.get(token)! };
        },
        async beforeHandle({ jwt, headers, getUser }) {
          const maybeUser = await jwt.verify(headers["authorization"]);

          if (!maybeUser || !maybeUser.sub) return { status: 401, message: "Unauthorized" };

          const user = await getUser!(maybeUser.sub);

          if (!user) return { status: 401, message: "Unauthorized" };

          users.set(headers.authorization!, user);
        },

        async afterHandle({ headers }) {
          if (!headers.authorization) return;
          users.delete(headers.authorization);
        }
    },
  });
