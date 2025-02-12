import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("auth", "routes/auth/auth.tsx"),
  route("auth/callback", "routes/auth/callback.tsx"),
  route("/", "routes/AuthProvider.tsx", [
    route("chats", "routes/dashboard.tsx", [
      route(":id", "routes/chat.tsx"),
    ]), 
  ]),
] satisfies RouteConfig;

