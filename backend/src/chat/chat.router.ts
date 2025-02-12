import Elysia, { t } from "elysia";
import { chatRepo } from "./chat.repo";
import { userRepo, userService } from "../user";
import { jwt } from "@elysiajs/jwt";

export const chatRouter = new Elysia({ prefix: "/chats" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET! }))
  // .use(chatService)
  .use(chatRepo)
  .use(userService)
  .use(userRepo)
  .get("/", async ({ getSignedUser, getUsersChats }) => {
    const user = getSignedUser();

    return await getUsersChats(user.id)!;
  }, 
  {  
    isSignIn: true
  })
  .post("/create-private", async ({ body: { userId }, getSignedUser, createPrivateChat }) => {
    const user = getSignedUser();

    const chat = await createPrivateChat([user.id, userId]);

    if (chat) return { status: 201, chat };

    return { status: 400, message: "Bad request" };
  }, 
  {
    body: t.Object({
      userId: t.String(),
    }),
    isSignIn: true,
  })
  .post("/create-group", async ({ body, getSignedUser, createGroup }) => {
    const user = getSignedUser();

    if (body.initialUsers.length < 1) return { status: 400, message: "Bad request" };
    
    const group = await createGroup(body.name, [user.id, ...body.initialUsers]);

    if (!group) return { status: 400, message: "Bad request" };
    return { status: 201, message: "Created" };
  }, 
  {
    isSignIn: true,
    body: t.Object({
      name: t.String(),
      initialUsers: t.Array(t.String()),
    })
  })
  .get("/:id", async ({ params: { id }, getChatWithMessages, getSignedUser }) => {
    const user = getSignedUser();
    const chat = await getChatWithMessages(id, user.id);

    if (!chat) return { status: 404, messages: "Not Found" };
    
    return { status: 200, chat };
  }, { isSignIn: true })
  .post("/send-msg", async ({ server, body, getSignedUser, createMessage, getChatIfUserIn, getUsersFromChat }) => {
    const user = getSignedUser();
    const chat = await getChatIfUserIn(user.id, body.chatId);

    if (!chat) return "TODO: return something better";

    const msg = await createMessage({ ...body, userId: user.id });
    
    if (!msg) return { status: 400, message: "Bad request" };

    const users = await getUsersFromChat(msg.chatId);
    
    users?.forEach(user => server?.publish(`notify:${user.id}`, JSON.stringify(msg)));

    return { status: 201, message: "Message has been sent" };
  }, { isSignIn: true, canSend: true, body: t.Object({ chatId: t.String(), content: t.String() }) })
  .ws("/", {
    query: t.Object({
      token: t.String(),
    }),
    body: t.String(),

    async open({ data: { query, jwt, getUser }, ...ws }) {
      const { token } = query;

      
      const payload = await jwt.verify(token);
      if (!payload || !payload.sub) return ws.close();

      const user = await getUser(payload.sub);
      if (!user) return ws.close();

      ws.subscribe(`notify:${user.id}`);
    },

    message(ws, chatId) {
      console.log(chatId);
      ws.subscribe(chatId);
    },
  });

