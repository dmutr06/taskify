import { Elysia, redirect } from "elysia";
import * as client from "openid-client";
import { jwt } from "@elysiajs/jwt";
import { userRepo } from "../user";

const config = await client.discovery(
  new URL("https://accounts.google.com"),
  process.env.OAUTH_CLIENT_ID!,
  process.env.OAUTH_CLIENT_SECRET!,
);

export const authRouter = new Elysia({ prefix: "/auth" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET! }))
  .use(userRepo)
  .get("/google", ({ redirect }) => {
    const redirectTo = client.buildAuthorizationUrl(
      config,
      {
        redirect_uri: "http://localhost:6969/auth/google/callback",
        scope: "email profile",
    });

    return redirect(redirectTo.href);
  })
  .get("/google/callback", async ({ request, jwt, createUserOrGetIfExists, redirect }) => {
    const tokens = await client.authorizationCodeGrant(config, request);

    const userInfo = await client.fetchUserInfo(config, tokens.access_token, tokens.claims()?.sub!);

    const user = await createUserOrGetIfExists({ name: userInfo.name!, email: userInfo.email! });

    const token = await jwt.sign({ sub: String(user.id) });

    return redirect(`http://localhost:5173/auth/callback?token=${token}`);
  });
