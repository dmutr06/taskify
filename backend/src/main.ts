import { Elysia } from "elysia";
import { userRouter } from "./user";
import { authRouter } from "./auth";
import { chatRouter } from "./chat";
import { cors } from "@elysiajs/cors";

const app = new Elysia();

app
  .use(cors())
  .use(userRouter)
  .use(authRouter)
  .use(chatRouter)
  .get("/", () => "Hello Elysia")
  .listen(6969);


console.log(
  `Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
