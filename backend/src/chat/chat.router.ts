import Elysia, { t } from "elysia";
import { chatService } from "./chat.service";
import { userRepo, userService } from "../user";
import { jwt } from "@elysiajs/jwt";

export const chatRouter = new Elysia({ prefix: "/chat" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET! }))
  .use(chatService)
  .use(userService)
  .use(userRepo)
  // TODO: implement chats and messages
  .post("/send", async ({ body, sendNewMessage, getSignedUser }) => {
    const user = getSignedUser();

    void user;

    sendNewMessage(body);
    return { status: 201, message: "Message has been sent" };
  }, { isSignIn: true, body: t.Object({ chatId: t.String(), content: t.Unknown() }) })
  .ws("/", {
    query: t.Object({
      token: t.String(),
    }),
    body: t.String(),

    async open({ data: { query, jwt, getUser }, ...ws }) {
      const { token } = query;
      
      const payload = await jwt.verify(token);
      if (!payload) return ws.close();

      const user = await getUser(Number(payload.sub));
      if (!user) return ws.close();

      ws.subscribe(`notify:${user.id}`);
    },

    message(ws, chatId) {
      ws.subscribe(chatId);
    },
  });

